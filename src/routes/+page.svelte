<script>
  import { fly } from "svelte/transition";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { routeToPage } from "$lib/navigationUtil";
  import { supabaseClient } from "../lib/supabaseClient.js";

  let sessionDataExists;

  onMount(() => {
    sessionDataExists = false;
    if ($page.data.session) {
      console.log(sessionDataExists);
      sessionDataExists = true;
      routeToPage("/app");
    }
  });

  async function signInWithGoogle() {
    console.log(window.location.origin + "/app");

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      redirectTo: window.location.origin + "/app/",
    });
  }
</script>

{#if sessionDataExists}
  <div />
{:else}
  <div
    in:fly={{ y: -20, duration: 500 }}
    class="flex flex-col justify-evenly w-[80%] mx-auto my-auto h-screen"
  >
    <div>
      <h1
        class="font-bold text-8xl xl:text-9xl text-center tracking-tighter mb-10"
      >
        Cycles
      </h1>
      <p class="text-center italic text-3xl">
        A little helper for <br /> your cyclic needs
      </p>
    </div>
    <button
      class="btn btn-secondary w-fit self-center btn-lg"
      on:click={signInWithGoogle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 256 256"
        class="fill-secondary-content mr-2"
        ><path
          d="M228,128a100,100,0,1,1-22.86-63.64,12,12,0,0,1-18.51,15.28A76,76,0,1,0,203.05,140H128a12,12,0,0,1,0-24h88A12,12,0,0,1,228,128Z"
        /></svg
      >
      <div>Sign in with Google</div>
    </button>
  </div>
{/if}
