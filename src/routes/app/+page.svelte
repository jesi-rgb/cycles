<script>
  //fetch all habits and display them

  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { supabaseClient } from "$lib/supabaseClient";
  import NewHabitForm from "../../lib/components/NewHabitForm.svelte";
  import Habit from "../../lib/components/Habit.svelte";

  const groupBy = (x, f) =>
    x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {});

  const session = $page.data.session;
  const { user } = session;
  let loading = false;
  let habits = [];

  const fetchHabits = async () => {
    try {
      loading = true;

      let { data, error, status } = await supabaseClient
        .from("habits")
        .select("*")
        .eq("created_by", user.id);

      if (data) {
        data.sort((h1, h2) => h1.id - h2.id);
        let groupedHabits = groupBy(data, (h) => h.category);
        habits = groupedHabits;
      }

      if (error && status !== 406) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    fetchHabits();
  });
</script>

<svelte:head>
  <title>Cycles — {habits.length} habits</title>
</svelte:head>

{#if loading}
  <div class="text-6xl">Loading habits...</div>
  <span class="loading loading-spinner loading-lg" />
{:else if habits.length == 0 && loading}
  <div class="my-auto flex flex-col w-fit">
    <div class="text-2xl xl:text-3xl">There are no habits logged, yet.</div>
    <div class="text-2xl xl:text-3xl">How about adding one?</div>
    <NewHabitForm />
  </div>
{:else}
  <div class="w-full">
    {#each Object.entries(habits) as [category, habits]}
      <div class="divider text-neutral-content font-bold text-2xl">
        {category}
      </div>
      {#each habits as habit}
        <Habit {habit} {user} />
      {/each}
    {/each}
  </div>
  <a
    href="/app/new"
    class="btn btn-circle btn-secondary btn-md text-6xl font-bold self-end absolute bottom-5"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="#000000"
      viewBox="0 0 256 256"
      ><path
        d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"
      /></svg
    >
  </a>
{/if}
