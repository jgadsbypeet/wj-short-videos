import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { VideoScript } from "../src/lib/types";
import { framesToSeconds } from "../src/lib/timing";
import { palette } from "../src/theme/brand";
import { fontFamily } from "../src/theme/fonts";
import { articles, type PreviewArticle } from "./articles";
import { FilmPlayer } from "./FilmPlayer";
import { parsePreview } from "./parse-preview";

type FormatName = "square" | "portrait";

const pillars = [
  { id: "practical-advice", label: "Practical advice" },
  { id: "data-insight", label: "Data and insight" },
  { id: "case-study", label: "Case study" },
] as const;

export function App() {
  const catalogue = useMemo(
    () =>
      articles.map((article) => ({
        article,
        script: parsePreview(article.markdown, article.filename),
      })),
    [],
  );

  const [selectedId, setSelectedId] = useState(() => idFromHash(catalogue));
  const [format, setFormat] = useState<FormatName>("portrait");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(articles.map((article) => [article.id, article.markdown])),
  );

  const selected = catalogue.find((item) => item.article.id === selectedId) ?? catalogue[0];
  const draft = drafts[selected.article.id] ?? selected.article.markdown;
  const parsed = readDraft(draft, selected.article.filename, selected.script);
  const dirty = draft !== selected.article.markdown;

  useEffect(() => {
    const onHash = () => {
      const next = idFromHash(catalogue);
      setSelectedId(next);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [catalogue]);

  function choose(id: string) {
    setSelectedId(id);
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <div style={{ fontFamily: fontFamily.ui }}>
      <header style={{ background: palette.teal, color: palette.cream }}>
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-5">
          <img src="/brand/logo-light.png" alt="William Joseph" style={{ height: 32, width: "auto" }} />
          <p className="m-0" style={{ fontWeight: 600, fontSize: 16, whiteSpace: "nowrap" }}>
            Short-form films
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1
          className="m-0"
          style={{
            fontFamily: fontFamily.display,
            fontWeight: 700,
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.05,
            maxWidth: 760,
          }}
        >
          Six films, each one a file
        </h1>
        <p className="m-0 mt-5" style={{ fontSize: 20, lineHeight: 1.45, maxWidth: 720 }}>
          The player is the film. The column beside it is the file that makes it. Change a line and the
          picture follows. This page is what Netlify publishes from GitHub. The MP4 for LinkedIn is the
          same film, written by one command.
        </p>

        <div className="mt-10 flex flex-col gap-8 lg:grid lg:grid-cols-[220px_minmax(0,1fr)_minmax(280px,380px)] lg:items-start">
          <nav aria-label="Films">
            {pillars.map((pillar) => (
              <div key={pillar.id} className="mb-6">
                <h2 className="m-0" style={{ fontSize: 14, fontWeight: 600, color: palette.teal }}>
                  {pillar.label}
                </h2>
                <ul className="m-0 mt-2 list-none p-0">
                  {catalogue
                    .filter((item) => item.script.pillar === pillar.id)
                    .map((item) => {
                      const current = item.article.id === selected.article.id;
                      const title = item.script.beats[0]?.type === "title" ? item.script.beats[0].heading : item.article.id;
                      return (
                        <li key={item.article.id} className="mt-2">
                          <button
                            type="button"
                            aria-current={current ? "page" : undefined}
                            onClick={() => choose(item.article.id)}
                            className="w-full text-left"
                            style={{
                              padding: "10px 12px",
                              border: `2px solid ${palette.ink}`,
                              background: current ? palette.ink : palette.cream,
                              color: current ? palette.white : palette.ink,
                              fontFamily: fontFamily.ui,
                              fontSize: 15,
                              lineHeight: 1.3,
                              cursor: "pointer",
                            }}
                          >
                            {title}
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            ))}
          </nav>

          <section aria-label={parsed.script.sourceTitle}>
            <div className="flex flex-wrap items-center gap-2">
              <Toggle
                pressed={format === "portrait"}
                onClick={() => setFormat("portrait")}
                label="Portrait, 1080 by 1350"
              />
              <Toggle
                pressed={format === "square"}
                onClick={() => setFormat("square")}
                label="Square, 1080 by 1080"
              />
              <Toggle
                pressed={reducedMotion}
                onClick={() => setReducedMotion((value) => !value)}
                label="Reduced motion"
              />
            </div>
            <p className="m-0 mt-3" style={{ fontSize: 15, color: palette.charcoal }}>
              {parsed.script.beats.length} beats · {framesToSeconds(parsed.script.durationInFrames).toFixed(1)}{" "}
              seconds · captions are in the film
            </p>
            <div className="mt-4">
              <FilmPlayer script={parsed.script} format={format} reducedMotion={reducedMotion} />
            </div>
          </section>

          <SourcePanel
            article={selected.article}
            draft={draft}
            dirty={dirty}
            error={parsed.error}
            script={parsed.script}
            onChange={(value) =>
              setDrafts((current) => ({ ...current, [selected.article.id]: value }))
            }
            onRestore={() =>
              setDrafts((current) => ({
                ...current,
                [selected.article.id]: selected.article.markdown,
              }))
            }
          />
        </div>

        <Pipeline />
      </main>
    </div>
  );
}

function SourcePanel({
  article,
  draft,
  dirty,
  error,
  script,
  onChange,
  onRestore,
}: {
  article: PreviewArticle;
  draft: string;
  dirty: boolean;
  error: string | null;
  script: VideoScript;
  onChange: (value: string) => void;
  onRestore: () => void;
}) {
  return (
    <section aria-label="Source file">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="m-0" style={{ fontSize: 16, fontWeight: 600 }}>
          content/articles/{article.filename}
        </h2>
        {dirty ? (
          <button type="button" onClick={onRestore} style={textButton}>
            Restore the file
          </button>
        ) : null}
      </div>
      <p className="m-0 mt-2" style={{ fontSize: 15, lineHeight: 1.4 }}>
        {dirty
          ? "This edit is a preview in the browser. It is not saved. Commit the file on GitHub to publish it."
          : "This is the file in the repository. Edit it here to see the film change."}
      </p>
      <label className="mt-3 block" htmlFor="source-file" style={{ fontSize: 14, fontWeight: 600 }}>
        Markdown
      </label>
      <textarea
        id="source-file"
        value={draft}
        onChange={(event) => onChange(event.target.value)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        className="mt-2 w-full"
        style={{
          minHeight: 420,
          padding: 14,
          border: `2px solid ${error ? palette.magenta : palette.ink}`,
          background: palette.white,
          color: palette.ink,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
          fontSize: 13,
          lineHeight: 1.45,
        }}
      />
      {error ? (
        <p role="alert" className="m-0 mt-2" style={{ fontSize: 15, lineHeight: 1.4, color: palette.ink }}>
          {error} The player is still showing the last version that passed.
        </p>
      ) : null}

      <h3 className="m-0 mt-6" style={{ fontFamily: fontFamily.display, fontSize: 22, fontWeight: 700 }}>
        Published with the film
      </h3>
      <Field label="Post" text={script.post} />
      <Field label="Alt text" text={script.alt} />
      <p className="m-0 mt-4" style={{ fontSize: 15, lineHeight: 1.45 }}>
        Source:{" "}
        <a href={script.sourceUrl} style={{ color: palette.teal, fontWeight: 600 }}>
          {script.sourceTitle}
        </a>
      </p>
    </section>
  );
}

function Field({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-3" style={{ background: palette.white, border: `2px solid ${palette.ink}`, padding: 12 }}>
      <p className="m-0" style={{ fontSize: 13, fontWeight: 600, color: palette.teal }}>
        {label}
      </p>
      <p className="m-0 mt-1" style={{ fontSize: 15, lineHeight: 1.4 }}>
        {text}
      </p>
    </div>
  );
}

function Toggle({
  pressed,
  onClick,
  label,
}: {
  pressed: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      style={{
        padding: "8px 12px",
        border: `2px solid ${palette.ink}`,
        background: pressed ? palette.ink : palette.cream,
        color: pressed ? palette.white : palette.ink,
        fontFamily: fontFamily.ui,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function Pipeline() {
  const steps = [
    {
      title: "The script",
      body: "content/articles holds one markdown file per film. A title, a number, a quote or a picture is a section in that file.",
    },
    {
      title: "The rules",
      body: "src/lib/editorial.ts and src/lib/timing.ts refuse a heading in title case, an ampersand, or a film outside 30 to 60 seconds. Each line stays up for at least 3 seconds.",
    },
    {
      title: "The brand",
      body: "src/theme/brand.ts is taken from williamjoseph.co.uk. A text colour that misses WCAG 2.2 AA, 4.5:1, does not compile.",
    },
    {
      title: "The files you publish",
      body: "npm run render-videos writes a square MP4, a portrait MP4 and a caption file. This page plays the same composition, without waiting for that render.",
    },
  ];

  return (
    <section className="mt-16" aria-label="How a film is made">
      <h2
        className="m-0"
        style={{ fontFamily: fontFamily.display, fontWeight: 700, fontSize: 36, lineHeight: 1.1 }}
      >
        How a film is made
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <article
            key={step.title}
            style={{ background: palette.white, border: `2px solid ${palette.ink}`, padding: 18 }}
          >
            <p className="m-0" style={{ fontWeight: 600, color: palette.teal, fontSize: 14 }}>
              {index + 1}
            </p>
            <h3
              className="m-0 mt-2"
              style={{ fontFamily: fontFamily.display, fontWeight: 700, fontSize: 24 }}
            >
              {step.title}
            </h3>
            <p className="m-0 mt-2" style={{ fontSize: 16, lineHeight: 1.45 }}>
              {step.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3" aria-label="Site colours">
        {(
          [
            ["Ink", palette.ink],
            ["Cream", palette.cream],
            ["Teal", palette.teal],
            ["Yellow", palette.yellow],
            ["Aqua", palette.aqua],
            ["Mist", palette.mist],
          ] as const
        ).map(([name, colour]) => (
          <div key={name} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              style={{
                width: 28,
                height: 28,
                background: colour,
                border: `2px solid ${palette.ink}`,
                display: "inline-block",
              }}
            />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{name}</span>
          </div>
        ))}
      </div>

      <div className="mt-8" style={{ background: palette.teal, color: palette.cream, padding: 22 }}>
        <h2
          className="m-0"
          style={{ fontFamily: fontFamily.display, fontWeight: 700, fontSize: 28, color: palette.cream }}
        >
          GitHub to Netlify
        </h2>
        <p className="m-0 mt-3" style={{ fontSize: 17, lineHeight: 1.45, maxWidth: 720, color: palette.cream }}>
          In Netlify, add a site from this repository. The build command and the publish directory are
          already in netlify.toml. A push runs the editorial checks, then publishes this page. Render the
          LinkedIn files locally, or in a separate job, with npm run render-videos.
        </p>
        <p className="m-0 mt-4" style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace", fontSize: 15 }}>
          npm run check && npm run build
          <br />
          dist
        </p>
      </div>
    </section>
  );
}

const textButton: CSSProperties = {
  background: "transparent",
  color: palette.teal,
  border: "none",
  padding: 0,
  fontFamily: fontFamily.ui,
  fontWeight: 600,
  fontSize: 15,
  cursor: "pointer",
  textDecoration: "underline",
};

const lastGood = new Map<string, VideoScript>();

function readDraft(
  markdown: string,
  filename: string,
  fallback: VideoScript,
): { script: VideoScript; error: string | null } {
  try {
    const script = parsePreview(markdown, filename);
    lastGood.set(fallback.id, script);
    return { script, error: null };
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : "Could not read that file.";
    return { script: lastGood.get(fallback.id) ?? fallback, error: message };
  }
}

function idFromHash(catalogue: { article: PreviewArticle }[]): string {
  const id = window.location.hash.replace(/^#/, "");
  if (catalogue.some((item) => item.article.id === id)) return id;
  return catalogue[0]?.article.id ?? "seven-barriers";
}
