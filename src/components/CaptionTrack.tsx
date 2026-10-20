import { fontFamily } from "../theme/fonts";
import { layout, palette } from "../theme/brand";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { useReducedMotionFlag } from "../theme/motion";

/**
 * Burned-in captions for silent autoplay. The bar is always ink with white type,
 * matching the site footer, so contrast does not change between beats.
 */
export function CaptionTrack({ text }: { text: string }) {
  const frame = useCurrentFrame();
  const reduced = useReducedMotionFlag();
  const opacity = reduced
    ? 1
    : interpolate(frame, [0, 8], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });

  return (
    <div
      className="absolute inset-x-0 bottom-0 z-20 flex items-center"
      style={{
        height: layout.captionHeight,
        backgroundColor: palette.ink,
        color: palette.white,
        padding: `0 ${layout.safeX}px`,
        opacity,
      }}
    >
      <p
        className="m-0"
        style={{
          fontFamily: fontFamily.ui,
          fontWeight: 500,
          fontSize: 32,
          lineHeight: 1.35,
          maxWidth: layout.contentMax,
        }}
      >
        {text}
      </p>
    </div>
  );
}
