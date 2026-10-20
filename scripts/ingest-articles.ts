import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArticle } from "../src/lib/parse-article";

const articlesDir = path.join(process.cwd(), "content/articles");
const outputDir = path.join(process.cwd(), "src/data/generated");

const files = readdirSync(articlesDir)
  .filter((file) => file.endsWith(".md"))
  .sort();

if (files.length === 0) {
  throw new Error(`No markdown articles in ${articlesDir}`);
}

const scripts = files.map((file) => {
  const markdown = readFileSync(path.join(articlesDir, file), "utf8");
  return parseArticle(markdown, file);
});

mkdirSync(outputDir, { recursive: true });

for (const script of scripts) {
  writeFileSync(
    path.join(outputDir, `${script.id}.json`),
    `${JSON.stringify(script, null, 2)}\n`,
  );
}

writeFileSync(path.join(outputDir, "scripts.json"), `${JSON.stringify(scripts, null, 2)}\n`);

for (const script of scripts) {
  const seconds = (script.durationInFrames / 30).toFixed(1);
  console.log(`${script.compositionId}  ${seconds}s  ${script.beats.length} beats  ${script.pillar}`);
}

console.log(`Wrote ${scripts.length} scripts to ${outputDir}`);
