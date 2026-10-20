import { Series } from "remotion";
import { buttonOn, getPair } from "../theme/brand";
import { fontFamily } from "../theme/fonts";
import { ReducedMotionProvider } from "../theme/motion";
import { useBrandFonts } from "../theme/fonts";
import type { Beat, InsightVideoProps } from "../lib/types";
import { BeatFrame } from "../components/BeatFrame";
import { CaptionTrack } from "../components/CaptionTrack";
import { DataCallout } from "../components/DataCallout";
import { KineticType } from "../components/KineticType";
import { NumberedPoint, StackedList } from "../components/NumberedPoint";
import { QuoteCard } from "../components/QuoteCard";
import { VectorDevice } from "../components/VectorDevice";
import { VennDiagram } from "../components/VennDiagram";
import { Kicker, Wordmark } from "../components/Wordmark";

export function InsightVideo({ script, reducedMotion = false }: InsightVideoProps) {
  useBrandFonts();

  return (
    <ReducedMotionProvider reducedMotion={reducedMotion}>
      <Series>
        {script.beats.map((beat, index) => (
          <Series.Sequence key={`${beat.type}-${index}`} durationInFrames={beat.durationInFrames}>
            <BeatView beat={beat} />
            <CaptionTrack text={beat.caption} />
          </Series.Sequence>
        ))}
      </Series>
    </ReducedMotionProvider>
  );
}

function BeatView({ beat }: { beat: Beat }) {
  const pair = getPair(beat.pair);

  return (
    <BeatFrame pair={pair}>
      <Wordmark color={pair.fg} />
      {beat.type === "title" ? (
        <div className="flex flex-1 flex-col justify-end" style={{ paddingBottom: 24 }}>
          <Kicker text={beat.kicker} color={pair.fg} />
          <KineticType as="h1" text={beat.heading} size={78} color={pair.fg} lineHeight={1.02} />
        </div>
      ) : null}
      {beat.type === "statement" ? (
        <div className="flex flex-1 flex-col justify-center" style={{ maxWidth: 920 }}>
          <KineticType as="h1" text={beat.heading} size={68} color={pair.fg} lineHeight={1.05} />
          <KineticType
            as="p"
            text={beat.body}
            size={36}
            weight={500}
            color={pair.fg}
            lineHeight={1.28}
            delay={6}
            style={{ marginTop: 28 }}
          />
        </div>
      ) : null}
      {beat.type === "quote" ? (
        <QuoteCard quote={beat.quote} attribution={beat.attribution} color={pair.fg} />
      ) : null}
      {beat.type === "data" ? (
        <DataCallout value={beat.value} label={beat.label} source={beat.source} color={pair.fg} />
      ) : null}
      {beat.type === "venn" ? (
        <VennDiagram
          heading={beat.heading}
          left={beat.left}
          right={beat.right}
          bottom={beat.bottom}
          centre={beat.centre}
          color={pair.fg}
        />
      ) : null}
      {beat.type === "point" ? (
        <NumberedPoint
          index={beat.index}
          total={beat.total}
          heading={beat.heading}
          body={beat.body}
          color={pair.fg}
          background={pair.bg}
        />
      ) : null}
      {beat.type === "device" ? (
        <VectorDevice heading={beat.heading} items={beat.items} color={pair.fg} />
      ) : null}
      {beat.type === "list" ? (
        <StackedList heading={beat.heading} items={beat.items} color={pair.fg} background={pair.bg} />
      ) : null}
      {beat.type === "close" ? (
        <div className="flex flex-1 flex-col justify-end" style={{ paddingBottom: 12 }}>
          <KineticType as="h1" text={beat.heading} size={68} color={pair.fg} lineHeight={1.05} />
          <UrlButton background={pair.bg} url={beat.url} />
        </div>
      ) : null}
    </BeatFrame>
  );
}

function UrlButton({ background, url }: { background: string; url: string }) {
  const button = buttonOn(background);
  return (
    <p
      className="m-0"
      style={{
        marginTop: 36,
        alignSelf: "flex-start",
        backgroundColor: button.bg,
        color: button.fg,
        fontFamily: fontFamily.display,
        fontWeight: 700,
        fontSize: 32,
        lineHeight: 1,
        padding: "18px 22px",
      }}
    >
      {url}
    </p>
  );
}
