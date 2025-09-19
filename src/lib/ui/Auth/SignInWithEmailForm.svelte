<script lang="ts">
  import { MINIMUM_PASSWORD_LENGTH } from "$lib/constants/minimum-password-length.constant";

  export let isSignUp = false;
  export let name = "";
  export let email = "";
  export let password = "";
</script>

<div class="space-y-4">
  {#if isSignUp}
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700">
        Full Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        required
        bind:value={name}
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
        placeholder="Enter your full name"
      />
    </div>
  {/if}

  <div>
    <label for="email" class="block text-sm font-medium text-gray-700">
      Email
    </label>
    <input
      id="email"
      name="email"
      type="email"
      required
      bind:value={email}
      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
      placeholder="Enter your email"
    />
  </div>

  <div>
    <label for="password" class="block text-sm font-medium text-gray-700">
      Password
      {#if isSignUp}
        <span class="text-xs opacity-80"
          >({MINIMUM_PASSWORD_LENGTH} characters minimum)</span
        >
      {/if}
    </label>
    <input
      id="password"
      name="password"
      type="password"
      required
      minlength={MINIMUM_PASSWORD_LENGTH}
      bind:value={password}
      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
      placeholder="Enter your password"
    />
  </div>
</div>
