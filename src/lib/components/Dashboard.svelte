<script>
  import { history } from "../../stores";
</script>

<section class="w-1/2 hidden lg:block border-l border-base-content/30">
  <div class="p-10">
    <h1 class="text-3xl font-bold">Daily Stats</h1>

    <p class="text-xl">
      Today, you've logged a total of <strong>{$history.length}</strong> times. Nice!
    </p>
  </div>
</section>
