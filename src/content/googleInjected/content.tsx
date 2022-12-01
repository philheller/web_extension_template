import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const root = document.createElement("div");
root.id = "crx-root";
document.body.append(root);

createRoot(root).render(<App />);
