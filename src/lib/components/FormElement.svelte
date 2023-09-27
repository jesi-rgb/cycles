<script>
  export let title;
</script>

<div class="flex flex-col">
  <label
    for={title.toLowerCase()}
    class="flex flex-row items-center text-2xl mb-1 font-bold"
  >
    <span class="mr-2"><slot name="icon" /></span>{title}</label
  >
  <slot name="content" />
</div>
