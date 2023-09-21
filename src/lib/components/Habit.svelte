<script>
  import { fly } from "svelte/transition";
  import Count from "./Count.svelte";
  import HabitTitle from "./HabitTitle.svelte";
  import {
    CrosshairSimple,
    PencilSimpleLine,
    Tag,
    TextAa,
    X,
  } from "phosphor-svelte";

  export let habit;
  export let user;

  let editDialog;

  let dialogTitle, dialogCount, dialogCategory;
</script>

<div class="flex flex-row items-center justify-between mb-5">
  <div class="w-1/4">
    <Count {habit} {user} />
  </div>
  <div class="w-3/4">
    <HabitTitle {habit} {user} />
  </div>
  <button on:click={editDialog.showModal()} class="btn btn-circle">
    <PencilSimpleLine size={30} />
  </button>
</div>
<dialog
  id="edit"
  class="px-5 md:px-10 pt-4 md:pt-8 pb-7 md:pb-14 rounded-xl ring-8 ring-base-100 border-2 border-accent bg-opacity-90 bg-base-300 backdrop-blur-sm w-[97%] text-xl"
  bind:this={editDialog}
>
  <div class="flex flex-col space-y-3 w-full" transition:fly>
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
      <div
        class="font-bold text-lg bg-opacity-0 bg-black focus:outline-none focus:outline-accent w-full max-w-[50%] overflow-x-scroll whitespace-nowrap text-right"
        contenteditable
      >
        {habit.title}
      </div>
    </div>

    <!--target count-->
    <div class="flex justify-between">
      <div class="flex items-center">
        <CrosshairSimple weight="fill" />
        <div class="ml-2">Target count</div>
      </div>
      <span
        inputmode="numeric"
        contenteditable
        class="font-mono px-3 font-[1000] focus:outline-none focus:outline-accent"
        >{habit.target_count}</span
      >
    </div>

    <!-- category -->
    <div class="flex justify-between">
      <div class="flex items-center">
        <Tag weight="fill" />
        <div class="ml-2">Category</div>
      </div>
      <span
        inputmode="numeric"
        contenteditable
        class="font-bold text-lg bg-opacity-0 bg-black focus:outline-none focus:outline-accent w-full max-w-[50%] overflow-x-scroll whitespace-nowrap text-right"
        >{habit.category}</span
      >
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
