<script>
  import { fly } from "svelte/transition";
  import Sparkle from "phosphor-svelte/lib/Sparkle";
</script>

<div class="text-xl text-center my-32">
  <div class="text-3xl">There are no habits created, yet.</div>
  <a
    in:fly={{ y: -5, duration: 200 }}
    class="btn btn-accent btn-lg my-10 font-bold group"
    href="/app/new"
  >
    <span class="inline-block self-center mr-4"
      ><Sparkle
        weight="fill"
        size={35}
        class="group-hover:rotate-12 transition-transform"
      /></span
    > CREATE ONE</a
  >
</div>
