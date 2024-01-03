import { persisted } from "svelte-local-storage-store";

export const habits = persisted("habits", []);

export const history = persisted("history", []);
