<script>
  import { fly } from "svelte/transition";
  import DayProgress from "./DayProgress.svelte";
  import { DateTime } from "luxon";

  export let dayProgress;
  const days = ["m", "t", "w", "t", "f", "s", "s"];

  //month day for this week's start
  const weekDays = Array.from({ length: 7 }).map(
    (d, i) => DateTime.now().startOf("week").plus({ days: i }).day,
  );

  const todayIndex = DateTime.now().weekday - 1;
</script>

<div
  class="z-10 bg-base-100 w-full mx-auto px-5 pt-3 rounded-xl flex flex-row justify-between mt-1 mb-2"
>
  {#each days as day, i}
    <div in:fly={{ x: -5, duration: 200, delay: 50 * i }}>
      <DayProgress
        {day}
        {dayProgress}
        size="45"
        weekDay={weekDays[i]}
        future={todayIndex < i ? true : false}
        past={todayIndex > i ? true : false}
      />
    </div>
  {/each}
</div>
