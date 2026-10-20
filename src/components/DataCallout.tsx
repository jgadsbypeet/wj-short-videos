import { fontFamily } from "../theme/fonts";
import { KineticType } from "./KineticType";

export function DataCallout({
  value,
  label,
  source,
  color,
}: {
  value: string;
  label: string;
  source: string;
  color: string;
}) {
  const size = value.length > 10 ? 104 : value.length > 6 ? 132 : 168;

  return (
    <div className="flex flex-1 flex-col justify-center" style={{ maxWidth: 920 }}>
      <KineticType
        as="p"
        text={value}
        size={size}
        color={color}
        lineHeight={0.92}
        style={{ fontVariantNumeric: "tabular-nums" }}
      />
      <KineticType
        as="h1"
        text={label}
        size={44}
        weight={600}
        color={color}
        lineHeight={1.15}
        delay={4}
        style={{ marginTop: 28 }}
      />
      <p
        className="m-0"
        style={{
          marginTop: 32,
          color,
          fontFamily: fontFamily.ui,
          fontWeight: 500,
          fontSize: 26,
          lineHeight: 1.35,
          maxWidth: 760,
        }}
      >
        {source}
      </p>
    </div>
  );
}
