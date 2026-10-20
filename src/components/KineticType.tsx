import { Easing, interpolate, useCurrentFrame } from "remotion";
import type { CSSProperties } from "react";
import { fontFamily } from "../theme/fonts";
import { useReducedMotionFlag } from "../theme/motion";

type KineticTypeProps = {
  text: string;
  size: number;
  weight?: number;
  delay?: number;
  color?: string;
  lineHeight?: number;
  maxWidth?: number | string;
  family?: "display" | "ui";
  as?: "h1" | "h2" | "p";
  style?: CSSProperties;
};

/**
 * A single settle-in for a whole statement.
 * Word-by-word reveals are avoided so the full line is readable for the timed hold.
 */
export function KineticType({
  text,
  size,
  weight = 700,
  delay = 0,
  color,
  lineHeight = 1.08,
  maxWidth = "100%",
  family = "display",
  as: Tag = "p",
  style,
}: KineticTypeProps) {
  const frame = useCurrentFrame();
  const reduced = useReducedMotionFlag();
  const opacity = reduced
    ? 1
    : interpolate(frame, [delay, delay + 12], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
  const translateY = reduced
    ? 0
    : interpolate(frame, [delay, delay + 12], [28, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });

  return (
    <Tag
      className="m-0"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        color,
        fontFamily: family === "display" ? fontFamily.display : fontFamily.ui,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing: size >= 48 ? "-0.03em" : "-0.01em",
        maxWidth,
        ...style,
      }}
    >
      {text}
    </Tag>
  );
}
