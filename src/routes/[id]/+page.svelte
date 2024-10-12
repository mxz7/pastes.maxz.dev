<script lang="ts">
  import type { State } from "$lib/state.svelte.js";
  import { getContext, onDestroy } from "svelte";

  let { data } = $props();

  const postData = getContext<State<{ createdAt: number; size: number } | undefined>>("post_data");

  postData.set({ createdAt: data.createdAt!, size: data.size! });

  onDestroy(() => {
    postData.set(undefined);
  });
</script>

{#await data.content}
  <div class="flex w-full justify-center">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>
{:then content}
  <p class="overflow-x-scroll whitespace-pre">
    {content}
  </p>
{/await}
