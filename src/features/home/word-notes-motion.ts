import { words } from "./word-notes-words";

export const LINES = 5;
const PAUSE_MS = 800;

const EXIT_MS = 300;

const SHIFT_MS = 400;

const ROOM_LEAD_MS = 120;

const FLY_IN_MS = 450;

const ENTRY_PX = 600;

const EXIT_PX = 200;

const FADE_MS = 700;
const BOUNCE_MS = 500;

const BOUNCE_PX = 22;
const BOUNCE_DAMPING = 4;

const BOUNCE_WAVES = 1.5;
const CURVE_SAMPLES = 24;
const BOUNCE_SAMPLES = 16;
const DESKTOP_QUERY = "(width > 1024px)";
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";

type Point = { x: number; y: number };
type Path = (t: number) => Point;

const random = () => Math.random();
const randomWord = () => words[Math.floor(random() * words.length)];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInQuad = (t: number) => t * t;

const shiftEase = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const translate = ({ x, y }: Point) => `translate(${x}px, ${y}px)`;

function wordsIn(text: HTMLElement): HTMLElement[] {
  return [...text.children].filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.dataset.flyer === undefined,
  );
}

function createWord(value: string): HTMLElement {
  const word = document.createElement("span");
  word.textContent = value;
  return word;
}

function overflowing(text: HTMLElement): HTMLElement[] {
  const limit = text.clientHeight - 1;
  return wordsIn(text).filter((word) => word.offsetTop >= limit);
}

function fill(text: HTMLElement) {
  text.replaceChildren();
  for (let guard = 0; guard < words.length; guard += 1) {
    const word = createWord(randomWord());
    text.append(word);
    if (overflowing(text).length > 0) {
      word.remove();
      return;
    }
  }
}

function sampleKeyframes(path: Path, ease: (t: number) => number): Keyframe[] {
  return Array.from({ length: CURVE_SAMPLES + 1 }, (_, index) => ({
    transform: translate(path(ease(index / CURVE_SAMPLES))),
  }));
}

const bounceDx = (t: number) =>
  BOUNCE_PX * Math.exp(-BOUNCE_DAMPING * t) * Math.sin(2 * Math.PI * BOUNCE_WAVES * t);

function landingKeyframes(
  path: Path,
  flightMs: number,
  ease: (t: number) => number,
): { keyframes: Keyframe[]; duration: number } {
  const duration = flightMs + BOUNCE_MS;
  const landAt = flightMs / duration;
  const seat = path(1);
  const direction = Math.sign(seat.x - path(0.95).x) || 1;
  const flight = Array.from({ length: CURVE_SAMPLES + 1 }, (_, index) => {
    const t = index / CURVE_SAMPLES;
    return {
      offset: t * landAt,
      transform: translate(path(ease(t))),
      opacity: Math.min(1, (t * flightMs) / FADE_MS),
    };
  });
  const bounce = Array.from({ length: BOUNCE_SAMPLES }, (_, index) => {
    const t = (index + 1) / BOUNCE_SAMPLES;
    const dx = direction * bounceDx(t);
    return {
      offset: landAt + t * (1 - landAt),
      transform: translate({ x: seat.x + dx, y: seat.y }),
      opacity: Math.min(1, (flightMs + t * BOUNCE_MS) / FADE_MS),
    };
  });
  return { keyframes: [...flight, ...bounce], duration };
}

function createFlyer(value: string, parent: HTMLElement, at: Point): HTMLElement {
  const flyer = createWord(value);
  flyer.dataset.flyer = "";
  flyer.style.transform = translate(at);
  parent.append(flyer);
  return flyer;
}

type Play = (element: HTMLElement, keyframes: Keyframe[], duration: number, delay?: number) => void;
type Move = { word: HTMLElement; from: Point; to: Point; wrapped: boolean };

