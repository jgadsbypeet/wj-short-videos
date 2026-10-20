import type { PairName } from "../theme/brand";

export type Pillar = "practical-advice" | "data-insight" | "case-study";

export type TitleBeat = {
  type: "title";
  pair: PairName;
  kicker: string;
  heading: string;
  caption: string;
  durationInFrames: number;
};

export type StatementBeat = {
  type: "statement";
  pair: PairName;
  heading: string;
  body: string;
  caption: string;
  durationInFrames: number;
};

export type QuoteBeat = {
  type: "quote";
  pair: PairName;
  quote: string;
  attribution: string;
  caption: string;
  durationInFrames: number;
};

export type DataBeat = {
  type: "data";
  pair: PairName;
  value: string;
  label: string;
  source: string;
  caption: string;
  durationInFrames: number;
};

export type VennBeat = {
  type: "venn";
  pair: PairName;
  heading: string;
  left: string;
  right: string;
  bottom: string;
  centre: string;
  caption: string;
  durationInFrames: number;
};

export type PointBeat = {
  type: "point";
  pair: PairName;
  index: number;
  total: number;
  heading: string;
  body: string;
  caption: string;
  durationInFrames: number;
};

export type DeviceBeat = {
  type: "device";
  pair: PairName;
  heading: string;
  items: string[];
  caption: string;
  durationInFrames: number;
};

export type ListBeat = {
  type: "list";
  pair: PairName;
  heading: string;
  items: string[];
  caption: string;
  durationInFrames: number;
};

export type CloseBeat = {
  type: "close";
  pair: PairName;
  heading: string;
  url: string;
  caption: string;
  durationInFrames: number;
};

export type Beat =
  | TitleBeat
  | StatementBeat
  | QuoteBeat
  | DataBeat
  | VennBeat
  | PointBeat
  | DeviceBeat
  | ListBeat
  | CloseBeat;

/** Distributive omit. A plain Omit on this union would drop the fields that differ. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
export type BeatDraft = DistributiveOmit<Beat, "durationInFrames">;

export type VideoScript = {
  id: string;
  compositionId: string;
  pillar: Pillar;
  pillarLabel: string;
  sourceUrl: string;
  sourceTitle: string;
  author: string;
  post: string;
  alt: string;
  beats: Beat[];
  durationInFrames: number;
};

export type InsightVideoProps = {
  script: VideoScript;
  reducedMotion?: boolean;
};
