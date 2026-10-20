import { Easing, interpolate, useCurrentFrame } from "remotion";
import { layout } from "../theme/brand";
import { useReducedMotionFlag } from "../theme/motion";

/** A flat colour rule, echoing the short rule above article previews on the site. */
export function AccentRule({ color }: { color: string }) {
  const frame = useCurrentFrame();
  const reduced = useReducedMotionFlag();
  const scale = reduced
    ? 1
    : interpolate(frame, [0, 16], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });

  return (
    <div
      aria-hidden="true"
      className="absolute left-0 z-0"
      style={{
        bottom: layout.captionHeight,
        height: 16,
        width: "100%",
        transform: `scaleX(${scale})`,
        transformOrigin: "left center",
        backgroundColor: color,
      }}
    />
  );
}
