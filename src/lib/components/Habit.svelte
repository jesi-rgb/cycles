<script>
    import { supabaseClient } from '$lib/supabaseClient'
    import { habits, history } from '../../stores'

    import SelectionGpt from './SelectionGPT.svelte'
    import Count from './Count.svelte'
    import HabitTitle from './HabitTitle.svelte'

    import Calendar from 'phosphor-svelte/lib/Calendar'
    import CheckFat from 'phosphor-svelte/lib/CheckFat'
    import FlagCheckered from 'phosphor-svelte/lib/FlagCheckered'
    import FloppyDisk from 'phosphor-svelte/lib/FloppyDisk'
    import PencilSimpleLine from 'phosphor-svelte/lib/PencilSimpleLine'
    import PlusMinus from 'phosphor-svelte/lib/PlusMinus'
    import Question from 'phosphor-svelte/lib/Question'
    import Tag from 'phosphor-svelte/lib/Tag'
    import TextAa from 'phosphor-svelte/lib/TextAa'
    import Trash from 'phosphor-svelte/lib/Trash'
    import X from 'phosphor-svelte/lib/X'

    import { DateTime } from 'luxon'
    import Spinner from './Spinner.svelte'

    export let habit
    export let user
    export let updated

    let editDialog

    let askUserDelete = false

    let loading = false,
        success = false

    let dialogTitle = habit.title
    let dialogTargetCount = habit.target_count
    let dialogCurrentCount = habit.current_count
    let dialogCategory = habit.category
    let dialogCycle = habit.cycle

    let cycleOptions = ['daily', 'weekly']

    let inputTargetCount, inputCurrentCount

    $: currentCount = habit.current_count
        ? habit.current_count
        : dialogCurrentCount

    const deleteHabit = async () => {
        try {
            const { data, error } = await supabaseClient
                .from('habits')
                .delete()
                .eq('created_by', user.id)
                .eq('id', habit.id)

            //delete it from store to trigger reactivity
            $habits = $habits.filter(
                (h) => h.id != habit.id || h.created_by != habit.created_by
            )

            const { data: historyData } = await supabaseClient
                .from('history')
                .select('*')
                .eq('user_uuid', user.id)

            history.set(historyData)
        } catch (error) {
            console.error(error)
        } finally {
            askUserDelete = false
            editDialog.close()
        }
    }

    const updateHabit = async () => {
        try {
            loading = true
            updated = true

            let nextUpdateDate = habit.next_update
            // user changed cycle period
            if (dialogCycle != habit.cycle) {
                //reset next_update property
                if (dialogCycle == 'daily') {
                    nextUpdateDate = DateTime.now()
                        .plus({ days: 1 })
                        .startOf('day')
                        .set({ hour: 3 })
                        .toISO()
                } else {
                    nextUpdateDate = DateTime.now()
                        .plus({ weeks: 1 })
                        .startOf('week')
                        .set({ hour: 3 })
                        .toISO()
                }
            }

            const updatedData = {
                title: dialogTitle,
                target_count: dialogTargetCount,
                current_count: dialogCurrentCount,
                category: dialogCategory,
                cycle: dialogCycle,
                next_update: nextUpdateDate,
                created_by: user.id,
                id: habit.id
            }
            // const updatedDataEncrypted = encryptData(updatedData, user.id);

            const { data, error } = await supabaseClient
                .from('habits')
                .upsert(updatedData)
                .select()
                .single()

            habits.update((habitsCallback) => {
                const hIndex = habitsCallback.findIndex(
                    (h) => h.id == habit.id && h.created_by == habit.created_by
                )
                habitsCallback[hIndex] = updatedData
                return habitsCallback
            })

            if (dialogCurrentCount.length <= 0) dialogCurrentCount = 0
            if (currentCount.length <= 0) currentCount = 0

            if (data && $habits) success = true
        } catch (error) {
            console.error(error)
        } finally {
            loading = false
            success = false
            editDialog.close()
        }
    }

    $: categories = $habits.map((h) => h.category)
</script>

<div
    class="flex flex-row items-center justify-between mb-5 bg-opacity-10 transition-colors rounded-lg group"
