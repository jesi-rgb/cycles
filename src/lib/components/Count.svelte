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

<button
  on:click={updateCurrentCount(habit.id, currentCount)}
  class="w-[45px] h-[45px] flex flex-row rounded-full border-base-content border-2 cursor-pointer"
>
  {#if currentCount >= habit.target_count}
    <span class="mx-auto w-fit self-center text-success">
      {currentCount}⁄{habit.target_count}
    </span>
  {:else}
    <span class="mx-auto w-fit self-center">
      {currentCount}⁄{habit.target_count}
    </span>
  {/if}
</button>
