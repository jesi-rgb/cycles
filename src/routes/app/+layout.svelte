<script>
  import { supabaseClient } from "$lib/supabaseClient";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import "$lib/css/main.css";
  import Title from "../../lib/components/Title.svelte";
  import { GearSix, House, SignOut, UserCircle } from "phosphor-svelte";

  onMount(() => {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange(() => {
      invalidate("supabase:auth");
    });

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<div class="container selection:bg-neutral-content">
  <div class="drawer drawer-mobile">
    <input id="menu-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col justify-start p-10">
      <div class="flex flex-row items-center justify-between">
        <Title>Cycles</Title>
        <label
          for="menu-drawer"
          class="btn btn-circle btn-info btn-md text-3xl font-bold self-start lg:hidden"
        >
          <GearSix weight="fill" />
        </label>
      </div>
      <slot />
    </div>
    <div class="drawer-side">
      <label for="menu-drawer" class="drawer-overlay" />
      <ul class="menu w-16 bg-base-200 text-base-content">
        <li>
          <a href="/app">
            <House weight="fill" size={32} />
          </a>
        </li>
        <li>
          <a href="/app/account/info">
            <UserCircle weight="fill" size={32} />
          </a>
        </li>
        <li class="absolute bottom-0">
          <a href="/app/account/logout">
            <SignOut weight="fill" size={32} />
          </a>
        </li>
      </ul>
    </div>
  </div>
</div>
