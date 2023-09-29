<script>
  import { draw } from "svelte/transition";

  export let currentCount = 0;
  let targetCount = 10;

  const radius = 33; // Radius of the circle
  const circumference = 2 * Math.PI * radius;

  $: percentageValue = (currentCount / targetCount) * 100;
  $: dashArray = (percentageValue / 100) * circumference;
  $: dashOffset = circumference - dashArray;

  $: ccountLength = currentCount.toString().length;
  $: tcountLength = targetCount.toString().length;

  let svgComplete;
</script>

{#if currentCount < targetCount}
  <button
    on:click={(e) => {
      e.preventDefault();
      currentCount += 1;
    }}
    class="btn btn-circle btn-lg btn-ghost text-4xl cursor-pointer fraction stroke-red-500"
  >
    <svg
      class="absolute"
      width="100"
      height="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- Create a circle with a stroke that grows with the percentageValue -->
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke-width="3"
        class="stroke-secondary progress-circle"
        stroke-dasharray={circumference}
        stroke-dashoffset={dashOffset}
        stroke-linecap="round"
        transform="rotate(-90, 50, 50)"
      />
    </svg>
    <span class={ccountLength + tcountLength >= 4 ? "text-3xl" : ""}>
      <sup>{currentCount.toString()}</sup>⁄<sub>
        {targetCount.toString()}
      </sub>
    </span>
  </button>
{:else}
  <button
    on:click={(e) => {
      e.preventDefault();
      currentCount += 1;
      console.log(svgComplete);
    }}
    class="relative btn btn-circle btn-lg btn-accent text-4xl font-bold flex flex-row rounded-full cursor-pointer fraction completed"
  >
    <span class={ccountLength + tcountLength >= 4 ? "text-3xl " : ""}>
      <sup>{currentCount.toString()}</sup>⁄<sub>
        {targetCount.toString()}
      </sub>
    </span>
    <svg
      class="absolute hover:rotate-360 hover:fill-black transition-transform duration-700 z-10"
      width="100"
      height="100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        bind:this={svgComplete}
        cx="50"
        cy="50"
        r={radius}
        in:draw
        fill="none"
        stroke-width="3"
        stroke-dasharray="10 20"
        stroke-linecap="round"
        class="stroke-base-content"
      >
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </button>
{/if}

<style>
  .fraction {
    font-family: "Recursive";
    font-variant-numeric: diagonal-fractions;
    font-variation-settings: "MONO" 0, "CASL" 0.5;
    font-weight: 500;
  }
  .completed {
    font-weight: 1000;
  }

  .progress-circle {
    transition: stroke-dashoffset 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  }
</style>
