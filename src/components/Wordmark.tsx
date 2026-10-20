import { Img, staticFile } from "remotion";
import { layout } from "../theme/brand";
import { relativeLuminance } from "../theme/contrast";
import { fontFamily } from "../theme/fonts";

/**
 * The drawn wordmark, not a typeset name.
 * Light lockup on dark canvases, ink lockup on light ones.
 * Both files are the supplied logo with the black plate removed.
 */
export function Wordmark({ background }: { background: string }) {
  const onDark = relativeLuminance(background) < 0.4;
  return (
    <Img
      src={staticFile(onDark ? "brand/logo-light.png" : "brand/logo-ink.png")}
      alt="William Joseph"
      style={{
        height: 46,
        width: "auto",
        maxWidth: 460,
        objectFit: "contain",
        objectPosition: "left center",
        marginBottom: 28,
        alignSelf: "flex-start",
      }}
    />
  );
}

export function Kicker({ text, color }: { text: string; color: string }) {
  return (
    <p
      className="m-0"
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
