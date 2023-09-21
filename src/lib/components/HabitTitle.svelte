<script>
  // on:focusout={updateTitle()}
  // on:keydown={(e) => {
  //   if (e.key == "Enter") {
  //     e.preventDefault();
  //     updateTitle(habit.id);
  //   }
  // }}
  //
  // export let habit;
  // export let user;
  // let title = habit.title;

  // import { supabaseClient } from "$lib/supabaseClient";
  //const updateTitle = async (id) => {
  //   try {
  //     console.log(titleElement);
  //     let filteredTitle = titleElement.innerText.trim();
  //     const { data, error } = await supabaseClient
  //       .from("habits")
  //       .update({ title: filteredTitle })
  //       .eq("created_by", user.id)
  //       .eq("id", id)
  //       .select()
  //       .single();
  //
  //     console.log(data);
  //
  //     if (data) {
  //       title = data.title;
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  export let title;
</script>

<div
  class="text-2xl tracking-wide focus:outline-none focus:outline-accent rounded-xl px-2"
>
  {title}
</div>
