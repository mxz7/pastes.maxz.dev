<script lang="ts">
  import ControlBar from "$lib/components/ControlBar.svelte";
  import fonts from "$lib/fonts";
  import { createState } from "$lib/state.svelte";
  import { onMount, setContext } from "svelte";
  import "../app.css";

  let { children } = $props();

  const font = createState("Fira Mono");
  const fontSize = createState("16");
  const uploadContent = createState("");

  setContext("upload_content", uploadContent);
  setContext("post_data", createState<{ createdAt: number; size: number } | undefined>(undefined));
  setContext("font", font);
  setContext("font_size", fontSize);

  onMount(() => {
    if (localStorage.getItem("preferred_font")) {
      font.set(localStorage.getItem("preferred_font")!);
    }

    if (localStorage.getItem("preferred_font_size")) {
      fontSize.set(localStorage.getItem("preferred_font_size")!);
    }
  });
</script>

<svelte:head>
  <title>pastes</title>

  <link rel="stylesheet" href={fonts.find((i) => i.name === font.value)?.url || ""} />
</svelte:head>

<ControlBar {font} {fontSize} />

<div class="mb-4 px-4" style="font-size: {fontSize.value}px; font-family: {font.value};">
  {@render children()}
</div>
