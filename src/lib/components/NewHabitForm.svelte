<script>
  import crypto from "crypto-js";
  const { AES, enc } = crypto;

  import { page } from "$app/stores";
  import { DateTime } from "luxon";
  import { supabaseClient } from "$lib/supabaseClient";
  import {
    ArrowsCounterClockwise,
    Calendar,
    FlagCheckered,
    Star,
    Tag,
  } from "phosphor-svelte";
  import { onMount } from "svelte";
  import SelectionGpt from "./SelectionGPT.svelte";
  import { habits } from "../../stores";
  import FormElement from "./FormElement.svelte";

  const session = $page.data.session;

  let loading = false;
  let formTitle,
    formTarget,
    formCycle = "daily",
    formCategory;

  async function createHabit() {
    try {
      loading = true;
      const { user } = session;

      if (!formTitle) {
        formTitle = "";
      }

      if (!formTarget) {
        formTarget = 0;
      }

      if (!formCycle) {
        formCycle = "daily";
      }

      if (!formCategory) {
        formCategory = "No category";
      }

      let nextUpdate;

      if (formCycle == "daily") {
        nextUpdate = DateTime.now()
          .plus({ days: 1 })
          .startOf("day")
          .set({ hour: 3 });
      } else {
        nextUpdate = DateTime.now()
          .plus({ weeks: 1 })
          .startOf("week")
          .set({ hour: 3 });
      }

      let newHabit = {
        title: AES.encrypt(formTitle, user.id).toString(),
        target_count: AES.encrypt(formTarget.toString(), user.id).toString(),
        current_count: AES.encrypt("0", user.id).toString(),
        category: AES.encrypt(formCategory.toString(), user.id).toString(),
        cycle: AES.encrypt(formCycle, user.id).toString(),
        next_update: AES.encrypt(nextUpdate.toISO(), user.id).toString(),
        created_by: user.id,
      };

      let { data, error } = await supabaseClient
        .from("habits")
        .insert(newHabit);

      if (error) throw error;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
      }
    } finally {
      loading = false;
      formTitle = "";
      formTarget = "";
      formCategory = "";
    }
  }

  let categories;
  onMount(() => {
    categories = $habits.map((h) => h.category);
  });
</script>

<form
  class="form-control space-y-5 my-10"
  on:submit|preventDefault={createHabit}
>
  <FormElement title="Habit">
    <ArrowsCounterClockwise slot="icon" weight="fill" />
    <input
      slot="content"
      type="text"
      id="habit"
      bind:value={formTitle}
      class="input input-secondary hover:border-secondary-focus focus:input-accent focus:border-accent border-2"
      placeholder="something to keep track of"
    />
  </FormElement>

  <FormElement title="Target">
    <FlagCheckered slot="icon" weight="fill" />
    <input
      slot="content"
      type="number"
      id="target"
      bind:value={formTarget}
      inputmode="numeric"
      min="1"
      class="input input-secondary hover:border-secondary-focus focus:input-accent focus:border-accent border-2"
      placeholder="how many times?"
    />
  </FormElement>

  <FormElement title="Cycle">
    <Calendar slot="icon" weight="fill" />
    <SelectionGpt
      slot="content"
      options={["daily", "weekly"]}
      bind:selectedOption={formCycle}
      isSearchable={false}
      placeholder="Either daily or weekly"
    />
  </FormElement>

  <FormElement title="Category">
    <Tag slot="icon" weight="fill" />
    <SelectionGpt
      slot="content"
      bind:options={categories}
      bind:selectedOption={formCategory}
      placeholder="helps organize your habits"
    />
  </FormElement>

  <button class="btn btn-accent text-2xl group">
    <span class="mr-5"
      ><Star
        class="group-hover:-rotate-12 transition-transform"
        weight="fill"
      /></span
    >
    {loading ? "Loading..." : "Create"}</button
  >
</form>
