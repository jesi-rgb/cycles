<script>
  import { supabaseClient } from "$lib/supabaseClient";
  import { draw } from "svelte/transition";
  import { habits, history } from "../../stores";

  export let habit;
  export let user;
  export let updated;

  export let currentCount = habit.current_count;
  let targetCount = habit.target_count;

  const radius = 33; // Radius of the circle
  const circumference = 2 * Math.PI * radius;

  $: percentageValue = (currentCount / habit.target_count) * 100;
  $: dashArray = (percentageValue / 100) * circumference;
  $: dashOffset = circumference - dashArray;

  const updateCurrentCount = async () => {
    try {
      currentCount = parseInt(currentCount) + 1;
      //update store
      habits.update((habitsCallback) => {
        const hIndex = habitsCallback.findIndex(
          (h) => h.id == habit.id && h.created_by == habit.created_by,
        );
        habitsCallback[hIndex].current_count = currentCount.toString();
        return habitsCallback;
      });

      const { data, error } = await supabaseClient
        .from("habits")
        .update({ current_count: currentCount })
        .eq("created_by", user.id)
        .eq("id", habit.id)
        .select()
        .single();

      const { dataHistory, errorHistory } = await supabaseClient
        .from("history")
        .insert({
          habit_id: habit.id,
          user_uuid: user.id,
          current_count: currentCount,
          target_count: targetCount,
          completed: currentCount >= targetCount,
          type: "update",
        });

      $history = [
        ...$history,
        {
          timestamp: Date.now(),
          habit_id: habit.id,
          user_uuid: user.id,
          current_count: currentCount,
          target_count: targetCount,
          completed: currentCount >= targetCount,
          type: "update",
        },
      ];

      updated = true;
    } catch (error) {
      console.error(error);
    }
  };
  $: ccountLength = currentCount.toString().length;
  $: tcountLength = targetCount.toString().length;
</script>

{#if currentCount < habit.target_count}
  <button
    on:click={(e) => {
      e.preventDefault();
      updateCurrentCount();
    }}
    class="relative btn btn-circle btn-lg btn-ghost text-4xl flex flex-row rounded-full cursor-pointer fraction"
  >
    <svg
      class="absolute"
      width="100"
      height="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Create a circle with a stroke that grows with the percentageValue -->
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke-width="4"
        class="stroke-secondary progress-circle"
        stroke-dasharray={circumference}
        stroke-dashoffset={dashOffset}
        stroke-linecap="round"
        transform="rotate(-90, 50, 50)"
      />
    </svg>
    <span class={ccountLength + tcountLength >= 4 ? "text-3xl" : ""}>
      <sup>{currentCount.toString()}</sup>⁄<sub>
        {habit.target_count.toString()}
      </sub>
    </span>
  </button>
{:else}
  <button
    on:click={(e) => {
      e.preventDefault();
      updateCurrentCount(habit.id, currentCount);
    }}
    class="relative btn btn-circle btn-lg btn-accent text-4xl font-bold flex flex-row rounded-full cursor-pointer fraction completed"
  >
    <span class={ccountLength + tcountLength >= 4 ? "text-3xl " : ""}>
      <sup>{currentCount.toString()}</sup>⁄<sub>
        {habit.target_count.toString()}
      </sub>
    </span>
    <svg
      class="absolute hover:rotate-360 hover:fill-black transition-transform duration-700"
      width="100"
      height="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        in:draw
        fill="none"
        stroke-width="3"
        stroke-dasharray="10 20"
        stroke-linecap="round"
        class="stroke-base-content"
        transform="rotate(-90, 50, 50)"
      /></svg
    >
  </button>
{/if}

<style>
  .fraction {
    font-family: "Recursive";
    font-variant-numeric: diagonal-fractions;
    font-variation-settings:
      "MONO" 0,
      "CASL" 0.5;
    font-weight: 390;
  }
  .completed {
    font-weight: 1000;
    filter: drop-shadow(0px 0px 6px #ffb86ca3);
  }

  .progress-circle {
    transition: stroke-dasharray 0.8s cubic-bezier(0.19, 1, 0.22, 1);
  }
</style>
