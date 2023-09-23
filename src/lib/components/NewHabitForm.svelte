<script>
  /* <Select */
  /*   items={categories} */
  /*   on:change={handleChange} */
  /*   bind:filterText */
  /*   searchable */
  /*   --background="#282A36" */
  /*   --input-color="#F8F8F3" */
  /*   --item-active-background="#FFB86B" */
  /*   --item-background="#282A36" */
  /*   --list-background="#282A36" */
  /*   --list-border="solid 2px #09090C" */
  /*   --item-hover-bg="#FFB86C" */
  /*   --item-hover-color="#282A36" */
  /*   --item-is-active-bg="#FFB86C" */
  /*   --item-is-active-color="#282A36" */
  /*   --item-color="#F8F8F3" */
  /*   --border-focused="solid 2px #FFB86B" */
  /*   --border="solid 2px #BE95F9" */
  /*   --border-hover="solid 2px #A36EEC" */
  /* > */
  /*   <div slot="item" let:item> */
  /*     {item.created ? "Add new: " : ""} */
  /*     {item.label} */
  /*   </div> */
  /* </Select> */
  import { page } from "$app/stores";
  import { supabaseClient } from "$lib/supabaseClient";
  import {
    ArrowsCounterClockwise,
    CrosshairSimple,
    Star,
    Tag,
  } from "phosphor-svelte";
  import { onMount } from "svelte";
  import SelectionGpt from "./SelectionGPT.svelte";
  import { habits } from "../../stores";

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

  let categories;
  onMount(() => {
    console.log($habits);
    categories = $habits.map((h) => h.category);
  });
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
      class="input input-secondary hover:border-secondary-focus focus:input-accent focus:border-accent border-2"
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
        class="input input-secondary hover:border-secondary-focus focus:input-accent focus:border-accent border-2"
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
      <SelectionGpt
        bind:options={categories}
        bind:selectedOption={formCategory}
      />
    </div>
  </div>
  <button class="btn btn-accent text-2xl">
    <span class="mr-5"><Star weight="fill" /></span>
    {loading ? "Loading..." : "Create"}</button
  >
</form>
