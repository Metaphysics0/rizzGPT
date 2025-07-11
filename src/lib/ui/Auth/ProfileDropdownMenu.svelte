<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Props {
    isAuthenticated: boolean;
    user?: {
      id: string;
      email: string;
      given_name?: string;
      family_name?: string;
      picture?: string | null;
    } | null;
  }

  let { isAuthenticated, user }: Props = $props();
  let isDropdownOpen = $state(false);

  // Function to get user initials for avatar fallback
  function getUserInitials(user: Props["user"]): string {
    if (!user) return "U";
    const firstName = user.given_name || "";
    const lastName = user.family_name || "";

    if (firstName && lastName)
      return `${firstName[0]}${lastName[0]}`.toUpperCase();

    if (firstName) return firstName[0].toUpperCase();
    if (user.email) return user.email[0].toUpperCase();

    return "U";
  }

  // Function to get display name
  function getDisplayName(user: Props["user"]): string {
    if (!user) return "User";
    if (user.given_name && user.family_name)
      return `${user.given_name} ${user.family_name}`;

    if (user.given_name) return user.given_name;
    if (user.email) return user.email.split("@")[0];

    return "User";
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Element;
    if (!target.closest(".profile-dropdown")) {
      isDropdownOpen = false;
    }
  }

  const SIGNED_IN_MENU_ITEMS = [
    {
      label: "Conversations",
      icon: "mdi:chat-outline",
      href: "/conversations",
    },
    {
      label: "Sign Out",
      icon: "mdi:logout",
      href: "/api/auth/logout",
    },
  ];

  $effect(() => {
    if (isDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  });
</script>

<div class="relative profile-dropdown">
  <button
    onclick={() => (isDropdownOpen = !isDropdownOpen)}
    class="flex items-center gap-2 rounded-full bg-white/70 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white/80 hover:shadow-xl cursor-pointer"
    aria-label="Profile menu"
  >
    {#if isAuthenticated && user}
      <!-- User Avatar -->
      <div class="relative h-8 w-8 overflow-hidden rounded-full">
        {#if user.picture}
          <img
            src={user.picture}
            alt={getDisplayName(user)}
            class="h-full w-full object-cover"
          />
        {:else}
          <div
            class="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-medium text-white"
          >
            {getUserInitials(user)}
          </div>
        {/if}
      </div>

      <!-- Name (hidden on mobile) -->
      <span class="hidden font-medium text-gray-700 sm:block">
        {getDisplayName(user)}
      </span>
    {:else}
      <!-- Sign In Icon -->
      <div
        class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500"
      >
        <Icon icon="mdi:account" class="h-5 w-5 text-white" />
      </div>

      <!-- Sign In Text (hidden on mobile) -->
      <span class="hidden font-medium text-gray-700 sm:block"> Sign In </span>
    {/if}

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
      {#if isAuthenticated && user}
        <!-- User Info Section -->
        <div class="border-b border-gray-200 p-3">
          <div class="flex items-center gap-3">
            <div class="relative h-10 w-10 overflow-hidden rounded-full">
              {#if user.picture}
                <img
                  src={user.picture}
                  alt={getDisplayName(user)}
                  class="h-full w-full object-cover"
                />
              {:else}
                <div
                  class="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 text-white font-medium"
                >
                  {getUserInitials(user)}
                </div>
              {/if}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 truncate">
                {getDisplayName(user)}
              </p>
              <p class="text-sm text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          {#each SIGNED_IN_MENU_ITEMS as item}
            <a
              href={item.href}
              class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <Icon icon={item.icon} class="h-4 w-4" />
              {item.label}
            </a>
          {/each}
        </div>
      {:else}
        <!-- Not Authenticated Menu -->
        <div class="py-1">
          <a
            href="/api/auth/login"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-600"
          >
            <Icon icon="mdi:login" class="h-4 w-4" />
            Sign In
          </a>
          <a
            href="/api/auth/register"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-purple-50 hover:text-purple-600"
          >
            <Icon icon="mdi:account-plus" class="h-4 w-4" />
            Sign Up
          </a>
        </div>
      {/if}
    </div>
  {/if}
</div>
