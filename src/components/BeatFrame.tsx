import type { ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { decorativeAccent, layout, type LockedPair } from "../theme/brand";
import { AccentRule } from "./AccentRule";

export function BeatFrame({
  pair,
  children,
}: {
  pair: LockedPair;
  children: ReactNode;
}) {
  return (
    <AbsoluteFill style={{ backgroundColor: pair.bg, color: pair.fg, overflow: "hidden" }}>
      <AccentRule color={decorativeAccent(pair.bg)} />
      <div
        className="absolute inset-x-0 top-0 z-10 flex flex-col"
        style={{
          padding: `${layout.safeTop}px ${layout.safeX}px ${layout.captionHeight + 36}px`,
          height: "100%",
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
}
