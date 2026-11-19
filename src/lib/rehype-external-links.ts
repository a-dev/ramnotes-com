import type { Root, RootContent } from "hast";

/** Inline HTML from Markdown. `hast` itself does not declare this node. */
type Raw = { type: "raw"; value: string };
type Node = Root | RootContent | Raw;

const isExternal = (href: string, host: string) =>
  /^https?:\/\//.test(href) && new URL(href).host !== host;

/**
 * Opens links to other sites in a new tab. Markdown links arrive as elements. Links inside an
 * inline HTML block arrive as raw text, so their opening tags get the same attributes.
 */
export function rehypeExternalLinks({ siteUrl }: { siteUrl: string }) {
  const { host } = new URL(siteUrl);
  const visit = (node: Node) => {
    if (node.type === "raw") {
      node.value = node.value.replaceAll(
        /<a\b(?![^>]*\btarget=)([^>]*\bhref="([^"]+)"[^>]*)>/g,
        (tag: string, attributes: string, href: string) =>
          isExternal(href, host) ? `<a${attributes} target="_blank" rel="noopener">` : tag,
      );
      return;
    }
    if (node.type === "element" && node.tagName === "a") {
      if (isExternal(String(node.properties.href ?? ""), host)) {
        node.properties.target = "_blank";
        node.properties.rel = ["noopener"];
      }
    }
    if ("children" in node) (node.children as Node[]).forEach(visit);
  };
  return visit;
}
