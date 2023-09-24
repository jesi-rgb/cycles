<script>
  import { supabaseClient } from "$lib/supabaseClient";

  export let habit;
  export let user;

  let currentCount = habit.current_count;
  let targetCount = habit.target_count;

  $: percentageValue = (habit.current_count / habit.target_count) * 100;
  // $: percentageValue = 50;
  console.log("percentage", habit.current_count / habit.target_count);

  const radius = 33; // Radius of the circle
  const circumference = 2 * Math.PI * radius;
  $: dashArray = (percentageValue / 100) * circumference;
  $: dashOffset = circumference - dashArray;

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
  $: ccountLength = currentCount.toString().length;
  $: tcountLength = targetCount.toString().length;
</script>

{#if currentCount < habit.target_count}
  <button
    on:click={(e) => {
      e.preventDefault();
      updateCurrentCount(habit.id, currentCount);
    }}
    class="btn btn-circle btn-lg btn-ghost text-4xl flex flex-row rounded-full cursor-pointer fraction stroke-red-500"
  >
    <!-- <svg width="100" height="100" class="absolute"> -->
    <!--   <circle -->
    <!--     cy="50" -->
    <!--     cx="50" -->
    <!--     r="30" -->
    <!--     fill="none" -->
    <!--     z="-10" -->
    <!--     class="stroke-secondary completion" -->
    <!--     stroke-dasharray={circumference} -->
    <!--     stroke-dashoffset={dashOffset} -->
    <!--     stroke-width="3" -->
    <!--   /> -->
    <!-- </svg> -->

    <svg
      class="absolute"
      width="100"
      height="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Create a circle with no stroke -->
      <!-- <circle cx="50" cy="50" r="40" fill="none" stroke="none" /> -->

      <!-- Create a circle with a stroke that grows with the percentageValue -->
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke-width="3"
        class="stroke-secondary"
        stroke-dasharray={circumference}
        stroke-dashoffset={dashOffset}
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
