/**
 * Application entry point.
 * PostHog is initialised via the script tag in index.html.
 */
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.tsx'
import './index.css'

document.title = "ErasMatch";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
