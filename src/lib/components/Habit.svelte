<script>
  import { supabaseClient } from "$lib/supabaseClient";
  import { habits } from "../../stores";

  import SelectionGpt from "./SelectionGPT.svelte";
  import Count from "./Count.svelte";
  import HabitTitle from "./HabitTitle.svelte";
  import {
    CheckFat,
    CrosshairSimple,
    FloppyDisk,
    PencilSimpleLine,
    Tag,
    TextAa,
    Trash,
    X,
  } from "phosphor-svelte";
  import { DateTime } from "luxon";

  export let habit;
  export let user;
  export let updated;

  let editDialog;

  let askUserDelete = false;

  let loading = false,
    success = false;

  let dialogTitle = habit.title,
    dialogCount = habit.target_count,
    dialogCategory = habit.category;

  let currentCount = habit.current_count;

  const deleteHabit = async () => {
    try {
      const { error } = await supabaseClient
        .from("habits")
        .delete()
        .eq("created_by", user.id)
        .eq("id", habit.id);

      //delete it from store to trigger reactivity
      habits.set(
        $habits.filter(
          (h) => h.id != habit.id || h.created_by != habit.created_by
        )
      );
    } catch (error) {
      console.error(error);
    } finally {
      askUserDelete = false;
      editDialog.close();
    }
  };

  const updateHabit = async () => {
    try {
      loading = true;
      updated = true;

      let updateData = {
        title: dialogTitle,
        target_count: dialogCount,
        current_count: currentCount,
        category: dialogCategory,
        id: habit.id,
        created_by: user.id,
        next_update: habit.next_update,
        cycle: habit.cycle,
      };

      const { data, error } = await supabaseClient
        .from("habits")
        .upsert(updateData)
        .select()
        .single();

      habits.update((habitsCallback) => {
        const hIndex = habitsCallback.findIndex(
          (h) => h.id == habit.id && h.created_by == habit.created_by
        );
        habitsCallback[hIndex] = updateData;
        return habitsCallback;
      });

      if (data && $habits) success = true;
    } catch (error) {
      console.error(error);
    } finally {
      loading = false;
      success = false;
      editDialog.close();
    }
  };

  $: categories = $habits.map((h) => h.category);
</script>

<div class="flex flex-row items-center justify-between space-x-3 mb-5">
  <div class="w-1/4">
    <Count bind:updated bind:currentCount {habit} {user} />
  </div>
  <div class="w-3/4 flex items-center space-x-1 h-28">
    <div class="flex flex-col justify-evenly h-full my-auto">
      <HabitTitle title={habit.title} />
      <div class="flex space-x-3 text-sm">
        <div class="badge badge-primary badge-outline font-bold">
          {habit.cycle}
        </div>
        <div class="text-secondary">
          {DateTime.fromISO(habit.next_update).toRelative()}
        </div>
      </div>
    </div>
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
      <SelectionGpt
        bind:options={categories}
        bind:selectedOption={dialogCategory}
      />
    </div>

    <div class="flex justify-between pt-10">
      <div>
        {#if !askUserDelete}
          <button
            on:click={() => (askUserDelete = true)}
            class="btn btn-error self-start"
          >
            <span class="mr-5"> <Trash weight="fill" /> </span> delete
          </button>
        {:else}
          <button on:click={deleteHabit} class="btn btn-error self-start">
            <span class="mr-5"> <Trash weight="fill" /> </span> sure?
          </button>
        {/if}
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
