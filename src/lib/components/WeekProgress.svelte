<script>
  import { fly } from "svelte/transition";
  import DayProgress from "./DayProgress.svelte";
  import { onMount } from "svelte";

  export let dayProgress;
  const days = ["m", "t", "w", "t", "f", "s", "s"];
  const todayIndex = new Date().getUTCDay() - 1;
</script>

<div class="flex flex-row justify-between mt-1 mb-2">
  {#each days as day, i}
    <div in:fly={{ x: -5, duration: 200, delay: 50 * i }}>
      <DayProgress
        size="45"
        {day}
        {dayProgress}
        future={todayIndex < i ? true : false}
        past={todayIndex > i ? true : false}
      />
    </div>
  {/each}
</div>
