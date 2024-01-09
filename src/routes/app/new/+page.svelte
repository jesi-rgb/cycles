<script>
  import NewHabitForm from "../../../lib/components/NewHabitForm.svelte";
  import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
</script>

<section class="md:w-[50%] mx-auto">
  <div class="text-2xl font-semibold">
    <p>Create a new habit here!</p>
  </div>

  <NewHabitForm />

  <a href="/app" class="btn btn-secondary text-xl font-bold w-fit group">
    <span class="mr-5">
      <ArrowLeft
        class="group-hover:-translate-x-1 transition-transform"
        weight="bold"
      />
    </span> BACK</a
  >
</section>
