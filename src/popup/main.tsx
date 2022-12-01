import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../index.css"; // still have to import this for tailwin
import "./styles.css"; // since this is popup size accordingly

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);

ReactDOM.createRoot(document.querySelector("#root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
