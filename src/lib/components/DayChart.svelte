<script>
  import { scaleLinear, scaleBand } from "d3-scale";
  import { max } from "d3-array";
  import { DateTime } from "luxon";
  import { supabaseClient } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { history } from "../../stores";

  export let user;

  let width = 300;
  let height = 40;
  let margin = {
    top: 10,
    bottom: 15,
    left: 4,
    right: 4,
  };

  function getHourlyHistogram(events) {
    let histogram = {};

    for (let i = 0; i < events.length; i++) {
      const hour = new Date(events[i].timestamp).getHours();
      if (histogram[hour] == undefined) {
        histogram[hour] = 1;
      } else {
        histogram[hour] += 1;
      }
    }
    return histogram;
  }

  $: bins = getHourlyHistogram($history);

  async function fetchHistory() {
    try {
      const { data, error } = await supabaseClient
        .from("history")
        .select("*")
        .eq("user_uuid", user.id)
        .gte("timestamp", DateTime.now().startOf("day"));

      // todaysHistory = groupBy(data, (d) => new Date(d.timestamp).getHours());
      $history = data;
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

  $: x = scaleBand(times, [0, width - margin.right]);

  $: y = scaleLinear(
    [0, max(Object.values(bins))],
    [height - margin.bottom, margin.top],
  ).nice();
</script>

<div class="mx-auto w-full" bind:clientWidth={width}>
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

        {#if i % 2 == 0}
          <text
            text-anchor="middle"
            x={x(t)}
            dx={x.bandwidth() / 2}
            y={5}
            alignment-baseline="hanging"
            class="tabular-nums text-xs fill-base-content/30"
          >
            {t}
          </text>
        {/if}
      {/each}
    </g>
    <g transform="translate({margin.left},{0})">
      {#each Object.entries(bins) as d, i}
        <g class="group">
          <text
            class="text-[8px] sm:text-xs fill-base-content opacity-0 group-hover:opacity-80"
            x={x(+d[0])}
            dx={x.bandwidth() / 2}
            text-anchor="middle"
            y={y(+d[1])}
            dy={-2}
          >
            {+d[1]}
          </text>
          <rect
            x={x(+d[0])}
            y={y(d[1])}
            width={x.bandwidth()}
            height={height - margin.bottom - y(d[1])}
            class="fill-base-content hover:opacity-50 transition-all"
          />
        </g>
      {/each}
    </g>
  </svg>
</div>
