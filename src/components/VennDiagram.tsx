import { getPair, palette } from "../theme/brand";
import { fontFamily } from "../theme/fonts";
import { KineticType } from "./KineticType";

/**
 * People, processes and tools.
 * Labels sit on solid brand chips inside each circle, so overlaps never become the text background.
 */
export function VennDiagram({
  heading,
  left,
  right,
  bottom,
  centre,
  color,
}: {
  heading: string;
  left: string;
  right: string;
  bottom: string;
  centre: string;
  color: string;
}) {
  const people = getPair("inkOnAqua");
  const processes = getPair("inkOnYellow");
  const tools = getPair("inkOnPink");
  const core = getPair("whiteOnTeal");
  const [centreFirst, ...centreRest] = centre.split(" ");

  return (
    <div className="flex flex-1 flex-col" style={{ minHeight: 0 }}>
      <KineticType as="h1" text={heading} size={48} color={color} lineHeight={1.08} />
      <div
        className="relative"
        style={{ height: 500, width: "100%", maxWidth: 880, marginTop: 8 }}
        role="img"
        aria-label={`${centre}, where ${left}, ${right} and ${bottom} meet`}
      >
        <Lobe color={palette.aqua} style={{ left: 0, top: 0 }} />
        <Lobe color={palette.yellow} style={{ left: 250, top: 0 }} />
        <Lobe color={palette.pink} style={{ left: 125, top: 160 }} />
        <Chip text={left} color={people.fg} background={people.bg} style={{ left: 36, top: 96 }} />
        <Chip
          text={right}
          color={processes.fg}
          background={processes.bg}
          style={{ left: 390, top: 72 }}
        />
        <Chip text={bottom} color={tools.fg} background={tools.bg} style={{ left: 214, top: 372 }} />
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{
            left: 250,
            top: 155,
            width: 200,
            height: 200,
            borderRadius: "50%",
            backgroundColor: palette.teal,
            color: core.fg,
            fontFamily: fontFamily.display,
            fontWeight: 700,
            fontSize: 28,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            textAlign: "center",
          }}
        >
          <span>{centreFirst}</span>
          <span>{centreRest.join(" ")}</span>
        </div>
      </div>
    </div>
  );
}

function Lobe({ color, style }: { color: string; style: { left: number; top: number } }) {
  return (
    <div
      aria-hidden="true"
      className="absolute"
      style={{
        width: 340,
        height: 340,
        borderRadius: "50%",
        backgroundColor: color,
        ...style,
      }}
    />
  );
}

function Chip({
  text,
  color,
  background,
  style,
}: {
  text: string;
  color: string;
  background: string;
  style: { left: number; top: number };
}) {
  return (
    <span
      className="absolute"
      style={{
        backgroundColor: background,
        color,
        fontFamily: fontFamily.display,
        fontWeight: 700,
        fontSize: 32,
        lineHeight: 1,
        letterSpacing: "-0.03em",
        padding: "12px 16px",
        ...style,
      }}
    >
      {text}
    </span>
  );
}
