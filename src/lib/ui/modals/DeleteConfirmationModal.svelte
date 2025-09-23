<script lang="ts">
  import * as Dialog from "$lib/ui/dialog";

  let {
    showDeleteDialog,
    handleDelete,
    isDeleting,
    dialogDescription,
    dialogTitle,
  }: {
    showDeleteDialog: boolean;
    handleDelete: () => void;
    isDeleting: boolean;
    dialogDescription: string;
    dialogTitle: string;
  } = $props();

  function handleDeleteConfirm() {
    isDeleting = true;
    handleDelete();
    showDeleteDialog = false;
  }
</script>

<Dialog.Root bind:open={showDeleteDialog}>
  <Dialog.Content class="sm:max-w-md">
    <Dialog.Header>
      <Dialog.Title>{dialogTitle}</Dialog.Title>
      <Dialog.Description>{dialogDescription}</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer class="flex justify-end space-x-2">
      <button
        onclick={() => (showDeleteDialog = false)}
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        disabled={isDeleting}
      >
        Cancel
      </button>
      <button
        onclick={handleDeleteConfirm}
        disabled={isDeleting}
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>
