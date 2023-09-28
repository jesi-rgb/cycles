<script>
  import DayProgress from "./DayProgress.svelte";

  export let dayProgress;
  const days = ["m", "t", "w", "t", "f", "s", "s"];
  const todayIndex = new Date().getUTCDay() - 1;
</script>

<div class="flex flex-row justify-between mt-1 mb-5">
  {#each days as day, i}
    <DayProgress
      size="45"
      {day}
      {dayProgress}
      future={todayIndex < i ? true : false}
      past={todayIndex > i ? true : false}
    />
  {/each}
</div>
