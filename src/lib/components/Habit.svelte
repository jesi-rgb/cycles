<script>
  import { supabaseClient } from "$lib/supabaseClient";

  import Count from "./Count.svelte";
  import HabitTitle from "./HabitTitle.svelte";
  import {
    CheckFat,
    CrosshairSimple,
    FloppyDisk,
    PencilSimpleLine,
    Tag,
    TextAa,
    X,
  } from "phosphor-svelte";

  export let habit;
  export let user;

  let editDialog;

  let loading = false,
    success = false;

  let dialogTitle = habit.title,
    dialogCount = habit.target_count,
    dialogCategory = habit.category;

  const updateHabit = async () => {
    try {
      loading = true;

      let updateData = {
        title: dialogTitle,
        target_count: dialogCount,
        category: dialogCategory,
        id: habit.id,
        created_by: user.id,
      };

      const { data, error } = await supabaseClient
        .from("habits")
        .upsert(updateData)
        .select()
        .single();

      habit = updateData;
      if (data) success = true;

      console.log(data);
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
    }
  };
</script>

<div class="flex flex-row items-center justify-between space-x-3 mb-5">
  <div class="w-1/4">
    <Count {habit} {user} />
  </div>
  <div class="w-3/4">
    <HabitTitle title={habit.title} />
  </div>
  <button on:click={editDialog.showModal()} class="btn btn-circle">
    <PencilSimpleLine size={30} />
  </button>
</div>

<!-- dialog to allow edits on the habit -->
<dialog
  id="edit"
  class="px-5 md:px-10 pt-4 md:pt-8 pb-7 md:pb-14 rounded-xl ring-8 ring-base-100 bg-gradient-to-b from-base-100/90 to-base-300/90 border-2 border-accent bg-opacity-40 bg-base-300 backdrop-blur-sm w-[97%] text-xl"
  bind:this={editDialog}
>
  <div class="flex flex-col space-y-5 w-full">
    <form method="dialog" class="mb-10 flex justify-between">
      <!-- if there is a button in form, it will close the modal -->
      <p class="font-bold text-2xl">Edit the properties</p>
      <button class="btn btn-sm btn-circle"> <X weight="bold" /> </button>
    </form>

    <!--title-->
    <div class="flex justify-between">
      <div class="flex items-center">
        <TextAa weight="fill" />
        <div class="ml-2">Title</div>
      </div>
      <input
        class="font-bold text-lg bg-opacity-0 bg-black focus:outline-none focus:outline-accent w-full max-w-[50%] overflow-x-scroll whitespace-nowrap text-right"
        placeholder={dialogTitle}
        bind:value={dialogTitle}
        type="text"
      />
    </div>

    <div class="divider" />

    <!--target count-->
    <div class="flex justify-between">
      <div class="flex items-center">
        <CrosshairSimple weight="fill" />
        <div class="ml-2">Target count</div>
      </div>
      <input
        inputmode="numeric"
        type="number"
        bind:value={dialogCount}
        class="font-mono font-[1000] focus:outline-none w-1/3 focus:outline-accent text-right bg-opacity-0 bg-black"
        placeholder={dialogCount}
      />
    </div>

    <div class="divider" />

    <!-- category -->
    <div class="flex justify-between">
      <div class="flex items-center">
        <Tag weight="fill" />
        <div class="ml-2">Category</div>
      </div>
      <input
        bind:value={dialogCategory}
        type="text"
        class="font-bold text-lg bg-opacity-0 bg-black focus:outline-none focus:outline-accent w-min overflow-x-scroll whitespace-nowrap text-right"
        placeholder={dialogCategory}
      />
    </div>

    <button
      on:click={updateHabit}
      class="btn btn-secondary text-2xl font-thin self-end"
    >
      {#if loading}
        <span class="ml-5">saving...</span>
      {:else if success}
        <CheckFat weight="fill" />
        <span class="ml-5">saved</span>
      {:else}
        <FloppyDisk weight="fill" />
        <span class="ml-5">save</span>
      {/if}
    </button>
  </div>
</dialog>

<style>
  dialog[open] {
    animation: zoom 0.3s cubic-bezier(0, 0.67, 0.39, 1.01);
  }

  @keyframes zoom {
    from {
      transform: scale(0.9);
    }
    to {
      transform: scale(1);
    }
  }
  dialog[open]::backdrop {
    animation: fade 0.4s ease-out;
  }
  @keyframes fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
