import type { Tone } from "../../shared/tones";

export const notes = [
  {
    id: "plain-files",
    text: "Every note is a plain .txt file. Save it to iCloud, Dropbox, or right inside a project folder, where your scripts or AI tools can read it, sort it, and clean it up.",
    when: "Today at 9:41 AM",
    updated: 4,
    created: 2,
    tone: null,
    path: "~/Documents/my-project/my-ideas.txt",
  },
  {
    id: "formatting",
    text: "You might find it limiting that notes have no formatting tools. That's on purpose. If you want to format text, it means you are starting to process the information, and that's not what RAMnotes is for.",
    when: "Today at 8:07 AM",
    updated: 3,
    created: 4,
    tone: "yellow",
    path: "",
  },
  {
    id: "scroll",
    text: "Don’t like shortcuts? No problem: scroll in the menu bar.",
    when: "Yesterday at 6:52 PM",
    updated: 2,
    created: 1,
    tone: "blue",
    path: "",
  },
  {
    id: "bookkeeping",
    text: "The tedious part of maintaining a knowledge base is not the reading or the thinking — it's the bookkeeping.",
    when: "Yesterday at 11:18 AM",
    updated: 1,
    created: 3,
    tone: "green",
    path: "",
  },
] as const satisfies ReadonlyArray<Record<string, unknown> & { tone: Tone | null }>;

export const OPEN = "bookkeeping";
export const SELECTED = "bookkeeping";

export const sorts = [
  { id: "updated-desc", name: "Recently updated" },
  { id: "updated-asc", name: "Oldest updated first" },
  { id: "created-desc", name: "Recently created" },
  { id: "created-asc", name: "Oldest created first" },
  { id: "text-asc", name: "A–Z" },
  { id: "text-desc", name: "Z–A" },
] as const;

export const startCallouts = [
  { anchor: "custom-folder", label: "Note in a custom folder", all: false },
  { anchor: "default-folder", label: "Note in the default folder", all: false },
] as const;
export const endCallouts = [
  { anchor: "tint", label: "Color for the note", all: true },
  { anchor: "move", label: "Move a note at any time", all: false },
] as const;

export type Note = (typeof notes)[number];
export type CalloutAnchor = (typeof startCallouts | typeof endCallouts)[number]["anchor"];
