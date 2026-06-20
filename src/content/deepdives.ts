import raw from "../../content/deepdives.md?raw";

export interface DeepDiveLink {
  label: string;
  value: string;
}

export interface DeepDiveContent {
  slug: string;
  problem: string[];
  approach: string[];
  result: string[];
  media: string[];
  techPoints: string[];
  links: DeepDiveLink[];
}

function splitParagraphs(text: string): string[] {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function splitListItems(text: string): string[] {
  return text
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("- "))
    .map((l) => l.slice(2).trim());
}

function parseLinks(text: string): DeepDiveLink[] {
  return splitListItems(text).map((line) => {
    const idx = line.indexOf(":");
    return idx === -1
      ? { label: line, value: "" }
      : { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
  });
}

function parseBlock(block: string): DeepDiveContent {
  const lines = block.split("\n");
  const slug = lines[0].trim();
  const sections: Record<string, string> = {};
  let current = "";
  let buffer: string[] = [];

  for (const line of lines.slice(1)) {
    const heading = line.match(/^###\s+(.+)$/);
    if (heading) {
      if (current) sections[current] = buffer.join("\n");
      current = heading[1].trim();
      buffer = [];
    } else {
      buffer.push(line);
    }
  }
  if (current) sections[current] = buffer.join("\n");

  return {
    slug,
    problem: splitParagraphs(sections["Problème"] ?? ""),
    approach: splitParagraphs(sections["Approche"] ?? ""),
    result: splitParagraphs(sections["Résultat"] ?? ""),
    media: splitListItems(sections["Média"] ?? ""),
    techPoints: splitListItems(sections["Points techniques"] ?? ""),
    links: parseLinks(sections["Liens"] ?? ""),
  };
}

const blocks = raw.split(/^##\s+/m).slice(1);

export const deepDives: Record<string, DeepDiveContent> = Object.fromEntries(
  blocks.map((block) => {
    const content = parseBlock(block);
    return [content.slug, content];
  }),
);
