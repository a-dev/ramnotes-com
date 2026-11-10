import { readFileSync } from "node:fs";

type Theme = "light" | "dark";
type Rgb = number[];

const read = (file: string) =>
  readFileSync(new URL(`../src/shared/styles/vars/${file}`, import.meta.url), "utf8");
const css = read("palette.css") + read("colors.css");
const tokens = new Map<string, string>();
for (const [, name, value] of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) {
  tokens.set(name, value.replaceAll(/\s+/g, " ").trim());
}

const splitArgs = (text: string) => {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === "," && depth === 0) {
      parts.push(text.slice(start, index).trim());
      start = index + 1;
    }
  }
  parts.push(text.slice(start).trim());
  return parts;
};

const inner = (value: string, fn: string) => value.slice(fn.length + 1, -1);

const resolve = (value: string, theme: Theme): Rgb => {
  if (value.startsWith("#")) {
    return value
      .slice(1)
      .match(/.{2}/g)!
      .slice(0, 3)
      .map((hex) => parseInt(hex, 16));
  }
  if (value.startsWith("var(")) return resolve(tokens.get(inner(value, "var").slice(2))!, theme);
  if (value.startsWith("light-dark(")) {
    const [light, dark] = splitArgs(inner(value, "light-dark"));
    return resolve(theme === "light" ? light : dark, theme);
  }
  if (value.startsWith("color-mix(")) {
    const [, first, second] = splitArgs(inner(value, "color-mix"));
    const percent = first.slice(first.lastIndexOf(" ") + 1);
    const amount = parseFloat(percent) / 100;
    const a = resolve(first.slice(0, first.lastIndexOf(" ")), theme);
    const b = resolve(second, theme);
    return a.map((channel, index) => channel * amount + b[index] * (1 - amount));
  }
  throw new Error(`Cannot resolve color: ${value}`);
};

const luminance = (color: Rgb) =>
  color
    .map((value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);

const surfaces = ["main-bg", "panel-bg", "gray", "blue", "green", "yellow", "red", "purple"].map(
  (name) => (name.endsWith("-bg") ? name : `note-${name}`),
);
let failures = 0;
for (const theme of ["light", "dark"] as const) {
  for (const foreground of ["text-primary", "action-text"]) {
    for (const surface of surfaces) {
      const values = [
        luminance(resolve(`var(--color-${foreground})`, theme)),
        luminance(resolve(`var(--color-${surface})`, theme)),
      ].sort((a, b) => b - a);
      const ratio = (values[0] + 0.05) / (values[1] + 0.05);
      if (ratio < 4.5) {
        console.error(`${theme}: ${foreground} on ${surface}: ${ratio.toFixed(2)} FAIL`);
        failures++;
      }
    }
  }
}
if (failures) process.exit(1);
console.log("Contrast: all text and link pairs pass WCAG AA in both themes.");
