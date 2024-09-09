<script>
    import { supabaseClient } from '$lib/supabaseClient'
    import { invalidate } from '$app/navigation'
    import { onMount } from 'svelte'
    import '$lib/css/main.css'
    import Title from '../../lib/components/Title.svelte'

    import ArrowClockwise from 'phosphor-svelte/lib/ArrowClockwise'
    import GearSix from 'phosphor-svelte/lib/GearSix'
    import House from 'phosphor-svelte/lib/House'
    import Question from 'phosphor-svelte/lib/Question'
    import Signature from 'phosphor-svelte/lib/Signature'
    import SignOut from 'phosphor-svelte/lib/SignOut'
    import UserCircle from 'phosphor-svelte/lib/UserCircle'

    onMount(() => {
        const {
            data: { subscription }
        } = supabaseClient.auth.onAuthStateChange(() => {
            invalidate('supabase:auth')
        })

        return () => {
            subscription.unsubscribe()
        }
    })
</script>

<svelte:head>
    <meta name="theme-color" content="#282A36" />
</svelte:head>

<div class="drawer lg:drawer-open selection:bg-primary/20">
    <input id="menu-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col justify-start p-10">
        <div class="flex flex-row items-center justify-between mb-5">
            <div class="flex space-x-3">
                <img src="cycles.svg" width="48" alt="" />
                <div class="font-light">
                    <Title>Cycles</Title>
                </div>
            </div>
            <div class="flex items-center justify-between space-x-3">
                <button
                    on:click={() => location.reload()}
                    class="btn btn-neutral btn-circle btn-md text-3xl"
                >
                    <ArrowClockwise weight="bold" />
                </button>
                <label
                    for="menu-drawer"
                    class="btn btn-circle btn-info btn-md text-3xl font-bold lg:hidden group"
                >
                    <GearSix
                        class="group-hover:rotate-90 duration-300 transition-transform"
                        weight="fill"
                    />
                </label>
            </div>
        </div>
        <!-- whole app goes in here -->
        <div class="">
            <slot />
        </div>
        <!-- whole app goes in here -->
    </div>
    <div class="drawer-side z-[100]">
        <label for="menu-drawer" class="drawer-overlay" />
        <ul class="menu bg-base-200 text-base-content min-h-full py-5">
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

            <li>
                <a href="/faq">
                    <Question weight="fill" size={32} />
                </a>
            </li>

            <li>
                <a href="/about">
                    <Signature weight="bold" size={32} />
                </a>
            </li>

            <li class="absolute bottom-5 text-error">
                <a href="/app/account/logout">
                    <SignOut weight="bold" size={32} />
                </a>
            </li>
        </ul>
    </div>
</div>
