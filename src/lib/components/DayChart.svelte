<script>
  import { scaleLinear, scaleUtc, scaleBand, scaleTime } from "d3-scale";
  import { max, bin } from "d3-array";
  import { DateTime } from "luxon";
  import { supabaseClient } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { groupBy } from "$lib/utils.js";

  export let user;
  let width = 300;
  let height = 30;
  let margin = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  };

  let todaysHistory = [];

  function thresholdTime(n) {
    return (data, min, max) => {
      return scaleUtc()
        .domain([DateTime.now().startOf("day"), DateTime.now().endOf("day")])
        .ticks(n);
    };
  }

  $: bins = bin()
    .value((d) => new Date(d.timestamp))
    .thresholds(thresholdTime(24))(todaysHistory);

  $: console.log(bins);

  async function fetchHistory() {
    try {
      const { data, error } = await supabaseClient
        .from("history")
        .select("*")
        .eq("user_uuid", user.id)
        .gte("timestamp", DateTime.now().startOf("day"));

      // todaysHistory = groupBy(data, (d) => new Date(d.timestamp).getHours());
      todaysHistory = data;
    } catch (error) {
      console.error(error);
    }
  }

  onMount(() => {
    fetchHistory();
  });

  let times = Array(24)
    .fill(0)
    .map((d, i) => i);

  $: x = scaleBand(times, [margin.left, width - margin.right - margin.left]);

  $: y = scaleLinear(
    [0, max(Object.values(todaysHistory), (d) => d.length)],
    [height - margin.bottom, margin.top],
  ).nice();
</script>

<div bind:clientWidth={width}>
  <svg {width} {height}>
    <g transform="translate({margin.left},{height - margin.bottom})">
      <line class="stroke-base-content/30" x1={0} x2={width - margin.right} />
      {#each times as t, i}
        <line
          class="stroke-base-content/50"
          x1={x(t)}
          x2={x(t)}
          y1={0}
          y2={3}
        />

        {#if i % 10 == 0}
          <text
            text-anchor="middle"
            x={x(t)}
            y={22}
            class="tabular-nums text-xs fill-base-content font-bold"
          >
            {t}
          </text>
        {/if}
      {/each}
    </g>
    {#each times as t, i}
      <rect
        x={x(t)}
        y={y(i / 2)}
        width={x.bandwidth()}
        height={height - margin.bottom - y(i / 2)}
        class="fill-base-content"
      />
    {/each}

    <g transform="translate({margin.left},{0})">
      <line
        class="stroke-base-content/30"
        y1={margin.top}
        y2={height - margin.bottom}
      />
    </g>
  </svg>
</div>
