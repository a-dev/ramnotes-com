import type { Tone } from "../../shared/tones";

export { tones } from "../../shared/tones";
export const sizes = ["--fs-s", "--fs-m", "--fs-l", "--fs-xl"] as const;
export const START_TONE: Tone = "blue";

export const callouts = [
  { anchor: "tint", label: "Tint the note", keys: [], tryIt: true },
  { anchor: "size", label: "Text size", keys: ["⌘−", "⌘+"], tryIt: true },
  { anchor: "list", label: "Open note list", keys: ["⌘L"], tryIt: false },
  { anchor: "new", label: "New note", keys: ["⌘N"], tryIt: false },
  { anchor: "trash", label: "Move to Trash", keys: ["⌘⌫"], tryIt: false },
] as const;
