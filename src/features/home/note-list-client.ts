import { wireCallouts } from "../../shared/lib/callouts";
import { wireRadioMenu } from "../../shared/lib/menu";

type Row = HTMLLIElement;
const COMPARE: Record<string, (a: Row, b: Row) => number> = {
  updated: (a, b) => Number(a.dataset.updated) - Number(b.dataset.updated),
  created: (a, b) => Number(a.dataset.created) - Number(b.dataset.created),
  text: (a, b) => (a.textContent ?? "").trim().localeCompare((b.textContent ?? "").trim()),
};
const BEND = 0.5;

const DEFAULT_SORT = "updated-desc";

const RADIUS = 6;

for (const list of document.querySelectorAll<HTMLElement>("[data-note-list]")) {
  const rowsBox = list.querySelector<HTMLElement>("[data-rows]");
  const trigger = list.querySelector<HTMLButtonElement>("[data-sort-trigger]");
  const sortName = list.querySelector<HTMLElement>("[data-sort-name]");
  const menu = list.querySelector<HTMLElement>('[role="menu"]');
  const contextMenu = list.querySelector<HTMLElement>("[data-context-menu]");
  const svg = list.querySelector<SVGSVGElement>(":scope > svg");
  if (!rowsBox || !trigger || !sortName || !menu || !contextMenu || !svg) continue;
  const rows = [...rowsBox.querySelectorAll<Row>("[data-row]")];
  const moveLabel = list.querySelector<HTMLElement>('[data-callout="move"]');
  let menuRow =
    rows.find((row) => row.querySelector("button")?.ariaPressed === "true") ??
    rows[rows.length - 1];

  const placeContextMenu = () => {
    const box = list.getBoundingClientRect();
    const at = menuRow.getBoundingClientRect();
    contextMenu.style.setProperty("--_menu-x", `${at.left + at.width * 0.42 - box.left}px`);
    contextMenu.style.setProperty("--_menu-y", `${at.top + at.height * 0.62 - box.top}px`);
  };

  const lane = () => parseFloat(getComputedStyle(rowsBox).rowGap) / 2;
  const targetY = (target: Element) => {
    const row = target.closest("[data-row]")?.getBoundingClientRect();
    const rect = target.getBoundingClientRect();
    return row ? row.bottom + lane() : rect.top + rect.height / 2;
  };
  const route = (label: HTMLElement, box: DOMRect) => {
    if (!label.parentElement) return [];
    const matches = [...list.querySelectorAll(`[data-anchor="${label.dataset.callout}"]`)];
    const targets = label.dataset.all === "true" ? matches : matches.slice(0, 1);
    if (targets.length === 0) return [];
    const ys = targets.map(targetY);
    const y = (Math.min(...ys) + Math.max(...ys)) / 2;
    label.parentElement.dataset.placed = "";
    const column = label.parentElement.getBoundingClientRect();
    label.style.setProperty("--_y", `${y - column.top}px`);
    const from = label.getBoundingClientRect();
    return targets.map((target, index) => {
      const to = target.getBoundingClientRect();
      const toRight = from.right < to.left;
      const ax = (toRight ? from.right + 8 : from.left - 8) - box.left;
      const ay = y - box.top;
      const by = ys[index] - box.top;
      const row = target.closest("[data-row]")?.getBoundingClientRect();

      const ex =
        (row ? (toRight ? row.left : row.right) : toRight ? to.left - 4 : to.right + 4) - box.left;
      const mx = ax + (ex - ax) * BEND;
      let d = `M${ax} ${ay} C${mx} ${ay} ${mx} ${by} ${ex} ${by}`;
      if (row) {
        const bx = to.left + to.width / 2 - box.left;
        const r = Math.min(RADIUS, lane());
        const turn = toRight ? bx - r : bx + r;
        d += ` L${turn} ${by} Q${bx} ${by} ${bx} ${by - r} L${bx} ${to.bottom + 3 - box.top}`;
      }
      return d;
    });
  };
  const drawArrows = wireCallouts({
    root: list,
    svg,
    head: "note-list-head",
    hotHead: "note-list-head-hot",
    before: placeContextMenu,
    route,
  });

  const sort = (id: string) => {
    const [key, direction] = id.split("-");
    const sign = direction === "asc" ? 1 : -1;
    const ordered = [...rows].sort((a, b) => sign * COMPARE[key](a, b));
    const apply = () => {
      rowsBox.append(...ordered);
      contextMenu.hidden = id !== DEFAULT_SORT;
      if (moveLabel) moveLabel.hidden = id !== DEFAULT_SORT;
      drawArrows();
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) document.startViewTransition(apply);
    else apply();
  };

  wireRadioMenu({
    trigger,
    menu,
    items: [...menu.querySelectorAll<HTMLButtonElement>("[data-sort]")],
    place: () => {
      const box = list.getBoundingClientRect();
      const at = trigger.getBoundingClientRect();
      return { x: at.left - 6 - box.left, y: at.bottom + 6 - box.top };
    },
    onSelect: (item) => {
      sortName.textContent = item.textContent?.trim() ?? "";
      sort(item.dataset.sort ?? DEFAULT_SORT);
    },
  });

  const select = (row: Row) => {
    for (const other of rows) {
      const button = other.querySelector("button");
      if (button) button.ariaPressed = String(other === row);
    }
  };
  for (const row of rows) {
    row.addEventListener("click", () => select(row));
    row.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      select(row);
      menuRow = row;
      placeContextMenu();
    });
  }
}
