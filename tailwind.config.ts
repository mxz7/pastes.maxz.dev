import daisyui from "daisyui";
import type { Config } from "tailwindcss";
import catppuccin from "@catppuccin/daisyui";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {},
  },

  plugins: [daisyui],

  daisyui: {
    themes: [catppuccin("mocha")],
  },
} as Config;
