<script>
  import ArrowLeft from "phosphor-svelte/lib/ArrowLeft";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";

  let loaded = false;

  onMount(() => {
    loaded = true;
  });
</script>

<svelte:head>
  <title>About - Cycles</title>
</svelte:head>

{#if loaded}
  <div
    in:fly={{ y: 20, duration: 800 }}
    class="w-[80%] xl:w-1/2 mx-auto text-xl text-justify tracking-wide my-20"
  >
    <div class="font-bold tracking-tight text-4xl text-center">
      About Cycles
    </div>
    <div class="divider" />
    <div>
      <p class="leading-[1.4]">
        <b>Cycles</b> is developed by
        <a
          class="underline text-accent hover:text-accent-focus transition-colors"
          href="https://jesirgb.com">Jesús Rascón</a
        >, an andalusian design engineer based in Córdoba, Spain. The idea for
        this app mainly comes from my girlfriend, Rosana, which lacked a proper
        habit tracking app. <br /><br /> Everything else in the market was
        either too complicated, too expensive... or both. <br /><br />
        In the hopes of trying to fix that situation, this is what came out. A very
        simple app that hopefully helps you track what's important to you.
        <br /><br />
        Not a lot of options are provided, but that's by design. The idea is that
        you spend as little time in the app as possible.
        <i>Think, log, track and go</i>.
        <br /><br />
        If you feel like there's something missing, or just want to reach out, please
        do so in
        <a
          class="underline text-accent hover:text-accent-focus transition-colors"
          href="mailto:blograso@gmail.com">here</a
        >. There's also plenty of alternate ways in my webpage, linked up in my
        name. <br /><br /> Thanks so much for your time, there is not much of it
        these days!
      </p>
    </div>

    <a
      href="/app"
      class="btn btn-secondary text-xl font-bold w-fit group mt-20"
    >
      <span class="mr-5">
        <ArrowLeft
          class="group-hover:-translate-x-1 transition-transform"
          weight="bold"
        />
      </span>BACK</a
    >
  </div>
{/if}
