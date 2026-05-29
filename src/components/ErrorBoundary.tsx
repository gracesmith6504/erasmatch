import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const RELOAD_FLAG = "chunkReloadAttempt";

/**
 * Detects "stale chunk" errors caused by a redeploy invalidating the
 * filenames the user's currently-loaded index.html refers to.
 * These surface as "Failed to fetch dynamically imported module" or
 * "Loading chunk … failed".
 */
const isChunkLoadError = (error: unknown): boolean => {
  if (!error) return false;
  const message =
    (error as { message?: string })?.message ??
    String(error);
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Loading chunk [\w-]+ failed/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
};

const reloadOnce = () => {
  // Avoid an infinite reload loop if the chunk is genuinely missing.
  if (sessionStorage.getItem(RELOAD_FLAG)) return false;
  sessionStorage.setItem(RELOAD_FLAG, "1");
  window.location.reload();
  return true;
};

// Catch chunk failures that bubble up as unhandled promise rejections
// (React.lazy rejects asynchronously and may never reach the boundary).
if (typeof window !== "undefined") {
  window.addEventListener("unhandledrejection", (event) => {
    if (isChunkLoadError(event.reason)) {
      event.preventDefault();
      reloadOnce();
    }
  });

  // Clear the guard once the app successfully boots.
  window.addEventListener("load", () => {
    sessionStorage.removeItem(RELOAD_FLAG);
  });
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    if (isChunkLoadError(error) && reloadOnce()) {
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (isChunkLoadError(error)) {
      reloadOnce();
      return;
    }
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">Something went wrong</h1>
            <p className="text-muted-foreground">An unexpected error occurred. Please try reloading.</p>
            <button
              onClick={() => {
                sessionStorage.removeItem(RELOAD_FLAG);
                window.location.reload();
              }}
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
