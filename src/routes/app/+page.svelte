<script>
  //fetch all habits and display them

  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { supabaseClient } from "$lib/supabaseClient";

  const session = $page.data.session;
  let loading = false;
  let habits = [];
  // let title = null;
  // let created_at = null;
  // let target_count = null;
  // let current_count = null;
  // let category = null;
  const fetchHabits = async () => {
    try {
      loading = true;
      const { user } = session;

      let { data, error } = await supabaseClient.from("habits").select("*");
      // .eq("created_by", user.id);

      if (data) {
        habits = data;
      }

      if (error && status !== 406) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    fetchHabits();
  });
</script>

{#if loading}
  <div class="text-6xl">Loading habits...</div>
  <span class="loading loading-spinner loading-lg" />
{:else}
  <ul class="list-item">
    {#each habits as habit}
      <li>{habit.title}</li>
    {/each}
  </ul>
{/if}
