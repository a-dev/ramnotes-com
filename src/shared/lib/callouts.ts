import { markHot, wireArrowHover } from "./arrow-hover";

const SVG_NS = "http://www.w3.org/2000/svg";

interface Callouts {
  root: HTMLElement;
  svg: SVGSVGElement;

  head: string;
  hotHead: string;

  before?: () => void;

  route: (label: HTMLElement, box: DOMRect) => string[];
}

export const wireCallouts = ({ root, svg, head, hotHead, before, route }: Callouts) => {
  const labels = [...root.querySelectorAll<HTMLElement>("[data-callout]")];
  const hover = { svg, labels, head, hotHead };
  wireArrowHover(hover);

  const draw = () => {
    before?.();
    const box = root.getBoundingClientRect();
    svg.setAttribute("width", String(box.width));
    svg.setAttribute("height", String(box.height));
    svg.querySelectorAll(":scope > path").forEach((path) => path.remove());

    if (getComputedStyle(svg).display === "none") return;
    for (const label of labels) {
      if (label.hidden) continue;
      for (const d of route(label, box)) {
        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", d);
        path.dataset.for = label.dataset.callout;
        markHot(path, label.matches(":hover"), hover);
        svg.append(path);
      }
    }
  };

  new ResizeObserver(draw).observe(root);
  document.fonts.ready.then(draw);
  return draw;
};
