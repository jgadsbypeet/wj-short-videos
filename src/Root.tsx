import { Composition } from "remotion";
import { InsightVideo } from "./compositions/InsightVideo";
import { scripts } from "./data/scripts";
import { waitForFonts } from "./theme/fonts";
import { layout } from "./theme/brand";
import type { InsightVideoProps } from "./lib/types";

const formats = [
  { suffix: "Square", ...layout.square },
  { suffix: "Portrait", ...layout.portrait },
] as const;

export function RemotionRoot() {
  return (
    <>
      {scripts.map((script) =>
        formats.map((format) => {
          const id = `${script.compositionId}${format.suffix}`;
          const defaultProps: InsightVideoProps = {
            script,
            reducedMotion: false,
          };
          return (
            <Composition
              key={id}
              id={id}
              component={InsightVideo}
              width={format.width}
              height={format.height}
              fps={layout.fps}
              durationInFrames={script.durationInFrames}
              defaultProps={defaultProps}
              calculateMetadata={async ({ props }) => {
                await waitForFonts();
                return {
                  durationInFrames: props.script.durationInFrames,
                  props,
                };
              }}
            />
          );
        }),
      )}
    </>
  );
}
