import { fontFamily } from "../theme/fonts";
import { layout } from "../theme/brand";

export function Wordmark({ color }: { color: string }) {
  return (
    <p
      className="m-0"
      style={{
        color,
        fontFamily: fontFamily.display,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        marginBottom: 36,
      }}
    >
      William Joseph
    </p>
  );
}

export function Kicker({ text, color }: { text: string; color: string }) {
  return (
    <p
      className="m-0 uppercase-none"
      style={{
        color,
        fontFamily: fontFamily.ui,
        fontWeight: 600,
        fontSize: 28,
        letterSpacing: "0.01em",
        lineHeight: 1.3,
        marginBottom: 20,
        maxWidth: layout.contentMax,
      }}
    >
      {text}
    </p>
  );
}
