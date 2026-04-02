/**
 * Application entry point.
 * Wraps the app in BrowserRouter for client-side routing.
 */
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { PostHogProvider } from '@posthog/react'
import App from './App.tsx'
import './index.css'

document.title = "ErasMatch";

const posthogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  person_profiles: 'identified_only' as const,
  autocapture: true,
  capture_pageview: true,
  disable_cookie: true,
};

createRoot(document.getElementById("root")!).render(
  <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN} options={posthogOptions}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </PostHogProvider>
);
