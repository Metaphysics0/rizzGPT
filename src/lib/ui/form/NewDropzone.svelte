<script lang="ts">
  import { Button } from "$lib/components/button";
  import {
    displaySize,
    FileDropZone,
    MEGABYTE,
    type FileDropZoneProps,
  } from "$lib/components/file-drop-zone";
  import { Progress } from "$lib/components/progress";
  import {
    FileUploadHandler,
    type UploadedFile,
  } from "$lib/utils/file/file-upload-handler";
  import { firstMoveGeneratorFormStore } from "$lib/stores/first-move-generator-form.svelte";
  import XIcon from "@lucide/svelte/icons/x";
  import { onDestroy } from "svelte";
  import { SvelteDate } from "svelte/reactivity";
  import FormStep from "./FormStep.svelte";

  let files = $state<UploadedFile[]>([]);
  let uploading = $state(false);

  const fileUploadHandler = new FileUploadHandler({
    onFileUploaded: (fileName) => {
      firstMoveGeneratorFormStore.addImageFileName(fileName);
    },
    onFileUploadError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const onUpload: FileDropZoneProps["onUpload"] = async (uploadFiles) => {
    uploading = true;
    try {
      const uploadPromises = uploadFiles.map(async (file) => {
        const isFileAlreadyUploaded = files.find((f) => f.name === file.name);
        if (isFileAlreadyUploaded) {
          console.warn(`File ${file.name} already uploaded`);
          return;
        }

        const uploadedFile = await fileUploadHandler.uploadFile(file);
        files.push(uploadedFile);
      });

      await Promise.allSettled(uploadPromises);
    } finally {
      uploading = false;
    }
  };

  const onFileRejected: FileDropZoneProps["onFileRejected"] = ({
    reason,
    file,
  }) => {
    console.error(`${file.name} failed to upload!`, { description: reason });
  };

  const removeFile = async (index: number) => {
    const file = files[index];
    if (file) {
      try {
        const url = await file.url;
        FileUploadHandler.revokeObjectURL(url);
      } catch {
        // URL might not be ready yet
      }

      // Remove from form store if it was successfully uploaded
      if (file.fileName) {
        firstMoveGeneratorFormStore.removeImageFileName(file.fileName);
      }

      files.splice(index, 1);
    }
  };

  let date = new SvelteDate();
  onDestroy(async () => {
    for (const file of files) {
      try {
        const url = await file.url;
        FileUploadHandler.revokeObjectURL(url);
      } catch {
        // URL might not be ready yet
      }
    }
  });

  $effect(() => {
    const interval = setInterval(() => {
      date.setTime(Date.now());
    }, 10);
    return () => {
      clearInterval(interval);
    };
  });
</script>

<FormStep
  title="Match Profile Analysis"
  tooltip="Upload screenshots of your match bio"
>
  <div class="flex w-full flex-col gap-2 p-6">
    <FileDropZone
      {onUpload}
      {onFileRejected}
      maxFileSize={2 * MEGABYTE}
      accept="image/*"
      maxFiles={5}
      fileCount={files.length}
      disabled={uploading}
    />
    <div class="flex flex-col gap-2">
      {#each files as file, i (file.name)}
        <div class="flex place-items-center justify-between gap-2">
          <div class="flex place-items-center gap-2">
            {#await file.url then src}
              <div class="relative size-9 overflow-clip">
                <img
                  {src}
                  alt={file.name}
                  class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-clip"
                />
              </div>
            {/await}
            <div class="flex flex-col">
              <span>{file.name}</span>
              <span class="text-muted-foreground text-xs"
                >{displaySize(file.size)}</span
              >
            </div>
          </div>
          {#await file.url}
            <Progress
              class="h-2 w-full grow"
              value={((date.getTime() - file.uploadedAt) / 1000) * 100}
              max={100}
            />
          {:then url}
            <Button variant="outline" size="icon" onclick={() => removeFile(i)}>
              <XIcon />
            </Button>
          {/await}
        </div>
      {/each}
    </div>
  </div>
</FormStep>
