<script>
  import X from "phosphor-svelte/lib/X";
  import { fly } from "svelte/transition";
  let isOpen = false; // To track whether the dropdown is open

  // Array of options
  export let options;
  export let placeholder;
  export let isSearchable = true;
  $: optionsUnique = [...new Set(options)];

  export let selectedOption = ""; // To store the selected option
  $: searchTerm = selectedOption;
  $: if (searchTerm == "") {
    closeDropdown();
  }

  // Function to toggle the dropdown open/close
  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function closeDropdown() {
    isOpen = false;
  }

  function openDropdown() {
    if (!isOpen) {
      isOpen = true;
    }
  }

  // Function to handle option selection
  function handleSelection(option) {
    selectedOption = option;
    isOpen = false; // Close the dropdown after selection
    searchTerm = selectedOption;
  }

  let filteredOptions;
  $: if (!isSearchable) {
    filteredOptions = optionsUnique;
  } else {
    filteredOptions = optionsUnique?.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  function addNewOption() {
    if (optionsUnique != undefined) {
      const newOption = searchTerm;
      optionsUnique = [newOption, ...optionsUnique];
      selectedOption = newOption;
      isOpen = false; // Close the dropdown after adding
    } else {
      return [];
    }
  }
</script>

<div class="relative">
  <input
    type="text"
    class="w-full input input-bordered input-secondary border-2 focus:input-accent"
    {placeholder}
    bind:value={searchTerm}
    on:click={toggleDropdown}
    on:blur={closeDropdown}
    on:keydown={openDropdown}
  />
  {#if isOpen}
    <div
      transition:fly={{ y: -10, duration: 200 }}
      class="absolute top-10 left-0 w-full bg-base-200 border rounded shadow"
    >
      {#if filteredOptions.length === 0 && searchTerm.length > 0}
        <div
          class="p-2 cursor-pointer hover:bg-base-300"
          on:click={addNewOption}
          on:blur={closeDropdown}
        >
          ✨Add new: {searchTerm}
        </div>
      {:else}
        {#each filteredOptions as option}
          <div
            class="p-2 cursor-pointer hover:bg-base-300"
            on:blur={closeDropdown}
            on:click={() => handleSelection(option)}
          >
            {option}
          </div>
        {/each}
      {/if}
    </div>
  {/if}
  {#if searchTerm}
    <button
      class="absolute right-2 w-7 h-7 rounded-full border border-secondary text-secondary top-1/2 -translate-y-1/2 hover:bg-secondary transition-colors group"
      on:click={(e) => {
        e.preventDefault();
        searchTerm = "";
      }}
    >
      <X
        weight="bold"
        class="mx-auto group-hover:text-base-100 transition-colors"
      />
    </button>
  {/if}
</div>
