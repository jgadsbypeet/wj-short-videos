# William Joseph short-form video engine

Motion-graphics films for LinkedIn, with the same cuts used on Instagram and Bluesky. Advice and data films are type and diagrams. Case-study films can include one still from the published project page, shown whole. The live site at [williamjoseph.co.uk](https://williamjoseph.co.uk) is the visual source of truth. The corner lockup is the drawn wordmark.

## Run

```bash
npm install
npm run check          # ingest, editorial and contrast tests, typecheck
npm run dev            # Remotion studio
npm run render-videos  # batch MP4s plus WebVTT captions
```

Render flags:

```bash
npm run render-videos -- --only seven-barriers
npm run render-videos -- --format portrait
npm run render-videos -- --reduced-motion
npm run render-videos -- --only booktrust --format square --smoke
```

`--smoke` renders the opening 1.5 seconds, for a pipeline check. A full render writes `out/<id>-<format>.mp4` and a matching `.vtt`.

An MP4 cannot follow a viewer’s operating system setting. The studio preview does: it reads `prefers-reduced-motion`. Ship the alternate cut with `--reduced-motion` when a channel asks for one. That cut keeps every word on screen and drops the entrance travel.

## What the engine enforces

- Sentence case headings, no ampersands, “while” rather than “whilst”, and “William Joseph” written in full.
- Text colours only from pairs that pass WCAG 2.2 AA at 4.5:1. The check runs when the brand module loads and again in `npm test`.
- Each statement stays up long enough to read at 150 words per minute, and never less than 3 seconds once the type has settled.
- Burned-in captions on every beat, plus a WebVTT file for players that can use one.
- Square corners on devices and buttons, matching the site. Figtree for statements, IBM Plex Sans for captions and labels.

Scripts are markdown in `content/articles`. `npm run ingest` turns them into `src/data/generated/scripts.json`, which the compositions read. Edit the markdown, not the JSON.

The campaign plan, the six scripts and the Trello path are in [STRATEGY.md](STRATEGY.md).

## Show someone the films

`npm run site` plays all six films in the browser, next to the markdown that drives each one. Portrait and square are the same composition. A change in the file updates the picture, the post and the alt text. The rules still apply: a broken edit is refused, and the player keeps the last version that passed.

Netlify publishes that page from GitHub. `netlify.toml` already sets the build.

1. In Netlify, add a site from this repository.
2. Leave the build command as `npm run check && npm run build` and the publish directory as `dist`.
3. Node 22 is set in `netlify.toml`.

A push runs the editorial checks, then updates the preview. The MP4s for LinkedIn are not part of that build. Render them with `npm run render-videos` when a film is ready to publish. The preview and the file are the same composition.

A new case-study still also needs its path added to `site/parse-preview.ts`, so the preview can confirm the file exists.
