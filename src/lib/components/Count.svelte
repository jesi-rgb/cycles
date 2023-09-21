<script>
  import { supabaseClient } from "$lib/supabaseClient";

  export let habit;
  export let user;

  let currentCount = habit.current_count;

  const updateCurrentCount = async (id, current) => {
    try {
      const { data, error } = await supabaseClient
        .from("habits")
        .update({ current_count: `${current + 1}` })
        .eq("created_by", user.id)
        .eq("id", id)
        .select()
        .single();

      if (data) {
        currentCount = data.current_count;
      }
    } catch (error) {
      console.error(error);
    }
  };
</script>

{#if currentCount < habit.target_count}
  <button
    on:click={(e) => {
      e.preventDefault();
      updateCurrentCount(habit.id, currentCount);
    }}
    class="btn btn-circle btn-lg btn-outline text-4xl flex flex-row rounded-full cursor-pointer fraction"
  >
    <span>
      <sup>{currentCount.toString()}</sup>⁄<sub
        >{habit.target_count.toString()}</sub
      >
    </span>
  </button>
{:else}
  <button
    on:click={(e) => {
      e.preventDefault();
      updateCurrentCount(habit.id, currentCount);
    }}
    class="btn btn-circle btn-lg btn-accent text-4xl font-bold flex flex-row rounded-full cursor-pointer fraction completed"
  >
    <span>
      <sup>{currentCount}</sup>⁄<sub>{habit.target_count}</sub>
    </span>
  </button>
{/if}

<style>
  .fraction {
    font-family: "Recursive";
    font-variant-numeric: diagonal-fractions;
    font-variation-settings: "MONO" 0, "CASL" 0.5;
    font-weight: 500;
  }
  .completed {
    font-weight: 1000;
  }
</style>
