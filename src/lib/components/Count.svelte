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
    on:click={updateCurrentCount(habit.id, currentCount)}
    class="btn btn-circle btn-lg btn-outline text-2xl flex flex-row rounded-full cursor-pointer fraction"
  >
    <span>
      {currentCount}/{habit.target_count}
    </span>
  </button>
{:else}
  <button
    on:click={(e) => {
      e.preventDefault();
      updateCurrentCount(habit.id, currentCount);
      e.target.blur();
      // console.log(e);
    }}
    class="btn btn-circle btn-lg btn-accent text-3xl font-bold flex flex-row rounded-full cursor-pointer fraction"
  >
    <span>
      {currentCount}/{habit.target_count}
    </span>
  </button>
{/if}

<style>
  .fraction {
    font-variant-numeric: diagonal-fractions;
    -moz-font-feature-settings: "frac";
    -webkit-font-feature-settings: "frac";
    font-feature-settings: "frac";
  }
</style>
