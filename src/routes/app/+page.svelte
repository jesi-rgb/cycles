<script>
  //fetch all habits and display them

  import { groupBy, updateTimesAndReset } from "$lib/utils.js";
  import { fly } from "svelte/transition";
  import { page } from "$app/stores";
  import { supabaseClient } from "$lib/supabaseClient";
  import { habits } from "../../stores.js";

  import Habit from "../../lib/components/Habit.svelte";
  import Plus from "phosphor-svelte/lib/Plus";
  import Sparkle from "phosphor-svelte/lib/Sparkle";
  import Spinner from "../../lib/components/Spinner.svelte";
  import WeekProgress from "../../lib/components/WeekProgress.svelte";
  import DayChart from "../../lib/components/DayChart.svelte";
  import { onDestroy, onMount } from "svelte";
  import Dashboard from "../../lib/components/Dashboard.svelte";

  const session = $page.data.session;
  const { user } = session;

  let habitNumber;
  let groupedHabits = [];
  $: groupedHabits = groupBy($habits, (h) => h.category);

  const fetchHabits = async () => {
    try {
      let { data, error, status } = await supabaseClient
        .from("habits")
        .select("*")
        .eq("created_by", user.id);

      if (data) {
        habitNumber = data.length;

        if (data.length > 0) {
          data.sort((h1, h2) => h2.id - h1.id);

          let updatedData = await updateTimesAndReset(data);

          // habits.set(updatedData);
          $habits = updatedData;

          groupedHabits = groupBy($habits, (h) => h.category);
        } else {
          habits.set([]);
        }

        updated = false;
      }

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  };

  let updated = false;

  $: dayProgress = $habits.filter((h) => {
    return h.current_count >= h.target_count;
  }).length;

  let interval;
  onMount(() => {
    fetchHabits();
  });
</script>

<svelte:head>
  <title>Cycles — {habitNumber} habits</title>
</svelte:head>

{#if $habits.length == 0}
  <div class="flex space-x-4 items-center my-auto">
    <Spinner />
    <div class="text-4xl font-bold">Loading habits...</div>
  </div>
{:else}
  <div class="lg:flex mb-10">
    <div class="lg:w-1/2 lg:p-10">
      {#if $habits.length == 0}
        <div class="text-xl my-auto text-center">
          <div>There are no habits created, yet.</div>
          <a
            in:fly={{ y: -5, duration: 200 }}
            class="btn btn-accent btn-lg my-10 font-bold group"
            href="/app/new"
          >
            <span class="inline-block self-center mr-4"
              ><Sparkle
                weight="fill"
                size={35}
                class="group-hover:rotate-12 transition-transform"
              /></span
            > create one</a
          >
        </div>
      {:else}
        <div class="sticky z-[99] top-0 rounded-xl bg-base-100">
          <WeekProgress {dayProgress} />
        </div>

        <div class="">
          <DayChart {user} />
        </div>

        <div class="w-full">
          {#each Object.entries(groupedHabits) as [category, categoryHabits], i}
            <div in:fly={{ y: -10, duration: 800, delay: 100 * i }}>
              <div class="divider text-neutral-content font-bold text-2xl">
                {category}
              </div>
              {#each categoryHabits as habit}
                <Habit bind:updated {habit} {user} />
              {/each}
            </div>
          {/each}
        </div>
        <a
          href="/app/new"
          class="btn btn-circle btn-secondary btn-md text-6xl font-bold absolute bottom-2 group"
        >
          <Plus
            weight="bold"
            class="group-hover:rotate-90 duration-300 transition-transform"
            size={32}
          />
        </a>
      {/if}
    </div>
    <!-- dashboard if xl screen -->
    <Dashboard />
  </div>
{/if}
