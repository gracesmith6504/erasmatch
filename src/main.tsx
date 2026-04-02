/**
 * Application entry point.
 * Wraps the app in BrowserRouter for client-side routing.
 */
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import posthog from 'posthog-js';
import App from './App.tsx'
import './index.css'

document.title = "ErasMatch";

posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  person_profiles: 'identified_only',
  autocapture: true,
  capture_pageview: true,
  disable_cookie: true,
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
