<script>
  //fetch all habits and display them

  import { page } from "$app/stores";
  import { supabaseClient } from "$lib/supabaseClient";
  import { habits } from "../../stores.js";
  import { onMount } from "svelte";

  import Habit from "../../lib/components/Habit.svelte";
  import { Plus } from "phosphor-svelte";

  const groupBy = (x, f) =>
    x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {});

  const session = $page.data.session;
  const { user } = session;
  let habitNumber;
  // let groupedHabits;
  // $: if ($habits != undefined && $habits.length > 0) {
  //   groupedHabits = groupBy($habits, (h) => h.category);
  // }
  console.log($habits);
  $: groupedHabits = $habits;

  const fetchHabits = async () => {
    try {
      let { data, error, status } = await supabaseClient
        .from("habits")
        .select("*")
        .eq("created_by", user.id);

      if (data) {
        habitNumber = data.length;

        data.sort((h1, h2) => h1.id - h2.id);

        habits.set(data);
        groupedHabits = groupBy(data, (h) => h.category);
      }

      if (error && status !== 406) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    }
  };

  onMount(() => {
    groupedHabits = $habits;
    fetchHabits();
  });
</script>

<svelte:head>
  <title>Cycles — {habitNumber} habits</title>
</svelte:head>

{#await fetchHabits()}
  <div class="text-4xl">Loading habits...</div>
  <span class="loading loading-spinner loading-lg" />
{:then habitsResponse}
  {#if $habits.length == 0}
    <div class="text-2xl text-center">
      <div>There are no habits created, yet.</div>
      <div class="text-3xl mt-10 my-auto h-fit">
        Let's start by{" "}<a class="underline text-accent" href="/app/new">
          creating one</a
        >.
      </div>
    </div>
  {:else}
    <div class="w-full">
      {#each Object.entries(groupedHabits) as [category, categoryHabits]}
        <div class="divider text-neutral-content font-bold text-2xl">
          {category}
        </div>
        {#each categoryHabits as habit}
          <Habit {habit} {user} />
        {/each}
      {/each}
    </div>
    <a
      href="/app/new"
      class="btn btn-circle btn-secondary btn-md text-6xl font-bold self-end absolute bottom-5"
    >
      <Plus weight="bold" size={32} />
    </a>
  {/if}
{/await}
