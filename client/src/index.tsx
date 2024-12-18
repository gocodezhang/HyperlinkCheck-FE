import React from "react";
import { createRoot } from "react-dom/client";
import SideBar from "./components/SideBar";
import "./style.css";

const root = createRoot(document.getElementById("app") as HTMLElement);
root.render(
  <React.StrictMode>
    <SideBar />
  </React.StrictMode>
);
