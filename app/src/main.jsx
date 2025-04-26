import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Header from "./_components/Header.jsx";
import Provider from "./Provider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider>
      <Header />
      <App />
    </Provider>
  </StrictMode>
);
