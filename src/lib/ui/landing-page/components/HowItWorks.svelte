<script lang="ts">
  import BackgroundSquares from "$lib/assets/ui-svgs/background-squares.svg";
  import { m } from "$lib/paraglide/messages";
</script>

<section class="relative overflow-hidden text-center py-24 px-4">
  <div class="absolute">
    <img
      src={BackgroundSquares}
      alt=""
      aria-hidden="true"
      class="w-full h-full object-cover"
    />
  </div>

  <div class="relative bg-transparent">
    <h2 class="text-4xl font-bold mb-6">{m.how_it_works_header()}</h2>
    <p class="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
      {m.how_it_works_description()}
    </p>
  </div>
</section>
