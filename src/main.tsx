/** @format */

// import React from "react";
import { createRoot } from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import { App } from "./App";
import "@fontsource/ibm-plex-sans";
// import "./index.css";
import "./assets/scss/style.scss";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
