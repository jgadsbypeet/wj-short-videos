import { getPair } from "../theme/brand";
import { fontFamily } from "../theme/fonts";
import { KineticType } from "./KineticType";

export function NumberedPoint({
  index,
  total,
  heading,
  body,
  color,
  background,
}: {
  index: number;
  total: number;
  heading: string;
  body: string;
  color: string;
  background: string;
}) {
  const numberColor = readableNumber(background, color);

  return (
    <div className="flex flex-1 flex-col justify-center" style={{ maxWidth: 900 }}>
      <p
        className="m-0"
        style={{
          color: numberColor,
          fontFamily: fontFamily.display,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: "0.01em",
          marginBottom: 12,
        }}
      >
        {index} of {total}
      </p>
      <div className="flex items-start" style={{ gap: 28 }}>
        <span
          aria-hidden="true"
          style={{
            color: numberColor,
            fontFamily: fontFamily.display,
            fontWeight: 700,
            fontSize: 120,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
          }}
        >
          {index}
        </span>
        <div className="flex-1" style={{ paddingTop: 8 }}>
          <KineticType as="h1" text={heading} size={64} color={color} lineHeight={1.05} />
          <KineticType
            as="p"
            text={body}
            size={36}
            weight={500}
            color={color}
            lineHeight={1.25}
            delay={6}
            style={{ marginTop: 20 }}
          />
        </div>
      </div>
    </div>
  );
}

function readableNumber(background: string, fallback: string): string {
  const preferred = ["tealOnCream", "tealOnMist", "tealOnYellow", "tealOnAqua", "yellowOnTeal", "yellowOnInk"];
  for (const name of preferred) {
    const pair = getPair(name);
    if (pair.bg.toLowerCase() === background.toLowerCase()) return pair.fg;
  }
  return fallback;
}

export function StackedList({
  heading,
  items,
  color,
  background,
}: {
  heading: string;
  items: string[];
  color: string;
  background: string;
}) {
  const numberColor = readableNumber(background, color);
  return (
    <div className="flex flex-1 flex-col justify-center" style={{ maxWidth: 900 }}>
      <KineticType as="h1" text={heading} size={52} color={color} />
      <ol className="m-0 mt-8 list-none p-0" style={{ marginTop: 28 }}>
        {items.map((item, index) => (
          <li
            key={item}
            className="flex items-baseline"
            style={{
              gap: 18,
              padding: "10px 0",
              borderTop: `2px solid ${color}`,
              color,
              fontFamily: fontFamily.display,
              fontWeight: 700,
              fontSize: 36,
              lineHeight: 1.2,
            }}
          >
            <span style={{ color: numberColor, width: 48, flex: "0 0 auto" }}>{index + 1}</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
