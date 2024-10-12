// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    interface Error {
      errorId?: string;
    }
    interface Locals {
      startTimer: number;
      error?: string | undefined;
      errorId?: string | undefined;
      errorStackTrace?: string | undefined;
      message?: unknown | undefined;
    }
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
