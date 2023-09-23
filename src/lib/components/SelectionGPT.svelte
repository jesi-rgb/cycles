<script>
  let searchTerm = ""; // To store the search term
  let isOpen = false; // To track whether the dropdown is open

  // Array of options
  export let options;
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

  // Function to filter options based on the search term
  function filteredOptions() {
    console.log(options);
    if (options === undefined || options === null || options.length == 0)
      return [];
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
</script>

<div class="relative">
  <input
    type="text"
    class="w-full input input-bordered input-secondary border-2 focus:input-accent"
    placeholder="Select an option..."
    bind:value={searchTerm}
    on:click={toggleDropdown}
  />
  {#if isOpen}
    <div
      class="absolute top-10 left-0 z-10 w-full bg-base-200 border rounded shadow"
    >
      {#each filteredOptions() as option}
        <div
          class="p-2 cursor-pointer hover:bg-base-300"
          on:click={() => handleSelection(option)}
        >
          {option}
        </div>
      {/each}
    </div>
  {/if}
</div>
