import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { loadFont as loadFigtree } from "@remotion/google-fonts/Figtree";
import { loadFont as loadPlex } from "@remotion/google-fonts/IBMPlexSans";
import { App } from "./App";
import "./site.css";

loadFigtree("normal", { weights: ["400", "600", "700"], subsets: ["latin"] });
loadPlex("normal", { weights: ["400", "500", "600"], subsets: ["latin"] });

const root = document.getElementById("root");
if (!root) {
  throw new Error("Missing #root");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
