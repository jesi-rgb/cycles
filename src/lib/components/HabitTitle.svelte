<script>
  import { supabaseClient } from "$lib/supabaseClient";

  export let habit;
  export let user;

  let title = habit.title;
  let titleElement;

  const updateTitle = async (id) => {
    try {
      console.log(titleElement);
      let filteredTitle = titleElement.innerText.trim();
      const { data, error } = await supabaseClient
        .from("habits")
        .update({ title: filteredTitle })
        .eq("created_by", user.id)
        .eq("id", id)
        .select()
        .single();

      console.log(data);

      if (data) {
        title = data.title;
      }
    } catch (error) {
      console.error(error);
    }
  };
</script>

<div
  contenteditable
  bind:this={titleElement}
  on:focusout={updateTitle(habit.id)}
  on:keydown={(e) => {
    if (e.key == "Enter") {
      e.preventDefault();
      updateTitle(habit.id);
    }
  }}
  class="text-2xl font-semibold tracking-wide focus:outline-none focus:outline-accent rounded-xl px-2"
>
  {title}
</div>
