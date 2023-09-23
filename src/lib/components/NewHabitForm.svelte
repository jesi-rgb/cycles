<script>
  import MultiSelect from "svelte-multiselect";
  import { page } from "$app/stores";
  import { supabaseClient } from "$lib/supabaseClient";
  import {
    ArrowsCounterClockwise,
    CrosshairSimple,
    Star,
    Tag,
  } from "phosphor-svelte";
  import { onMount } from "svelte";

  const session = $page.data.session;

  let selected,
    categories = [];

  let loading = false;
  let formTitle, formTarget, formCategory;

  async function fetchCategories() {
    try {
      const { user } = session;

      let { data, error } = await supabaseClient
        .from("habits")
        .select("category")
        .eq("created_by", user.id);

      if (data) {
        categories = data;
        console.log(categories);
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  onMount(() => fetchCategories());
</script>

<form
  class="form-control space-y-5 my-10"
  on:submit|preventDefault={createHabit}
>
  <div class="flex flex-col">
    <label for="habit" class="flex flex-row items-center text-2xl">
      <span class="mr-2"><ArrowsCounterClockwise weight="fill" /></span
      >Habit</label
    >
    <input
      type="text"
      id="habit"
      bind:value={formTitle}
      class="input input-bordered input-accent border-2"
      placeholder="Exercise"
    />
  </div>
  <div class="flex space-x-2">
    <div class="flex flex-col w-2/4 self-end">
      <label for="target" class="flex flex-row items-center text-2xl">
        <span class="mr-2"><CrosshairSimple weight="fill" /></span>Target</label
      >
      <input
        type="number"
        id="target"
        bind:value={formTarget}
        inputmode="numeric"
        min="1"
        class="input input-bordered input-accent border-2"
        placeholder="4"
      />
    </div>
    <div class="flex flex-col w-2/4">
      <label
        for="category"
        class="flex flex-row items-center text-2xl self-end"
      >
        <span class="mr-2"><Tag weight="fill" /></span>Category</label
      >
      <select
        id="category"
        bind:value={formCategory}
        class="input input-bordered input-accent border-2 appearance-none"
      >
        {#each categories as category}
          <option value={category.category}>{category.category}</option>
        {/each}
      </select>
    </div>
  </div>
  <button class="btn btn-accent text-2xl">
    <span class="mr-5"><Star weight="fill" /></span>
    {loading ? "Loading..." : "Create"}</button
  >
</form>

<style>
  :global(.virtual-list-wrapper) {
    /* hide scrollbar */
    -ms-overflow-style: none !important;
    scrollbar-width: none !important;
  }

  :global(.virtual-list-wrapper::-webkit-scrollbar) {
    /* hide scrollbar */
    display: none !important;
  }

  .wrapper {
    position: relative;
  }

  :root {
    --main: #140e78;

    --white: #fff;
    --main-lighter: #c7d2f8;
    --accent: #d0a2ff;
    --accent-darker: #7300ed;
    --text-color: #fff;

    --sms-active-color: var(--main-lighter);

    --sms-border: 1px solid var(--main-lighter);
    --sms-options-bg: #fff;
    --sms-selected-bg: var(--main);
    --sms-text-color: var(--white);
    --sms-placeholder-color: var(--main);
  }

  :global(div.multiselect > svg) {
    /* top-level wrapper div */
    color: #140e78;
  }
  :global(.remove-all > svg) {
    /* top-level wrapper div */
    color: #140e78;
  }
</style>
