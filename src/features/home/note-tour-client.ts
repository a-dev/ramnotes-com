import { wireCallouts } from "../../shared/lib/callouts";
import { wireRadioMenu } from "../../shared/lib/menu";

const BAND = 56;
const SNAP = 16;

for (const tour of document.querySelectorAll<HTMLElement>("[data-note-tour]")) {
  const target = tour.querySelector<HTMLElement>("[data-tour-note]");
  const trigger = tour.querySelector<HTMLButtonElement>("[data-tint]");
  const menu = tour.querySelector<HTMLElement>('[role="menu"]');
  const svg = tour.querySelector<SVGSVGElement>(":scope > svg");
  if (!target || !trigger || !menu || !svg) continue;
  const sizes = (tour.dataset.sizes ?? "").split(" ");
  let size = 1;

  const tint = wireRadioMenu({
    trigger,
    menu,
    items: [...menu.querySelectorAll<HTMLButtonElement>("[data-tone]")],
    place: () => {
      const box = tour.getBoundingClientRect();
      const at = trigger.getBoundingClientRect();
      return {
        x: Math.min(at.left - box.left, box.width - menu.offsetWidth),
        y: at.bottom + 6 - box.top,
      };
    },
    onSelect: (item) => {
      target.style.setProperty("--_note-fill", `var(--color-note-${item.dataset.tone})`);
    },
  });

  wireCallouts({
    root: tour,
    svg,
    head: "note-tour-head",
    hotHead: "note-tour-head-hot",

    before: () => {
      if (tint.isOpen()) tint.close();
    },
    route: (label, box) => {
      const button = tour.querySelector(`[data-anchor="${label.dataset.callout}"]`);
      if (!button) return [];
      const from = label.getBoundingClientRect();
      const to = button.getBoundingClientRect();
      const bx = to.left + to.width / 2 - box.left;

      const center = from.left + from.width / 2 - box.left;
      const ax = Math.abs(center - bx) < SNAP ? bx : center;
      const ay = from.bottom + 6 - box.top;
      const by = to.top - 2 - box.top;

      const bend = Math.max(ay, by - BAND);
      return [`M${ax} ${ay} L${ax} ${bend} C${ax} ${by} ${bx} ${bend} ${bx} ${by}`];
    },
  });

  const setCommand = (event: KeyboardEvent | MouseEvent) => {
    target.toggleAttribute("data-command", event.metaKey);
  };
  for (const type of ["keydown", "keyup", "mousemove"] as const) {
    document.addEventListener(type, setCommand);
  }
  window.addEventListener("blur", () => target.removeAttribute("data-command"));
  for (const link of target.querySelectorAll<HTMLAnchorElement>("[data-link]")) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      if (event.metaKey) window.open(link.href, "_blank", "noopener");
    });
  }

  for (const button of tour.querySelectorAll<HTMLButtonElement>("[data-size]")) {
    button.addEventListener("click", () => {
      size = Math.min(sizes.length - 1, Math.max(0, size + Number(button.dataset.size)));
      target.style.setProperty("--_fs", `var(${sizes[size]})`);
    });
  }
}
