import { continueRender, delayRender } from "remotion";
import { useEffect, useState } from "react";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSans";

const figtree = loadFigtree("normal", {
  weights: ["400", "600", "700"],
  subsets: ["latin"],
});

const plex = loadPlex("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const fontFamily = {
  display: figtree.fontFamily,
  ui: plex.fontFamily,
};

export async function waitForFonts(): Promise<void> {
  await Promise.all([figtree.waitUntilDone(), plex.waitUntilDone()]);
}

/** Holds the Remotion render until Figtree and IBM Plex Sans are ready. */
export function useBrandFonts(): boolean {
  const [handle] = useState(() => delayRender("Loading William Joseph fonts"));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    waitForFonts()
      .then(() => {
        if (!cancelled) setReady(true);
        continueRender(handle);
      })
      .catch((error: unknown) => {
        continueRender(handle);
        throw error;
      });
    return () => {
      cancelled = true;
    };
  }, [handle]);

  return ready;
}