function shiftNote(
  text: HTMLElement,
  textOrigin: Point,
  oldPositions: Map<HTMLElement, Point>,
  play: Play,
  delay: number,
): HTMLElement[] {
  const width = text.clientWidth;
  const gap = Number.parseFloat(getComputedStyle(text).columnGap) || 0;
  const moves: Move[] = wordsIn(text).flatMap((word) => {
    const old = oldPositions.get(word);
    if (!old) return [];
    const from = { x: old.x - textOrigin.x, y: old.y - textOrigin.y };
    const to = { x: word.offsetLeft, y: word.offsetTop };
    return [{ word, from, to, wrapped: Math.abs(from.y - to.y) > 1 }];
  });
  const outByLine = new Map<number, number>();
  const inByLine = new Map<number, number>();
  for (const { word, from, to } of moves.filter((move) => move.wrapped)) {
    const oldLine = Math.round(from.y);
    const newLine = Math.round(to.y);
    outByLine.set(oldLine, Math.max(outByLine.get(oldLine) ?? 0, width - from.x + gap));
    inByLine.set(newLine, Math.max(inByLine.get(newLine) ?? 0, to.x + word.offsetWidth + gap));
  }
  const slide = (dx: number) => sampleKeyframes((t) => ({ x: lerp(dx, 0, t), y: 0 }), shiftEase);
  const clones: HTMLElement[] = [];
  for (const { word, from, to, wrapped } of moves) {
    if (!wrapped) {
      if (from.x !== to.x) play(word, slide(from.x - to.x), SHIFT_MS, delay);
      continue;
    }
    const clone = createFlyer(word.textContent ?? "", text, from);
    clones.push(clone);
    const away = { x: from.x + (outByLine.get(Math.round(from.y)) ?? width), y: from.y };
    const leave: Path = (t) => ({ x: lerp(from.x, away.x, t), y: from.y });
    play(clone, sampleKeyframes(leave, shiftEase), SHIFT_MS, delay);
    play(word, slide(-(inByLine.get(Math.round(to.y)) ?? 0)), SHIFT_MS, delay);
  }
  return clones;
}

