<script>
  //fetch all habits and display them

  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { supabaseClient } from "$lib/supabaseClient";
  import Count from "../../lib/components/Count.svelte";
  import HabitTitle from "../../lib/components/HabitTitle.svelte";
  import NewHabitForm from "../../lib/components/NewHabitForm.svelte";

  const session = $page.data.session;
  const { user } = session;
  let loading = false;
  let categories = [];
  let habits = [];

  const fetchCategories = async () => {
    try {
      let { data, error } = await supabaseClient
        .from("habits")
        .select("category")
        .eq("created_by", user.id);

      if (data) {
        categories = data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchHabits = async () => {
    try {
      loading = true;

      let { data, error, status } = await supabaseClient
        .from("habits")
        .select("*")
        .eq("created_by", user.id);

      if (data) {
        habits = data;
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
    fetchCategories();
    fetchHabits();
  });
</script>

<svelte:head>
  <title>Cycles — {habits.length} habits</title>
</svelte:head>

{#if loading}
  <div class="text-6xl">Loading habits...</div>
  <span class="loading loading-spinner loading-lg" />
{:else if habits.length == 0}
  <div class="my-auto flex flex-col w-fit">
    <div class="text-2xl xl:text-3xl">There are no habits logged, yet.</div>
    <div class="text-2xl xl:text-3xl">How about adding one?</div>
    <NewHabitForm />
  </div>
{:else}
  <div class="w-full">
    {#each categories as { category }}
      <div class="divider text-neutral-content font-bold text-2xl">
        {category}
      </div>
      {#each habits as habit}
        <div class="flex flex-row items-center justify-between mb-5">
          <div class="w-1/4">
            <Count {habit} {user} />
          </div>
          <div class="w-3/4">
            <HabitTitle {habit} {user} />
          </div>
        </div>
      {/each}
    {/each}
  </div>
{/if}
