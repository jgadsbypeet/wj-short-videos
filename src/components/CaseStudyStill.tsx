import { Img, staticFile, useVideoConfig } from "remotion";
import { layout, palette } from "../theme/brand";
import { KineticType } from "./KineticType";

/**
 * A published case-study image, shown whole inside the square device.
 * The frame hugs the picture, and object-fit stays contain, so the
 * shot never crops in on a person.
 */
export function CaseStudyStill({
  heading,
  image,
  alt,
  color,
}: {
  heading: string;
  image: string;
  alt: string;
  color: string;
}) {
  const { height } = useVideoConfig();
  const reserved = layout.safeTop + layout.captionHeight + 280;
  const maxImageHeight = Math.min(680, height - reserved);

  return (
    <div className="flex flex-1 flex-col justify-center" style={{ maxWidth: 920, minHeight: 0 }}>
      <KineticType as="h1" text={heading} size={46} color={color} lineHeight={1.08} />
      <div
        style={{
          marginTop: 24,
          alignSelf: "flex-start",
          border: `8px solid ${palette.ink}`,
          backgroundColor: palette.cream,
          lineHeight: 0,
          maxWidth: "100%",
        }}
      >
        <Img
          src={staticFile(image)}
          alt={alt}
          style={{
            display: "block",
            maxWidth: "100%",
            maxHeight: maxImageHeight,
            width: "auto",
            height: "auto",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}
