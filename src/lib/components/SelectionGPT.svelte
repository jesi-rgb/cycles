<script>
  import { fly } from "svelte/transition";
  let searchTerm = ""; // To store the search term
  let isOpen = false; // To track whether the dropdown is open

  // Array of options
  export let options;
  export let currentlySelected;
  $: optionsUnique = [...new Set(options)];

  export let selectedOption = ""; // To store the selected option

  // Function to toggle the dropdown open/close
  function toggleDropdown() {
    isOpen = !isOpen;
  }
  function closeDropdown() {
    isOpen = false;
  }

  // Function to handle option selection
  function handleSelection(option) {
    selectedOption = option;
    isOpen = false; // Close the dropdown after selection
    searchTerm = option;
  }

  $: filteredOptions = optionsUnique?.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    placeholder={currentlySelected}
    bind:value={searchTerm}
    on:click={toggleDropdown}
  />
  {#if isOpen}
    <div
      transition:fly={{ y: -10, duration: 200 }}
      class="absolute top-10 left-0 z-10 w-full bg-base-200 border rounded shadow"
    >
      {#if filteredOptions.length === 0 && searchTerm.length > 0}
        <div
          class="p-2 cursor-pointer hover:bg-base-300"
          on:click={addNewOption}
          on:blur={closeDropdown}
        >
          Add new: {searchTerm}
        </div>
      {:else if filteredOptions != undefined}
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
</div>
