import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./styles.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import { SiteProvider } from "./site-context.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* anything else lands back on the home page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </SiteProvider>
    </BrowserRouter>
  </StrictMode>
);
