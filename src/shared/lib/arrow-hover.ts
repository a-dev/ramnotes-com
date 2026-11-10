const RUN_MS = 900;
const FADE = 0.2;
const RADIUS = "3";
const SVG_NS = "http://www.w3.org/2000/svg";

interface ArrowHover {
  svg: SVGSVGElement;
  labels: Iterable<HTMLElement>;

  head: string;
  hotHead: string;
}

export const markHot = (path: Element, hot: boolean, { head, hotHead }: ArrowHover) => {
  path.toggleAttribute("data-hot", hot);
  path.setAttribute("marker-end", `url(#${hot ? hotHead : head})`);
};

export const wireArrowHover = (options: ArrowHover) => {
  const { svg, labels } = options;
  const still = matchMedia("(prefers-reduced-motion: reduce)");

  let running = 0;
  const pathsFor = (name: string) => [
    ...svg.querySelectorAll<SVGPathElement>(`:scope > path[data-for="${name}"]`),
  ];
  const clearDots = () =>
    svg.querySelectorAll(":scope > [data-runner]").forEach((dot) => dot.remove());

  const run = (name: string, start: number, id: number) => (now: number) => {
    if (running !== id) return;
    const paths = pathsFor(name);
    const dots = [...svg.querySelectorAll<SVGCircleElement>(":scope > [data-runner]")];
    while (dots.length < paths.length) {
      const dot = document.createElementNS(SVG_NS, "circle");
      dot.dataset.runner = "";
      dot.setAttribute("r", RADIUS);
      svg.append(dot);
      dots.push(dot);
    }
    const t = ((now - start) % RUN_MS) / RUN_MS;
    const opacity = String(Math.min(1, t / FADE, (1 - t) / FADE));
    for (const [index, dot] of dots.entries()) {
      const path = paths[index];
      if (!path) {
        dot.remove();
        continue;
      }
      const point = path.getPointAtLength(t * path.getTotalLength());
      dot.setAttribute("cx", String(point.x));
      dot.setAttribute("cy", String(point.y));
      dot.style.opacity = opacity;
    }
    requestAnimationFrame(run(name, start, id));
  };

  for (const label of labels) {
    const name = label.dataset.callout ?? "";
    label.addEventListener("pointerenter", () => {
      for (const path of pathsFor(name)) markHot(path, true, options);
      clearDots();
      if (still.matches) return;
      const id = ++running;
      requestAnimationFrame((now) => run(name, now, id)(now));
    });
    label.addEventListener("pointerleave", () => {
      for (const path of pathsFor(name)) markHot(path, false, options);
      running++;
      clearDots();
    });
  }
};
