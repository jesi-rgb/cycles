<script>
    import { onMount } from "svelte";
    import { DateTime } from "luxon";
    import { supabaseClient } from "$lib/supabaseClient";

    export let user;
    let completedEventsWeek = 10;

    async function fetchCompletedWeekly() {
        try {
            const { data, error } = await supabaseClient
                .from("daily_habit_completion_count")
                .select("day, habits_completed")
                .eq("user_uuid", user.id)
                .gte("day", DateTime.now().startOf("week").toISODate());

            completedEventsWeek = data
                .map((a) => a.habits_completed)
                .reduce((a, i) => a + i, 0);
        } catch (error) {
            console.error(error);
        }
    }

    onMount(() => {
        fetchCompletedWeekly();
    });
</script>

<div class="text-neutral-500">
    This week, you've completed {completedEventsWeek} events.
</div>
