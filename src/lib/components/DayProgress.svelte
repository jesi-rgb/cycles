<script>
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import { DateTime } from "luxon";

  export let size = 100;

  let radius = size / 2.7;

  export let day = "m";
  export let weekDay;
  export let past = false;
  export let future = false;
  export let dayProgress;

  let time = new Date();
  $: hours = time.getHours();

  const circumference = 2 * Math.PI * radius;
  $: percentageValue = (hours / 24) * 100;

  $: dashArray = (percentageValue / 100) * circumference;
  $: dashOffset = circumference - dashArray;

  onMount(() => {
    const interval = setInterval(
      () => {
        time = new Date();
      },
      1000 * 60 * 60,
    );

    return () => {
      clearInterval(interval);
    };
  });
</script>

<div class="w-fit">
  <svg
    viewBox="0 0 {size} {size}"
    width={size}
    height={parseInt(size) + 20}
    xmlns="http://www.w3.org/2000/svg"
  >
    {#if past}
      <text
        x={size / 2}
        font-size="15"
        class="fill-neutral font-mono font-semibold recursive"
        text-anchor="middle"
        dy="-2"
        dominant-baseline="middle">{weekDay}</text
      >
      <!-- Render days before today in an understated manner -->
      <text
        x={size / 2}
        y={size / 2}
        font-size="20"
        class="fill-neutral font-mono font-semibold recursive"
        text-anchor="middle"
        dy="2"
        dominant-baseline="middle">{day.toUpperCase()}</text
      >
      <circle
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        stroke-width="4"
        class="stroke-neutral progress-circle"
        stroke-linecap="round"
        transform="rotate(-90, {parseInt(size) / 2} {parseInt(size) / 2})"
      />
    {:else if future}
      <text
        x={size / 2}
        y={0}
        font-size="15"
        class="fill-base-content font-mono font-semibold recursive"
        opacity=".6"
        text-anchor="middle"
        dy="-2"
        dominant-baseline="middle">{weekDay}</text
      >
      <text
        x={size / 2}
        y={size / 2}
        font-size="20"
        class="fill-base-content font-mono font-semibold recursive"
        opacity=".6"
        dy="2"
        text-anchor="middle"
        dominant-baseline="middle">{day.toUpperCase()}</text
      >
      <circle
        cx={size / 2}
        cy={size / 2}
        fill="none"
        r={radius}
        stroke-width="3"
        stroke-opacity=".7"
        class="stroke-secondary progress-circle"
        stroke-dasharray="10"
        stroke-linecap="round"
        transform="rotate(-90, {parseInt(size) / 2} {parseInt(size) / 2})"
      />
    {:else}
      <!-- Today's progress -->
      {#key dayProgress}
        <text
          x={size / 2}
          y={size / 2}
          font-size="23"
          class="fill-[#D6D7DB] font-mono font-extrabold recursive"
          dy="2"
          text-anchor="middle"
          dominant-baseline="middle">{day.toUpperCase()}</text
        >

        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          stroke-width="3"
          class="stroke-primary progress-circle"
          stroke-dasharray={circumference}
          stroke-dashoffset={dashOffset}
          stroke-linecap="round"
          transform="rotate(-90, {parseInt(size) / 2} {parseInt(size) / 2})"
        />

        <g in:fly={{ y: -10, duration: 600 }}>
          <defs>
            <text
              x={size / 2}
              y={size / 2 + 20}
              class="fill-white font-mono recursive font-extrabold"
              stroke-width="3"
              id="textOuter"
              text-anchor="middle"
              dominant-baseline="middle">{dayProgress}</text
            >
            <mask id="outerStroke">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <use xlink:href="#textOuter" fill="#000" />
            </mask>
          </defs>
          <use
            xlink:href="#textOuter"
            class="stroke-base-100"
            fill="none"
            mask="url(#outerStroke)"
          />
          <text
            x={size / 2}
            y={size / 2 + 20}
            class="fill-accent font-mono font-extrabold recursive"
            text-anchor="middle"
            dominant-baseline="middle">{dayProgress}</text
          >
        </g>
      {/key}
      <text
        x={size / 2}
        y={0}
        font-size="15"
        class="fill-base-content font-mono font-semibold recursive"
        text-anchor="middle"
        dy="-2"
        dominant-baseline="middle">{weekDay}</text
      >
    {/if}
  </svg>
</div>

<style>
  .recursive {
    font-variation-settings:
      "MONO" 0,
      "CASL" 0.5;
  }
</style>
