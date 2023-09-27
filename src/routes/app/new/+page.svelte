<script>
  import NewHabitForm from "../../../lib/components/NewHabitForm.svelte";
  import { ArrowLeft } from "phosphor-svelte";
</script>

<div class="text-xl">
  <p>Create a new habit here!</p>
</div>

<NewHabitForm />

<a href="/app" class="btn btn-secondary text-xl font-bold w-fit group">
  <span class="mr-5">
    <ArrowLeft
      class="group-hover:-translate-x-1 transition-transform"
      weight="bold"
    />
  </span> back</a
>
