<script>
  //fetch all habits and display them

  import { groupBy, decryptData, updateTimesAndReset } from "$lib/utils.js";
  import { fly } from "svelte/transition";
  import { page } from "$app/stores";
  import { supabaseClient } from "$lib/supabaseClient";
  import { habits } from "../../stores.js";

  import Habit from "../../lib/components/Habit.svelte";
  import { Plus, Sparkle } from "phosphor-svelte";
  import { DateTime } from "luxon";
  import Spinner from "../../lib/components/Spinner.svelte";
  import WeekProgress from "../../lib/components/WeekProgress.svelte";

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
        console.log(data);
        habitNumber = data.length;

        if (data.length > 0) {
          data.sort((h1, h2) => h2.id - h1.id);

          // const decryptedData = data.map((h) => {
          //   return decryptData(h, user.id);
          // });

          let updatedData = await updateTimesAndReset(data);
          habits.set(updatedData);
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
</script>

<svelte:head>
  <title>Cycles — {habitNumber} habits</title>
</svelte:head>

{#await fetchHabits()}
  <div class="flex space-x-4 items-center my-auto">
    <Spinner />
    <div class="text-4xl font-bold">Loading habits...</div>
  </div>
{:then habitsResponse}
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
    <div class="sticky -top-10 bg-base-100 z-20">
      <WeekProgress {dayProgress} />
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
      class="btn btn-circle btn-secondary btn-md text-6xl font-bold self-end absolute bottom-5 group"
    >
      <Plus
        weight="bold"
        class="group-hover:rotate-90 duration-300 transition-transform"
        size={32}
      />
    </a>
  {/if}
{/await}
