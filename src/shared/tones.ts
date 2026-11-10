export const tones = [
  { id: "none", name: "No color" },
  { id: "gray", name: "Gray" },
  { id: "blue", name: "Blue" },
  { id: "green", name: "Green" },
  { id: "yellow", name: "Yellow" },
  { id: "red", name: "Red" },
  { id: "purple", name: "Purple" },
] as const;

export type Tone = (typeof tones)[number]["id"];
