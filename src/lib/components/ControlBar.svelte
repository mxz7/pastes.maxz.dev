<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import fonts from "$lib/fonts";
  import type { State } from "$lib/state.svelte";
  import { formatBytes } from "$lib/utils";
  import { Info, Settings, Upload } from "lucide-svelte";
  import { getContext } from "svelte";

  type Props = {
    font: State<string>;
    fontSize: State<string>;
  };

  let { font, fontSize }: Props = $props();

  let settingsModal: HTMLDialogElement;
  let infoModal: HTMLDialogElement;
  let errorModal: HTMLDialogElement;

  let errorText = $state("");
  let uploading = $state<boolean>(false);

  const postData = getContext<State<{ createdAt: number; size: number } | undefined>>("post_data");
  const uploadContent = getContext<State<string>>("upload_content");

  async function upload() {
    uploading = true;
    if (!uploadContent.value) {
      errorText = "No content to upload";
      errorModal.showModal();
      return;
    }

    const response = await fetch("/api/post", {
      method: "PUT",
      body: uploadContent.value,
    });

    if (!response.ok) {
      errorText = await response.text();
      errorModal.showModal();
      return;
    }

    const data = await response.json();

    await goto(`/${data.id}`);

    uploading = false;
  }
</script>

<div class="sticky top-0 flex w-full justify-center p-4">
  <div
    class="flex w-full max-w-5xl rounded-2xl border border-primary border-opacity-15 bg-base-300 bg-opacity-90 p-2 shadow-lg backdrop-blur-sm"
  >
    <a href="/" class="btn btn-ghost text-xl font-semibold">
      <h1 class="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">pastes</h1>
    </a>
    <div class="grow"></div>
    {#if postData.value}
      <button class="btn btn-ghost" onclick={() => infoModal.showModal()}>
        <Info class="text-primary" />
      </button>
    {:else if $page.url.pathname === "/"}
      {#if uploading}
        <button class="btn btn-ghost">
          <span class="loading loading-spinner text-primary"></span>
        </button>
      {:else}
        <button class="btn btn-ghost" onclick={upload}>
          <Upload class="text-success" />
        </button>
      {/if}
    {/if}

    <button class="btn btn-ghost" onclick={() => settingsModal.showModal()}>
      <Settings class="text-primary" />
    </button>
  </div>
</div>

<dialog class="modal" bind:this={settingsModal}>
  <div class="modal-box">
    <h2 class="text-center text-lg font-bold">Settings</h2>

    <div class="label">
      <span class="label-text">Font Family</span>
    </div>
    <select
      class="select select-bordered w-full max-w-xs"
      oninput={(e) => {
        font.set(e.currentTarget.value);
        localStorage.setItem("preferred_font", e.currentTarget.value);
      }}
    >
      {#each fonts as fontData}
        <option value={fontData.name} selected={font.value === fontData.name}>
          {fontData.name}
        </option>
      {/each}
    </select>

    <div class="label">
      <span class="label-text">Font Size ({fontSize.value})</span>
    </div>
    <input
      type="range"
      min="8"
      max="32"
      value="16"
      class="range"
      oninput={(e) => {
        console.log(e.currentTarget.value);
        fontSize.set(e.currentTarget.value);
        localStorage.setItem("preferred_font_size", e.currentTarget.value);
      }}
    />
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog class="modal" bind:this={infoModal}>
  <div class="modal-box">
    <h2 class="text-center text-lg font-bold">Information</h2>

    <p>Size: {formatBytes(postData.value?.size || 0)}</p>
    <p>Created at: {new Date(postData.value?.createdAt || 0).toLocaleString()}</p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>

<dialog class="modal" bind:this={errorModal}>
  <div class="modal-box">
    <h2 class="text-center text-lg font-bold text-error">Error</h2>

    <p>{errorText}</p>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