async function wordNotes(column: HTMLElement, first: HTMLElement, second: HTMLElement) {
  const animations: Animation[] = [];
  const flyers: HTMLElement[] = [];
  const hidden: HTMLElement[] = [];
  const origin = column.getBoundingClientRect();
  const position = (element: Element): Point => {
    const rect = element.getBoundingClientRect();
    return { x: rect.left - origin.left, y: rect.top - origin.top };
  };
  const hide = (word: HTMLElement) => {
    word.style.visibility = "hidden";
    hidden.push(word);
  };

  const play = (element: HTMLElement, keyframes: Keyframe[], duration: number, delay = 0) => {
    const fill = element.dataset.flyer === undefined ? "backwards" : "both";
    animations.push(element.animate(keyframes, { duration, delay, fill }));
  };
  const land = (
    flyer: HTMLElement,
    path: Path,
    flightMs: number,
    delay: number,
    ease = easeInQuad,
  ) => {
    const { keyframes, duration } = landingKeyframes(path, flightMs, ease);
    play(flyer, keyframes, duration, delay);
  };

  const rippleLine = (text: HTMLElement, lineTop: number, delay: number) => {
    const ripple = Array.from({ length: BOUNCE_SAMPLES + 1 }, (_, index) => ({
      transform: translate({ x: bounceDx(index / BOUNCE_SAMPLES), y: 0 }),
    }));
    for (const word of wordsIn(text)) {
      if (hidden.includes(word) || Math.abs(word.offsetTop - lineTop) > 1) continue;
      animations.push(word.animate(ripple, { duration: BOUNCE_MS, delay, fill: "none" }));
    }
  };

  const before = new Map<HTMLElement, Point>();
  for (const word of [...wordsIn(first), ...wordsIn(second)]) before.set(word, position(word));

  const incoming = createWord(randomWord());
  first.prepend(incoming);
  const moved = overflowing(first);
  second.prepend(...moved);
  const dropped = overflowing(second);
  for (const word of dropped) word.remove();

  const roomAt = EXIT_MS;
  const landAt = roomAt + SHIFT_MS + ROOM_LEAD_MS;

  hide(incoming);
  const seat = position(incoming);
  const glideIn: Path = (t) => ({ x: lerp(seat.x - ENTRY_PX, seat.x, t), y: seat.y });
  const arrival = createFlyer(incoming.textContent ?? "", column, glideIn(0));
  flyers.push(arrival);
  land(arrival, glideIn, FLY_IN_MS, Math.max(0, landAt - FLY_IN_MS));
  rippleLine(first, incoming.offsetTop, Math.max(landAt, FLY_IN_MS));

  const firstOrigin = position(first);
  const secondOrigin = position(second);
  const secondGap = Number.parseFloat(getComputedStyle(second).columnGap) || 0;
  const handoffDistance = Math.max(
    ENTRY_PX,
    ...moved.map((word) => word.offsetLeft + word.offsetWidth + secondGap),
  );
  for (const word of moved) {
    const from = before.get(word) ?? position(word);
    const to = position(word);
    before.delete(word);
    hide(word);
    const exit = { x: from.x - firstOrigin.x, y: from.y - firstOrigin.y };
    const leaving = createFlyer(word.textContent ?? "", first, exit);
    flyers.push(leaving);
    play(
      leaving,
      [
        { transform: translate(exit), opacity: 1, easing: "ease-in" },
        { transform: translate({ x: exit.x + EXIT_PX, y: exit.y }), opacity: 0 },
      ],
      EXIT_MS,
    );
    const glide: Path = (t) => ({ x: lerp(to.x - handoffDistance, to.x, t), y: to.y });
    const entering = createFlyer(word.textContent ?? "", column, glide(0));
    flyers.push(entering);
    land(entering, glide, FLY_IN_MS, Math.max(0, landAt - FLY_IN_MS));
  }

  for (const word of dropped) {
    const from = before.get(word);
    if (!from) continue;
    const local = { x: from.x - secondOrigin.x, y: from.y - secondOrigin.y };
    const flyer = createFlyer(word.textContent ?? "", second, local);
    flyers.push(flyer);
    const fall: Path = (t) => ({ x: local.x, y: lerp(local.y, second.clientHeight * 1.5, t) });
    play(flyer, sampleKeyframes(fall, easeInQuad), EXIT_MS);
  }

  for (const text of [first, second]) {
    flyers.push(...shiftNote(text, position(text), before, play, roomAt));
  }
  if (moved[0]) rippleLine(second, moved[0].offsetTop, Math.max(landAt, FLY_IN_MS));

  await Promise.all(animations.map((animation) => animation.finished));
  for (const flyer of flyers) flyer.remove();
  for (const word of hidden) word.style.removeProperty("visibility");
}

export function startWordNotes() {
  const column = document.querySelector<HTMLElement>("[data-word-notes]");
  const texts = column ? [...column.querySelectorAll<HTMLElement>("[data-note-text]")] : [];
  const [first, second] = texts;
  if (!column || !first || !second) return;

  const desktop = matchMedia(DESKTOP_QUERY);
  const motion = matchMedia(MOTION_QUERY);
  let filled = false;
  const fillOnce = () => {
    if (filled || !desktop.matches) return;
    filled = true;
    fill(first);
    fill(second);
  };
  fillOnce();
  desktop.addEventListener("change", fillOnce);

  let onScreen = false;
  let wake: (() => void) | undefined;
  const active = () => onScreen && !document.hidden && desktop.matches && motion.matches;
  const notify = () => {
    if (active()) wake?.();
  };
  new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? false;
    notify();
  }).observe(column);
  document.addEventListener("visibilitychange", notify);
  desktop.addEventListener("change", notify);
  motion.addEventListener("change", notify);
  const whenActive = () =>
    active() ? Promise.resolve() : new Promise<void>((resolve) => (wake = resolve));

  const loop = async () => {
    for (;;) {
      await sleep(PAUSE_MS);
      await whenActive();
      fillOnce();
      await wordNotes(column, first, second);
    }
  };
  void loop();
}
