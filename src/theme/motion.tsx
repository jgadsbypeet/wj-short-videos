import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const ReducedMotionContext = createContext(false);

export function ReducedMotionProvider({
  reducedMotion = false,
  children,
}: {
  reducedMotion?: boolean;
  children: ReactNode;
}) {
  const osReduced = useOperatingSystemReducedMotion();
  return (
    <ReducedMotionContext.Provider value={reducedMotion || osReduced}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotionFlag(): boolean {
  return useContext(ReducedMotionContext);
}

function useOperatingSystemReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return false;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return reduced;
}
