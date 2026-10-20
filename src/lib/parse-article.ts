import { existsSync } from "node:fs";
import path from "node:path";
import { getPair, type PairName } from "../theme/brand";
import { assertEditorial } from "./editorial";
import {
  ENTRANCE_FRAMES,
  framesToSeconds,
  MAX_VIDEO_SECONDS,
  MIN_VIDEO_SECONDS,
  readingFrames,
} from "./timing";
import type { Beat, BeatDraft, Pillar, VideoScript } from "./types";

type RawSection = {
  type: string;
  fields: Record<string, string>;
};

const PILLARS = new Set<Pillar>(["practical-advice", "data-insight", "case-study"]);

function parseFrontmatter(markdown: string): { data: Record<string, string>; body: string } {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Article is missing frontmatter.");
  }
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const index = line.indexOf(":");
    if (index === -1) {
      throw new Error(`Frontmatter line has no colon: ${line}`);
    }
    data[line.slice(0, index).trim()] = line.slice(index + 1).trim();
  }
  return { data, body: match[2].trim() };
}

function parseSections(body: string): RawSection[] {
  const chunks = body.split(/^## /m).filter((chunk) => chunk.trim().length > 0);
  return chunks.map((chunk) => {
    const [first, ...rest] = chunk.split(/\r?\n/);
    const fields: Record<string, string> = {};
    for (const line of rest) {
      if (!line.trim()) continue;
      const index = line.indexOf(":");
      if (index === -1) {
        throw new Error(`Field is missing a colon under “${first.trim()}”: ${line}`);
      }
      const key = line.slice(0, index).trim();
      const value = line.slice(index + 1).trim();
      if (fields[key]) {
        throw new Error(`Duplicate field “${key}” under “${first.trim()}”.`);
      }
      fields[key] = value;
    }
    return { type: first.trim(), fields };
  });
}

function requireField(section: RawSection, key: string, context: string): string {
  const value = section.fields[key];
  if (!value) {
    throw new Error(`${context}: missing “${key}”.`);
  }
  return value;
}

function splitItems(value: string): string[] {
  return value
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function onScreenText(beat: BeatDraft): string[] {
  switch (beat.type) {
    case "title":
      return [beat.kicker, beat.heading];
    case "statement":
      return [beat.heading, beat.body];
    case "quote":
      return [beat.quote, beat.attribution];
    case "data":
      return [beat.value, beat.label, beat.source];
    case "venn":
      return [beat.heading, beat.left, beat.right, beat.bottom, beat.centre];
    case "point":
      return [`${beat.index} of ${beat.total}`, beat.heading, beat.body];
    case "device":
    case "list":
      return [beat.heading, ...beat.items];
    case "picture":
      return [beat.heading];
    case "close":
      return [beat.heading, beat.url];
    default: {
      const neverBeat: never = beat;
      return neverBeat;
    }
  }
}

function lintBeat(beat: BeatDraft, context: string): void {
  const check = (text: string, role: "heading" | "kicker" | "body" | "caption" | "item" | "source", label: string) => {
    assertEditorial(text, role, `${context} ${label}`);
  };
  check(beat.caption, "caption", "caption");
  switch (beat.type) {
    case "title":
      check(beat.kicker, "kicker", "kicker");
      check(beat.heading, "heading", "heading");
      break;
    case "statement":
      check(beat.heading, "heading", "heading");
      check(beat.body, "body", "body");
      break;
    case "quote":
      check(beat.quote, "heading", "quote");
      check(beat.attribution, "kicker", "attribution");
      break;
    case "data":
      check(beat.value, "body", "value");
      check(beat.label, "body", "label");
      check(beat.source, "source", "source");
      break;
    case "venn":
      check(beat.heading, "heading", "heading");
      check(beat.left, "item", "left");
      check(beat.right, "item", "right");
      check(beat.bottom, "item", "bottom");
      check(beat.centre, "item", "centre");
      break;
    case "point":
      check(beat.heading, "heading", "heading");
      check(beat.body, "body", "body");
      break;
    case "device":
    case "list":
      check(beat.heading, "heading", "heading");
      beat.items.forEach((item, index) => check(item, "item", `item ${index + 1}`));
      break;
    case "picture":
      check(beat.heading, "heading", "heading");
      check(beat.alt, "body", "alt");
      break;
    case "close":
      check(beat.heading, "heading", "heading");
      check(beat.url, "body", "url");
      break;
    default: {
      const neverBeat: never = beat;
      throw new Error(String(neverBeat));
    }
  }
}

function withDuration(beat: BeatDraft, minSeconds?: number): Beat {
  const readable = readingFrames(onScreenText(beat), beat.caption, minSeconds);
  return { ...beat, durationInFrames: readable + ENTRANCE_FRAMES } as Beat;
}

export function parseArticle(markdown: string, filename = "article"): VideoScript {
  const { data, body } = parseFrontmatter(markdown);
  const need = (key: string) => {
    const value = data[key];
    if (!value) throw new Error(`${filename}: frontmatter is missing “${key}”.`);
    return value;
  };

  const pillar = need("pillar");
  if (!PILLARS.has(pillar as Pillar)) {
    throw new Error(`${filename}: unknown pillar “${pillar}”.`);
  }

  const sections = parseSections(body);
  const meta = sections.find((section) => section.type === "meta");
  if (!meta) throw new Error(`${filename}: missing a meta section.`);

  const post = requireField(meta, "post", `${filename} meta`);
  const alt = requireField(meta, "alt", `${filename} meta`);
  assertEditorial(post, "body", `${filename} post`);
  assertEditorial(alt, "body", `${filename} alt`);
  assertEditorial(need("pillarLabel"), "kicker", `${filename} pillarLabel`);
  assertEditorial(need("author"), "body", `${filename} author`);

  const beats: Beat[] = [];
  sections.forEach((section, index) => {
    if (section.type === "meta") return;
    const context = `${filename} beat ${index + 1} (${section.type})`;
    const pair = requireField(section, "pair", context) as PairName;
    getPair(pair);
    const caption = requireField(section, "caption", context);
    const minSeconds = section.fields.minSeconds
      ? Number(section.fields.minSeconds)
      : undefined;
    if (minSeconds !== undefined && (Number.isNaN(minSeconds) || minSeconds < 3)) {
      throw new Error(`${context}: minSeconds must be a number of at least 3.`);
    }

    let draft: BeatDraft;
    switch (section.type) {
      case "title":
        draft = {
          type: "title",
          pair,
          kicker: requireField(section, "kicker", context),
          heading: requireField(section, "heading", context),
          caption,
        };
        break;
      case "statement":
        draft = {
          type: "statement",
          pair,
          heading: requireField(section, "heading", context),
          body: requireField(section, "body", context),
          caption,
        };
        break;
      case "quote":
        draft = {
          type: "quote",
          pair,
          quote: requireField(section, "quote", context),
          attribution: requireField(section, "attribution", context),
          caption,
        };
        break;
      case "data":
        draft = {
          type: "data",
          pair,
          value: requireField(section, "value", context),
          label: requireField(section, "label", context),
          source: requireField(section, "source", context),
          caption,
        };
        break;
      case "venn":
        draft = {
          type: "venn",
          pair,
          heading: requireField(section, "heading", context),
          left: requireField(section, "left", context),
          right: requireField(section, "right", context),
          bottom: requireField(section, "bottom", context),
          centre: requireField(section, "centre", context),
          caption,
        };
        break;
      case "point":
        draft = {
          type: "point",
          pair,
          index: Number(requireField(section, "index", context)),
          total: Number(requireField(section, "total", context)),
          heading: requireField(section, "heading", context),
          body: requireField(section, "body", context),
          caption,
        };
        break;
      case "device":
        draft = {
          type: "device",
          pair,
          heading: requireField(section, "heading", context),
          items: splitItems(requireField(section, "items", context)),
          caption,
        };
        break;
      case "list":
        draft = {
          type: "list",
          pair,
          heading: requireField(section, "heading", context),
          items: splitItems(requireField(section, "items", context)),
          caption,
        };
        break;
      case "picture": {
        const image = requireField(section, "image", context);
        if (image.includes("..") || image.startsWith("/") || image.includes("\\")) {
          throw new Error(`${context}: image must be a path inside public/.`);
        }
        const imagePath = path.join(process.cwd(), "public", image);
        if (!existsSync(imagePath)) {
          throw new Error(`${context}: no file at public/${image}.`);
        }
        draft = {
          type: "picture",
          pair,
          heading: requireField(section, "heading", context),
          image,
          alt: requireField(section, "alt", context),
          caption,
        };
        break;
      }
      case "close":
        draft = {
          type: "close",
          pair,
          heading: requireField(section, "heading", context),
          url: requireField(section, "url", context),
          caption,
        };
        break;
      default:
        throw new Error(`${filename}: unknown beat type “${section.type}”.`);
    }

    lintBeat(draft, context);
    if (caption.length > 140) {
      throw new Error(`${context}: caption is ${caption.length} characters. Keep it under 140 so it stays within two lines.`);
    }
    beats.push(withDuration(draft, minSeconds));
  });

  if (beats.length < 4) {
    throw new Error(`${filename}: a video needs at least 4 beats.`);
  }
  if (beats[0]?.type !== "title" || beats[beats.length - 1]?.type !== "close") {
    throw new Error(`${filename}: start with a title beat and end with a close beat.`);
  }

  const durationInFrames = beats.reduce((sum, beat) => sum + beat.durationInFrames, 0);
  const seconds = framesToSeconds(durationInFrames);
  if (seconds < MIN_VIDEO_SECONDS || seconds > MAX_VIDEO_SECONDS) {
    throw new Error(
      `${filename}: ${seconds.toFixed(1)}s is outside the ${MIN_VIDEO_SECONDS}–${MAX_VIDEO_SECONDS}s brief.`,
    );
  }

  return {
    id: need("id"),
    compositionId: need("compositionId"),
    pillar: pillar as Pillar,
    pillarLabel: need("pillarLabel"),
    sourceUrl: need("sourceUrl"),
    sourceTitle: need("sourceTitle"),
    author: need("author"),
    post,
    alt,
    beats,
    durationInFrames,
  };
}
