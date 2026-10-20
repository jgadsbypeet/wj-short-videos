import type { VideoScript } from "../lib/types";
import raw from "./generated/scripts.json";

export const scripts = raw as VideoScript[];
