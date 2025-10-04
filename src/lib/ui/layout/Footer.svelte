<script lang="ts">
  import Icon from "@iconify/svelte";

  const middleColumnItems = [
    {
      label: "Reviews",
      href: "#reviews",
    },

    {
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      label: "Terms & Conditions",
      href: "/terms",
    },
  ];

  const leftColumnItems = [
    {
      label: "About",
      href: "/about",
    },
    {
      label: "FAQs",
      href: "#faqs",
    },
    {
      label: "Compare - WingAI",
      href: "/compare/wingai",
    },
    {
      label: "Compare - RizzApp",
      href: "/compare/rizzapp",
    },
    {
      label: "Compare - Wingman",
      href: "/compare/wingman",
    },
  ];
</script>

<footer class="bg-gray-900 text-white py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <div class="flex items-center mb-4">
          <span class="text-2xl flex items-center font-bold text-purple-400"
            >RizzGPT
            <Icon icon="mingcute:ai-line" class="mb-0.5" stroke-width={0.25} />
          </span>
        </div>
        <p class="text-gray-300 mb-4">
          Your AI Wingman for Winning Conversations.
        </p>
      </div>

      <!-- Middle Column -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Support</h3>
        <ul class="space-y-2">
          {#each middleColumnItems as item}
            <li>
              <a
                href={item.href}
                class="text-gray-300 hover:text-white transition-colors"
                >{item.label}</a
              >
            </li>
          {/each}
        </ul>
      </div>

      <!-- Right Column -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Company</h3>
        <ul class="space-y-2">
          {#each leftColumnItems as item}
            <li>
              <a
                href={item.href}
                class="text-gray-300 hover:text-white transition-colors"
                >{item.label}</a
              >
            </li>
          {/each}
        </ul>
      </div>
    </div>

    <div class="border-t border-gray-800 mt-8 pt-8 text-center">
      <p class="text-gray-400">
        Copyright © 2024 RizzGPT. All rights reserved.
      </p>
    </div>
  </div>
</footer>
