<script lang="ts">
  import Icon from "@iconify/svelte";
  import { cn } from "$lib/utils/string/cn.util";
  import { page } from "$app/state";
  import SubscriptionTierStatusBadge from "../general/SubscriptionTierStatusBadge.svelte";
  import {
    getDisplayName,
    getUserInitials,
  } from "$lib/utils/user/user-info.util";
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";
  import { userStore } from "$lib/stores/user.svelte";
  import type { UserWithRelations } from "$lib/server/database/types";
  let isDropdownOpen = $state(false);

  interface Props {
    user: UserWithRelations;
  }

  let { user }: Props = $props();

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;
    if (!target.closest(".profile-dropdown")) {
      isDropdownOpen = false;
    }
  }

  const MENU_ITEMS = [
    {
      label: "Generate Rizz",
      icon: "mingcute:ai-fill",
      href: "/generate",
    },
    {
      label: "History",
      icon: "mingcute:history-fill",
      href: "/conversations",
    },
    {
      label: "AI Profile Optimizer",
      icon: "mingcute:quill-pen-ai-fill",
      href: "/ai-profile-optimizer",
    },
    {
      label: "Account",
      icon: "mingcute:user-3-fill",
      href: "/profile",
    },
  ] as const;

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          goto("/");
          isDropdownOpen = false;
          userStore.setUser(null);
        },
      },
    });
  }

  $effect(() => {
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  });
</script>

{#if user}
  <nav class="absolute right-0 w-fit z-50 p-4">
    <div class="flex justify-end">
      <div class="relative profile-dropdown">
        <button
          onclick={() => (isDropdownOpen = !isDropdownOpen)}
          class="flex items-center gap-2 rounded-2xl bg-white/70 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white/80 hover:shadow-xl cursor-pointer"
          aria-label="Profile menu"
        >
          <!-- User Avatar -->
          <div class="relative h-8 w-8 overflow-hidden rounded-full">
            {#if user.image}
              <img
                src={user.image}
                alt={getDisplayName({ user })}
                class="h-full w-full object-cover"
              />
            {:else}
              <div
                class="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-500 to-pink-500 text-sm font-medium text-white"
              >
                {getUserInitials(user)}
              </div>
            {/if}
          </div>

          <!-- Name (hidden on mobile) -->
          <span class="hidden font-medium text-gray-700 sm:block">
            {getDisplayName({ user, fullName: true })}
          </span>

          <!-- Dropdown Arrow -->
          <Icon
            icon="heroicons:chevron-down"
            class="h-4 w-4 text-gray-500 transition-transform duration-200 {isDropdownOpen
              ? 'rotate-180'
              : ''}"
          />
        </button>

        <!-- Dropdown Menu -->
        {#if isDropdownOpen}
          <div
            class="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-white/20 bg-white/90 p-2 shadow-xl backdrop-blur-sm"
          >
            {#if user}
              <!-- User Info Section -->
              <div class="border-b border-gray-200 p-3">
                <div class="flex items-center gap-3">
                  <div class="relative h-10 w-10 overflow-hidden rounded-full">
                    {#if user.image}
                      <img
                        src={user.image}
                        alt={getDisplayName({ user })}
                        class="h-full w-full object-cover"
                      />
                    {:else}
                      <div
                        class="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-500 to-pink-500 text-white font-medium"
                      >
                        {getUserInitials(user)}
                      </div>
                    {/if}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2">
                      <p class="font-medium text-gray-900 truncate">
                        {getDisplayName({ user })}
                      </p>
                      <SubscriptionTierStatusBadge
                        status={user.subscriptions?.find(
                          (sub) => sub.status === "active"
                        )
                          ? "pro"
                          : "trial"}
                      />
                    </div>
                    <p class="text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="py-1">
                {#each MENU_ITEMS as item}
                  <a
                    href={item.href}
                    class={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-slate-100 hover:text-slate-600",
                      page.route.id === item.href &&
                        "bg-slate-100 text-slate-600"
                    )}
                  >
                    <Icon icon={item.icon} class="h-4 w-4" />
                    {item.label}
                  </a>
                {/each}

                <!-- Upgrade Button for non-pro users -->
                {#if !user.subscriptions?.find((sub) => sub.status === "active")}
                  <a
                    href="/upgrade"
                    class="flex items-center justify-between gap-2 rounded-lg px-3 py-2 mt-1 mb-3 text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white transition-all hover:from-purple-600 hover:to-pink-600 hover:shadow-lg transform hover:scale-[1.02] group"
                  >
                    <div class="flex items-center gap-2">
                      <Icon icon="mingcute:crown-fill" class="h-4 w-4" />
                      Upgrade to Pro
                    </div>
                  </a>
                {/if}

                <!-- Separator -->
                <div class="border-t border-gray-200 my-1"></div>

                <!-- Sign Out Button -->
                <button
                  onclick={signOut}
                  class="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 cursor-pointer"
                >
                  <Icon icon="mdi:logout" class="h-4 w-4" />
                  Log Out
                </button>
                <!-- <div class="mt-3 pt-3 border-t border-gray-200">
                </div> -->
              </div>
            {:else}
              <!-- Not Authenticated Menu -->
              <div class="py-1">
                <a
                  href="/sign-in"
                  class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-600"
                >
                  <Icon icon="mdi:login" class="h-4 w-4" />
                  Sign In
                </a>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </nav>
{/if}
