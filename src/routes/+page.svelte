<script lang="ts">
  import type { State } from "$lib/state.svelte";
  import { formatBytes } from "$lib/utils";
  import { getContext } from "svelte";

  const uploadContent = getContext<State<string>>("upload_content");

  let bytes = $derived(new TextEncoder().encode(uploadContent.value).byteLength);
  let formatted = $derived(formatBytes(bytes));
</script>

<div class="flex w-full justify-center">
  <div class="w-full max-w-4xl px-2 md:px-0">
    <div class="flex w-full justify-center gap-8 text-center">
      <span>{uploadContent.value.length.toLocaleString()} characters</span>
      {#if bytes > 1024}
        <span>{formatted}</span>
      {/if}
    </div>

    <textarea
      class="textarea mt-4 min-h-[80vh] w-full rounded-lg bg-base-200"
      placeholder="Content"
      oninput={(e) => uploadContent.set(e.currentTarget.value)}
      value={uploadContent.value}
    ></textarea>
  </div>
</div>
