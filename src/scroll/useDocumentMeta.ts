import { useEffect } from "react";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/** Per-page <title>/description/OpenGraph, restored to the previous values on unmount. */
export function useDocumentMeta(title: string, description?: string) {
  useEffect(() => {
    const prevTitle = document.title;
    const prevDescription = document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";

    document.title = title;
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:title", title);
      setMeta("property", "og:description", description);
      setMeta("property", "og:type", "article");
      setMeta("property", "og:url", window.location.href);
    }

    return () => {
      document.title = prevTitle;
      setMeta("name", "description", prevDescription);
    };
  }, [title, description]);
}
