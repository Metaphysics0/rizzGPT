<script lang="ts">
  import type { ActionData } from "./$types";
  import SignInForm from "$lib/ui/Auth/SignInForm.svelte";
  let { form }: { form: ActionData } = $props();
</script>

<div class="flex items-center justify-center">
  <SignInForm {form} />
</div>
