import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import { enableTailwind } from "@remotion/tailwind";
import type { VideoScript } from "../src/lib/types";
import { layout } from "../src/theme/brand";

type FormatName = "square" | "portrait";

const args = process.argv.slice(2);

function option(name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  return args[index + 1];
}

const only = option("--only");
const formatOption = option("--format") ?? "all";
const smoke = args.includes("--smoke");
const reducedMotion = args.includes("--reduced-motion");

if (!["all", "square", "portrait"].includes(formatOption)) {
  throw new Error('--format must be "square", "portrait" or "all".');
}

const formats: FormatName[] =
  formatOption === "all" ? ["square", "portrait"] : [formatOption as FormatName];

const scripts = JSON.parse(
  readFileSync(path.join(process.cwd(), "src/data/generated/scripts.json"), "utf8"),
) as VideoScript[];

const selected = scripts.filter((script) => {
  if (!only) return true;
  return script.id === only || script.compositionId === only;
});

if (selected.length === 0) {
  throw new Error(`No script matched --only ${only ?? ""}.`);
}

function timestamp(frame: number): string {
  const totalMs = Math.round((frame / layout.fps) * 1000);
  const ms = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  const pad = (value: number, length = 2) => String(value).padStart(length, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms, 3)}`;
}

function writeCaptions(script: VideoScript, filePath: string): void {
  let frame = 0;
  const cues = script.beats.map((beat, index) => {
    const start = timestamp(frame);
    frame += beat.durationInFrames;
    const end = timestamp(frame);
    return `${index + 1}\n${start} --> ${end}\n${beat.caption}\n`;
  });
  writeFileSync(filePath, `WEBVTT\n\n${cues.join("\n")}`);
}

async function main(): Promise<void> {
  const outputDir = path.join(process.cwd(), "out");
  mkdirSync(outputDir, { recursive: true });

  const serveUrl = await bundle({
    entryPoint: path.join(process.cwd(), "src/index.ts"),
    webpackOverride: enableTailwind,
  });

  for (const script of selected) {
    for (const format of formats) {
      const suffix = format === "square" ? "Square" : "Portrait";
      const compositionId = `${script.compositionId}${suffix}`;
      const inputProps = { script, reducedMotion };
      const composition = await selectComposition({
        serveUrl,
        id: compositionId,
        inputProps,
      });
      const motion = reducedMotion ? "-reduced" : "";
      const smokeLabel = smoke ? "-smoke" : "";
      const base = path.join(outputDir, `${script.id}-${format}${motion}${smokeLabel}`);
      const outputLocation = `${base}.mp4`;

      console.log(`Rendering ${compositionId} -> ${outputLocation}`);
      await renderMedia({
        composition,
        serveUrl,
        codec: "h264",
        outputLocation,
        inputProps,
        ...(smoke ? { frameRange: [0, 45] as [number, number] } : {}),
      });

      if (!smoke) {
        writeCaptions(script, `${base}.vtt`);
      }
    }
  }

  console.log("Render complete.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