>
    <div class="w-1/3">
        {#key currentCount}
            <Count bind:updated bind:currentCount {habit} {user} />
        {/key}
    </div>
    <div class="w-2/3 flex items-center space-x-1 h-28">
        <div class="flex flex-col justify-evenly h-full my-auto">
            <HabitTitle title={habit.title} />
            <div class="flex space-x-3 text-sm">
                <div
                    class:badge-primary={habit.cycle == 'weekly'}
                    class:badge-secondary={habit.cycle == 'daily'}
                    class="badge badge-outline font-semibold"
                >
                    {habit.cycle}
                </div>
                <div class="text-base-content lining-nums font-medium">
                    {DateTime.fromISO(habit.next_update).toRelative()}
                </div>
            </div>
        </div>
    </div>
    <button on:click={editDialog.showModal()} class="btn btn-circle btn-ghost">
        <PencilSimpleLine size={30} />
    </button>
</div>

<!-- dialog to allow edits on the habit -->
<dialog
    class="px-5 md:px-10 pt-4 md:pt-8 pb-7 md:pb-14 rounded-xl ring-8 ring-base-100 bg-base-100 border-2 border-accent backdrop-blur-sm w-[97%]"
    bind:this={editDialog}
>
    <div class="flex flex-col space-y-5 w-full">
        <form method="dialog" class="mb-10 flex justify-between">
            <!-- if there is a button in form, it will close the modal -->
            <p class="font-bold text-2xl">Edit the properties</p>
            <button class="btn btn-sm btn-circle"> <X weight="bold" /> </button>
        </form>

        <!--title-->
        <div class="flex justify-between">
            <div class="flex items-center">
                <TextAa weight="fill" />
                <div class="ml-2">Title</div>
            </div>
            <input
                class="font-bold input input-bordered text-lg bg-opacity-0 bg-black focus:outline-none focus:outline-accent max-w-[50%] overflow-x-scroll whitespace-nowrap text-right"
                placeholder={dialogTitle}
                bind:value={dialogTitle}
                type="text"
            />
        </div>

        <div class="divider" />

        <!--current count-->
        <div class="flex justify-between">
            <div class="flex items-center">
                <PlusMinus weight="fill" />
                <div class="ml-2">Current count</div>
            </div>
            <input
                inputmode="numeric"
                type="number"
                bind:this={inputCurrentCount}
                on:click={inputCurrentCount.select()}
                bind:value={dialogCurrentCount}
                class="font-mono font-extrabold input input-bordered focus:outline-none w-1/4 focus:outline-accent text-right bg-opacity-0 bg-black"
                placeholder={dialogCurrentCount}
            />
        </div>

        <div class="divider" />

        <!--target count-->
        <div class="flex justify-between">
            <div class="flex items-center">
                <FlagCheckered weight="fill" />
                <div class="ml-2">Target count</div>
            </div>
            <input
                inputmode="numeric"
                type="number"
                on:click={inputTargetCount.select()}
                bind:this={inputTargetCount}
                bind:value={dialogTargetCount}
                class="font-mono input input-bordered w-1/4 font-extrabold focus:outline-none focus:outline-accent text-right bg-opacity-0 bg-black"
                placeholder={dialogTargetCount}
            />
        </div>

        <div class="divider" />

        <!-- category -->
        <div class="flex justify-between">
            <div class="flex items-center">
                <Calendar weight="fill" />
                <div class="ml-2">Cycle</div>
            </div>
            <div class="w-1/2">
                <SelectionGpt
                    isSearchable={false}
                    bind:options={cycleOptions}
                    bind:selectedOption={dialogCycle}
                    placeholder=""
                />
            </div>
        </div>

        <div class="divider" />
        <!-- category -->
        <div class="flex justify-between">
            <div class="flex items-center">
                <Tag weight="fill" />
                <div class="ml-2">Category</div>
            </div>
            <div class="w-1/2">
                <SelectionGpt
                    bind:options={categories}
                    bind:selectedOption={dialogCategory}
                    placeholder=""
                />
            </div>
        </div>

        <div class="flex justify-between pt-10">
            <div>
                {#if !askUserDelete}
                    <button
                        on:click={() => (askUserDelete = true)}
                        class="btn btn-error btn-outline self-start"
                    >
                        <span class="mr-5">
                            <Trash size="28" weight="fill" />
                        </span> DELETE
                    </button>
                {:else}
                    <button
                        on:click={deleteHabit}
                        class="btn btn-error self-start"
                    >
                        <span class="mr-5">
                            <Question size="28" weight="fill" />
                        </span> SURE?
                    </button>
                {/if}
            </div>

            <button
                on:click={updateHabit}
                class="btn btn-secondary flex justify-between items-center font-normal text-xl self-end"
            >
                {#if loading}
                    <Spinner size="28" fill="fill-secondary" />
                    <span class="ml-5">SAVING...</span>
                {:else if success}
                    <CheckFat weight="fill" />
                    <span class="ml-5">SAVED</span>
                {:else}
                    <FloppyDisk size={28} class="" weight="fill" />
                    <span class="ml-5">SAVE</span>
                {/if}
            </button>
        </div>
    </div>
</dialog>

<style>
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0, 0.67, 0.39, 1.01);
    }

    @keyframes zoom {
        from {
            transform: scale(0.9);
        }
        to {
            transform: scale(1);
        }
    }
    dialog[open]::backdrop {
        animation: fade 0.4s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
