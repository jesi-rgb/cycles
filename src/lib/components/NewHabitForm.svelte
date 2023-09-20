<script>
  import { page } from "$app/stores";
  import { supabaseClient } from "$lib/supabaseClient";

  const session = $page.data.session;

  let loading = false;
  let formTitle, formTarget, formCategory;

  async function createHabit() {
    try {
      loading = true;
      const { user } = session;

      let newHabit = {
        title: formTitle,
        target_count: formTarget,
        category: formCategory,
        created_by: user.id,
      };

      let { data, error } = await supabaseClient
        .from("habits")
        .insert(newHabit);

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      loading = false;
      formTitle = "";
      formTarget = "";
      formCategory = "";
    }
  }
</script>

<form
  class="form-control space-y-5 my-10"
  on:submit|preventDefault={createHabit}
>
  <div class="flex flex-col">
    <label for="habit">Habit</label>
    <input
      type="text"
      id="habit"
      bind:value={formTitle}
      class="input input-bordered input-accent"
      placeholder="Habit title"
    />
  </div>
  <div class="flex space-x-2">
    <div class="flex flex-col w-1/4">
      <label for="target">Target Count</label>
      <input
        type="number"
        id="target"
        bind:value={formTarget}
        inputmode="numeric"
        min="1"
        class="input input-bordered input-accent"
        placeholder="4"
      />
    </div>
    <div class="flex flex-col w-3/4">
      <label for="category">Category</label>
      <input
        type="select"
        id="category"
        bind:value={formCategory}
        class="input input-bordered input-accent"
        placeholder="Category"
      />
    </div>
  </div>
  <button class="btn btn-accent text-xl"
    >{loading ? "Loading..." : "Create"}</button
  >
</form>
