import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Authentication_context } from "./authentication/Authentication_context";

createRoot(document.getElementById("root")).render(
  <Authentication_context>
    <StrictMode>
      <App />
    </StrictMode>
  </Authentication_context>
);
