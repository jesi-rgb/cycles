<script>
    //fetch all habits and display them

    import { groupBy, updateTimesAndReset } from '$lib/utils.js'
    import { page } from '$app/stores'
    import { supabaseClient } from '$lib/supabaseClient'
    import { habits, history } from '../../stores.js'

    import Habit from '../../lib/components/Habit.svelte'
    import EmptyState from '../../lib/components/EmptyState.svelte'
    import Plus from 'phosphor-svelte/lib/Plus'
    import Spinner from '../../lib/components/Spinner.svelte'
    import WeekProgress from '../../lib/components/WeekProgress.svelte'

    import VisibilityChange from 'svelte-visibility-change'

    const session = $page.data.session
    const { user } = session

    let visibilityState

    let habitNumber
    $: groupedHabits = groupBy($habits, (h) => h.category)

    const fetchHabits = async () => {
        try {
            let { data: habitData, error } = await supabaseClient
                .from('habits')
                .select('*')
                .eq('created_by', user.id)

            let { data: historyData, errorHistory } = await supabaseClient
                .from('history')
                .select('*')
                .eq('user_uuid', user.id)

            if (habitData) {
                if (habitData.length > 0) {
                    habitNumber = habitData.length
                    habitData.sort((h1, h2) => h2.id - h1.id)

                    let updatedData = await updateTimesAndReset(habitData)

                    habits.set(updatedData)

                    // groupedHabits = groupBy($habits, (h) => h.category);
                } else {
                    habits.set([])
                }

                updated = false
            }

            if (historyData || $history == undefined) {
                $history = historyData
            }

            if (error) throw error
        } catch (error) {
            if (error instanceof Error) {
                console.error(error)
            }
        }
    }

    let updated = false

    $: dayProgress = $habits.filter((h) => {
        return h.current_count >= h.target_count
    }).length
</script>

<svelte:head>
    <title>Cycles — {habitNumber} habits</title>
</svelte:head>

{#await fetchHabits()}
    <div class="flex space-x-4 items-center my-32">
        <Spinner />
        <div class="text-4xl font-bold">Loading habits...</div>
    </div>
{:then habitLoaded}
    <!-- <div class="lg:flex mb-10"> -->
    <div class="lg:w-1/2 lg:p-10">
        {#if $habits.length == 0}
            <EmptyState />
        {:else}
            <div class="sticky z-[99] top-0 rounded-xl bg-base-100">
                <WeekProgress {dayProgress} />
            </div>

            <div class="w-full">
                {#each Object.entries(groupedHabits) as [category, categoryHabits], i}
                    <div>
                        <div
                            class="divider text-base-content/50 font-bold text-2xl"
                        >
                            {category}
                        </div>
                        {#each categoryHabits as habit}
                            <Habit bind:updated {habit} {user} />
                        {/each}
                    </div>
                {/each}
            </div>
            <div class="shadow-xl">
                <a
                    href="/app/new"
                    class="btn btn-circle btn-secondary fixed bottom-4 btn-md text-6xl font-bold right-4 group shadow-xl"
                >
                    <Plus
                        weight="bold"
                        class="group-hover:rotate-90 duration-300 transition-transform"
                        size={32}
                    />
                </a>
            </div>
        {/if}
    </div>
{/await}

<VisibilityChange bind:state={visibilityState} on:visible={fetchHabits} />
