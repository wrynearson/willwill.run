import React from "react";
import ReactDOM from "react-dom/client";
import "./normalize.css";
import "leaflet/dist/leaflet.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./components/App";
import "./index.css";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter basename="">
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:runId" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
