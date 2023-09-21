<script>
  import NewHabitForm from "../../../lib/components/NewHabitForm.svelte";
  import { ArrowLeft } from "phosphor-svelte";
</script>

<div class="text-xl">
  <p>Create a new habit here!</p>
</div>

<NewHabitForm />

<a href="/app" class="btn btn-secondary text-2xl font-bold">
  <span class="mr-2"> <ArrowLeft weight="bold" /> </span> back</a
>
