import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import BerserkerAwakeningCalculator from "./berserker-awakening-calculator.tsx";
import "./styles/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BerserkerAwakeningCalculator />
  </StrictMode>
);
