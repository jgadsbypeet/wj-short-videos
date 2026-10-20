import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import { InsightVideo } from "../src/compositions/InsightVideo";
import type { VideoScript } from "../src/lib/types";
import { framesToSeconds } from "../src/lib/timing";
import { layout, palette } from "../src/theme/brand";
import { fontFamily } from "../src/theme/fonts";
import { beatTitle, clock } from "./beats";

type FormatName = "square" | "portrait";

export function FilmPlayer({
  script,
  format,
  reducedMotion,
}: {
  script: VideoScript;
  format: FormatName;
  reducedMotion: boolean;
}) {
  const playerRef = useRef<PlayerRef>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const size = format === "square" ? layout.square : layout.portrait;

  const starts = useMemo(() => {
    let cursor = 0;
    return script.beats.map((beat) => {
      const start = cursor;
      cursor += beat.durationInFrames;
      return start;
    });
  }, [script]);

  let activeIndex = 0;
  starts.forEach((start, index) => {
    if (start <= frame) activeIndex = index;
  });

  useEffect(() => {
    setFrame(0);
    setPlaying(false);
  }, [script.id, format]);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    const onFrame = (event: { detail: { frame: number } }) => setFrame(event.detail.frame);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    player.addEventListener("frameupdate", onFrame);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    player.addEventListener("ended", onPause);
    return () => {
      player.removeEventListener("frameupdate", onFrame);
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
      player.removeEventListener("ended", onPause);
    };
  }, [script.id, format, script.durationInFrames]);

  const atEnd = frame >= script.durationInFrames - 1;
  const displayWidth = format === "portrait" ? 360 : 440;

  return (
    <div>
      <div style={{ width: displayWidth, maxWidth: "100%", margin: "0 auto" }}>
        <div style={{ background: palette.ink }}>
        <Player
          ref={playerRef}
          key={`${script.id}-${format}`}
          component={InsightVideo}
          inputProps={{ script, reducedMotion }}
          durationInFrames={script.durationInFrames}
          compositionWidth={size.width}
          compositionHeight={size.height}
          fps={layout.fps}
          acknowledgeRemotionLicense
          controls={false}
          clickToPlay
          spaceKeyToPlayOrPause
          initiallyMuted
          showVolumeControls={false}
          style={{ width: "100%" }}
        />
        </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={() => {
            const player = playerRef.current;
            if (!player) return;
            if (atEnd) player.seekTo(0);
            player.toggle();
          }}
          style={primaryButton}
        >
          {playing ? "Pause" : atEnd ? "Replay" : "Play"}
        </button>
        <p className="m-0" style={metaStyle}>
          {clock(frame)} / {clock(script.durationInFrames)}
        </p>
      </div>
      <input
        className="mt-3 block w-full"
        type="range"
        min={0}
        max={Math.max(0, script.durationInFrames - 1)}
        value={Math.min(frame, Math.max(0, script.durationInFrames - 1))}
        aria-label="Film position"
        style={{ accentColor: palette.teal }}
        onChange={(event) => {
          const next = Number(event.target.value);
          playerRef.current?.seekTo(next);
          setFrame(next);
        }}
      />
      </div>

      <ol className="m-0 mt-4 list-none p-0" aria-label="Beats in this film">
        {script.beats.map((beat, index) => {
          const current = index === activeIndex;
          return (
            <li key={`${beat.type}-${index}`}>
              <button
                type="button"
                aria-current={current ? "true" : undefined}
                onClick={() => {
                  const start = starts[index] ?? 0;
                  playerRef.current?.seekTo(start);
                  setFrame(start);
                }}
                className="flex w-full items-baseline gap-3 text-left"
                style={{
                  marginTop: index === 0 ? 0 : 6,
                  padding: "8px 10px",
                  border: `2px solid ${palette.ink}`,
                  background: current ? palette.ink : palette.white,
                  color: current ? palette.white : palette.ink,
                  fontFamily: fontFamily.ui,
                  fontSize: 15,
                  lineHeight: 1.3,
                }}
              >
                <span style={{ fontWeight: 600, width: 22, flex: "none" }}>{index + 1}</span>
                <span className="flex-1">{beatTitle(beat)}</span>
                <span style={{ flex: "none", fontVariantNumeric: "tabular-nums" }}>
                  {framesToSeconds(beat.durationInFrames).toFixed(1)}s
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const primaryButton: CSSProperties = {
  background: palette.teal,
  color: palette.white,
  border: `2px solid ${palette.teal}`,
  fontFamily: fontFamily.ui,
  fontWeight: 600,
  fontSize: 16,
  lineHeight: 1,
  padding: "12px 18px",
  cursor: "pointer",
};

const metaStyle: CSSProperties = {
  fontFamily: fontFamily.ui,
  fontWeight: 500,
  fontSize: 16,
  fontVariantNumeric: "tabular-nums",
};
