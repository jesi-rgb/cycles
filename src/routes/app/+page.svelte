<script>
  //fetch all habits and display them

  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { supabaseClient } from "$lib/supabaseClient";
  import NewHabitForm from "../../lib/components/NewHabitForm.svelte";
  import Habit from "../../lib/components/Habit.svelte";
  import { Gear, GearSix, Plus } from "phosphor-svelte";

  const groupBy = (x, f) =>
    x.reduce((a, b, i) => ((a[f(b, i, x)] ||= []).push(b), a), {});

  const session = $page.data.session;
  const { user } = session;
  let loading = false;
  let habits = [];
  let habitNumber;

  const fetchHabits = async () => {
    try {
      loading = true;

      let { data, error, status } = await supabaseClient
        .from("habits")
        .select("*")
        .eq("created_by", user.id);

      if (data) {
        habitNumber = data.length;
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
  <title>Cycles — {habitNumber} habits</title>
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
    <Plus weight="bold" size={32} />
  </a>
{/if}
