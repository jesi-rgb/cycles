<script>
  import {
    ArrowLeft,
    BookOpen,
    Key,
    Lock,
    Moon,
    Pizza,
    Vault,
    Wrench,
  } from "phosphor-svelte";
  import { fly } from "svelte/transition";
  import { onMount } from "svelte";
  import Count from "../../lib/components/Count.svelte";
  import CountBlog from "../../lib/components/CountBlog.svelte";

  let loaded = false;

  onMount(() => {
    loaded = true;
  });
</script>

<svelte:head>
  <title>FAQ - Cycles</title>
</svelte:head>

{#if loaded}
  <div
    in:fly={{ y: 20, duration: 800 }}
    class="w-[80%] mx-auto text-xl text-justify tracking-wide my-20"
  >
    <div class="text-4xl font-bold text-center tracking-tight">
      How does <i>Cycles</i> work?
    </div>
    <div class="divider" />

    <div class="leading-[1.4]">
      <p>In case you're a bit lost, let's clarify some things.</p>
      <br />
      <br />

      <div class="flex space-x-4 items-center mb-5">
        <BookOpen weight="fill" />
        <h1 class="text-2xl font-bold">Usage</h1>
      </div>
      <div>
        Mainly, this app serves as a combination of <i>logging and tracking</i>
        habits you want to keep an eye on. On normal usage, we find ourselves logging
        around 5 habits in various combinations of daily and weekly.
        <br /><br />
        <aside class="mx-auto w-fit my-10">
          <CountBlog />
        </aside>
        Tapping the number on the left updates the current count of times you've
        completed the habit in question. Ideally, you'd tap it upon completing it
        in real life, but it's probably more sensible to find times during the day
        to do so, like after lunch
        <span class="inline-block align-middle rotate-45"
          ><Pizza weight="fill" /></span
        >
        or just before sleep.
        <span class="inline-block align-middle"><Moon weight="fill" /></span>

        <br /><br />
        The idea is to help you track things you would forget otherwise that you
        actually want to do, but are not used to doing <b>yet</b>. Think reading
        a bit every night or having some exercise. Ideally you'd access this app
        and see that you <i>still have something to do</i>, go and do it and
        feel good about it.
      </div>

      <br />
      <br />

      <div class="flex space-x-4 items-center mb-5">
        <Vault weight="fill" />
        <h1 class="text-2xl font-bold">Privacy</h1>
      </div>
      <p>
        This app helps you log data that, we can all agree, is to be protected
        at all costs. While I highly doubt anyone will log any <i>really</i>
        sensible data in here that could expose them to any problem, that doesn't
        mean that it's not worthy of care on my end, as the developer of this little
        application.
        <br /><br />
        Your data (i.e your habits' title, category, counters and dates) are encrypted
        <Key class="inline-block align-middle" weight="fill" />
        on device before uploading them to the database they come from and go to.
        The device you use (laptop, phone, smart fridge) to access the webpage will
        decrypt the info from the database and present it to you. <br /><br /> While
        I am not making the absolute best of my abilities to make this data completely
        impenetrable to an outsider, this small encryption layer should be enough
        for the scope this piece of software aims to fulfil.
      </p>
      <br />
      <br />

      <div class="flex space-x-4 items-center mb-5">
        <Wrench weight="fill" />
        <h1 class="text-2xl font-bold">Functionality</h1>
      </div>
      <p>
        For those interested, this app is just a beautiful presentation of some
        data stored in some database. It also provides a hopefully easy enough
        interface to operate such database. <br /><br />
        <i>That's the ultimate goal of any software product anyways.</i>
        <br /><br />
        Upon loading the app, it accesses this database and looks for all the habits
        that belong to you. Upon interacting with the app, it asks the database to
        do whatever you asked for. It's really that simple. If you are trying to
        edit some habit's title, it simply sends the new (<i>encrypted</i>)
        information to store it. Same applies when deleting a habit or doing
        anything else.
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
      </span> back</a
    >
  </div>
{/if}
