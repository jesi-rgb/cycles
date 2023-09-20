<script>
  import Count from "./Count.svelte";
  import HabitTitle from "./HabitTitle.svelte";

  export let habit;
  export let user;
</script>

<div class="flex flex-row items-center justify-between mb-5">
  <div class="w-1/4">
    <Count {habit} {user} />
  </div>
  <div class="w-3/4">
    <HabitTitle {habit} {user} />
  </div>
</div>
