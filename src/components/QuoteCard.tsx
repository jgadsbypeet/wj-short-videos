import { KineticType } from "./KineticType";

export function QuoteCard({
  quote,
  attribution,
  color,
}: {
  quote: string;
  attribution: string;
  color: string;
}) {
  return (
    <figure className="m-0 flex flex-1 flex-col justify-center" style={{ maxWidth: 900 }}>
      <QuoteMark color={color} />
      <KineticType
        as="h1"
        text={quote}
        size={64}
        color={color}
        lineHeight={1.12}
        delay={4}
        style={{ marginTop: 28 }}
      />
      <figcaption style={{ marginTop: 36 }}>
        <KineticType
          as="p"
          text={attribution}
          size={28}
          weight={600}
          family="ui"
          color={color}
          delay={8}
          lineHeight={1.3}
        />
      </figcaption>
    </figure>
  );
}

function QuoteMark({ color }: { color: string }) {
  return (
    <svg width="120" height="78" viewBox="0 0 120 78" aria-hidden="true">
      <circle cx="26" cy="24" r="16" fill={color} />
      <circle cx="70" cy="24" r="16" fill={color} />
      <path
        d="M16 40c-2 16 6 28 24 26"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
      />
    </svg>
  );
}
