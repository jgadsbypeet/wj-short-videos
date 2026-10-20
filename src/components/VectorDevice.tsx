import { getPair, palette } from "../theme/brand";
import { fontFamily } from "../theme/fonts";
import { KineticType } from "./KineticType";

/**
 * A flat, square device. The site uses square controls, so the frame has no radius.
 * Nothing photographic is placed inside it.
 */
export function VectorDevice({
  heading,
  items,
  color,
}: {
  heading: string;
  items: string[];
  color: string;
}) {
  const screen = getPair("inkOnCream");
  const header = getPair("whiteOnTeal");

  return (
    <div className="flex flex-1 flex-col justify-center" style={{ maxWidth: 920 }}>
      <KineticType as="h1" text={heading} size={54} color={color} lineHeight={1.08} />
      <div
        className="mt-8"
        style={{
          border: `8px solid ${palette.ink}`,
          backgroundColor: screen.bg,
          marginTop: 32,
        }}
      >
        <div
          className="flex items-center"
          style={{
            height: 56,
            backgroundColor: header.bg,
            padding: "0 20px",
            gap: 10,
          }}
        >
          {[0, 1, 2].map((dot) => (
            <span
              key={dot}
              aria-hidden="true"
              style={{
                width: 14,
                height: 14,
                backgroundColor: header.fg,
                display: "inline-block",
              }}
            />
          ))}
        </div>
        <ul className="m-0 list-none p-0">
          {items.map((item, index) => {
            return (
              <li
                key={item}
                className="flex items-center"
                style={{
                  minHeight: 72,
                  padding: "0 24px",
                  borderTop: index === 0 ? "none" : `2px solid ${palette.mist}`,
                  color: screen.fg,
                  fontFamily: fontFamily.display,
                  fontWeight: 600,
                  fontSize: 32,
                  lineHeight: 1.2,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 18,
                    height: 18,
                    marginRight: 18,
                    backgroundColor: palette.teal,
                    display: "inline-block",
                    flex: "0 0 auto",
                  }}
                />
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
