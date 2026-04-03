export {};

declare global {
  interface Window {
    posthog?: {
      identify: (id: string, properties?: Record<string, any>) => void;
      reset: () => void;
      capture: (event: string, properties?: Record<string, any>) => void;
    };
  }
}
