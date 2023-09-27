<script>
  //fetch all habits and display them

  import { fly } from "svelte/transition";
  import { page } from "$app/stores";
  import { supabaseClient } from "$lib/supabaseClient";
  import { habits } from "../../stores.js";
  import { onMount } from "svelte";

  import Habit from "../../lib/components/Habit.svelte";
  import { Plus } from "phosphor-svelte";
  import { DateTime } from "luxon";
  import Spinner from "../../lib/components/Spinner.svelte";

  const groupBy = (x, f) =>
    x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {});

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
          data.sort((h1, h2) => h1.id - h2.id);
          let updatedData = await updateTimesAndReset(data);
          habits.set(updatedData);
          groupedHabits = groupBy($habits, (h) => h.category);
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

  async function updateTimesAndReset(data) {
    // check if any of the habits have expired and
    // update their next_update property as well as their
    // current_count resetting to 0

    const now = DateTime.now();
    let needsUpserting = false;

    const updatedData = data.map((h) => {
      const nextUpdateTime = DateTime.fromISO(h.next_update);

      //if we are over the expiring
      //time for this habit

      if (now > nextUpdateTime) {
        needsUpserting = true;

        let updatedTime;
        if (h.cycle == "daily") {
          updatedTime = DateTime.now()
            .plus({ days: 1 })
            .startOf("day")
            .set({ hour: 3 });
        } else {
          updatedTime = DateTime.now()
            .plus({ weeks: 1 })
            .startOf("week")
            .set({ hour: 3 });
        }

        //update time and current count
        h.next_update = updatedTime.toISO();
        h.current_count = 0;
      }
      return h;
    });

    if (needsUpserting) {
      try {
        const { data, error } = await supabaseClient
          .from("habits")
          .upsert(updatedData);
      } catch (error) {
        console.log(error);
      }
      needsUpserting = false;
    }

    return updatedData;
  }

  let updated = false;
  $: if (updated) {
    fetchHabits();
  }
</script>

<svelte:head>
  <title>Cycles — {habitNumber} habits</title>
</svelte:head>

{#await fetchHabits()}
  <div class="flex space-x-4 items-center">
    <Spinner />
    <div class="text-4xl">Loading habits...</div>
  </div>
{:then habitsResponse}
  {#if $habits.length == 0}
    <div class="text-xl my-auto text-center">
      <div>There are no habits created, yet.</div>
      <a
        in:fly={{ y: -20, duration: 500 }}
        class="btn btn-accent btn-xl my-10 scale-125"
        href="/app/new"
      >
        create one</a
      >
    </div>
  {:else}
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
