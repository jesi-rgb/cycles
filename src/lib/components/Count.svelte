<script>
  import { supabaseClient } from "$lib/supabaseClient";

  export let habit;
  let currentCount = habit.current_count;

  const updateCurrentCount = async (id, current) => {
    try {
      const { data, error } = await supabaseClient
        .from("habits")
        .update({ current_count: `${current + 1}` })
        .eq("id", id)
        .select()
        .single();

      if (data) {
        currentCount = data.current_count;
        console.log(currentCount);
      }
    } catch (error) {
      console.error(error);
    }
  };
</script>

{#if currentCount < habit.target_count}
  <button
    on:click={updateCurrentCount(habit.id, currentCount)}
    class="btn btn-circle btn-lg btn-outline text-2xl flex flex-row rounded-full cursor-pointer"
  >
    <span>
      {currentCount}⁄{habit.target_count}
    </span>
  </button>
{:else}
  <button
    on:click={updateCurrentCount(habit.id, currentCount)}
    class="btn btn-circle btn-lg btn-accent text-3xl font-bold flex flex-row rounded-full cursor-pointer"
  >
    <span>
      {currentCount}⁄{habit.target_count}
    </span>
  </button>
{/if}
