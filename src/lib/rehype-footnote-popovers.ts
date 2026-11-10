import type { Element, ElementContent, Root, RootContent } from "hast";

type Parent = Root | Element;

const isElement = (node: RootContent | ElementContent): node is Element => node.type === "element";

function* elements(parent: Parent): Generator<[Element, Parent, number]> {
  for (const [index, child] of parent.children.entries()) {
    if (!isElement(child)) continue;
    yield [child, parent, index];
    yield* elements(child);
  }
}

const element = (
  tagName: string,
  properties: Element["properties"],
  children: ElementContent[] = [],
): Element => ({ type: "element", tagName, properties, children });

const text = (value: string): ElementContent => ({ type: "text", value });

function toPhrasing(nodes: ElementContent[]): ElementContent[] {
  return nodes
    .filter((node) => !(isElement(node) && node.properties.dataFootnoteBackref !== undefined))
    .map((node) => {
      if (!isElement(node)) return node;
      const children = toPhrasing(node.children);
      return node.tagName === "p"
        ? element("span", { dataFootnoteParagraph: "" }, children)
        : { ...node, children };
    });
}

function takeLastWord(node: ElementContent | RootContent | undefined): string {
  if (node?.type !== "text") return "";
  const start = node.value.search(/\s\S*$/) + 1;
  const word = node.value.slice(start);
  node.value = node.value.slice(0, start);
  return word;
}

export function rehypeFootnotePopovers() {
  return (tree: Root) => {
    const notes = new Map<string, ElementContent[]>();
    for (const [node] of elements(tree)) {
      if (node.tagName === "li" && String(node.properties.id ?? "").startsWith("user-content-fn-"))
        notes.set(String(node.properties.id), toPhrasing(structuredClone(node.children)));
    }

    for (const [sup, parent, index] of elements(tree)) {
      const ref = sup.tagName === "sup" ? sup.children.find(isElement) : undefined;
      if (!ref || ref.properties.dataFootnoteRef === undefined) continue;
      const noteId = String(ref.properties.href).slice(1);
      const content = notes.get(noteId);
      if (!content) continue;

      const label = noteId.replace("user-content-fn-", "");
      const popoverId = `footnote-${label}`;
      const trigger = element(
        "button",
        {
          type: "button",
          id: ref.properties.id,
          popovertarget: popoverId,
          ariaLabel: `Note ${label}`,
          dataFootnoteRef: "",
        },
        [text(`*${label}`)],
      );
      const popover = element("span", { popover: "auto", id: popoverId, dataFootnotePopover: "" }, [
        element("span", { dataFootnoteHead: "" }, [
          text(`Note ${label}`),
          element(
            "button",
            {
              type: "button",
              popovertarget: popoverId,
              popovertargetaction: "hide",
              ariaLabel: "Close note",
            },
            [text("×")],
          ),
        ]),
        element("span", { dataFootnoteBody: "" }, content),
      ]);
      parent.children[index] = element(
        "span",
        { dataFootnote: "", style: `--_anchor: --footnote-${label}` },
        [text(takeLastWord(parent.children[index - 1])), element("sup", {}, [trigger]), popover],
      );
    }
  };
}
