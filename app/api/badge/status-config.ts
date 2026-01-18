export const STATUS_COLOR: Record<string, string> = {
  finished: "#3fb950",
  "running:healthy": "#3fb950",
  failed: "#f85149",
  in_progress: "#2188ff",
  queued: "#6e7681",
  no_history: "#d1d5da",
  unauthorized: "#cea61b",
  offline: "#cea61b",
};

export const STATUS_DISPLAY: Record<string, string> = {
  finished: "Live",
  "running:healthy": "Live",
  failed: "Failed",
  in_progress: "Deploying",
  queued: "Queued",
  no_history: "No history",
  unauthorized: "Unauthorized",
  offline: "Offline",
};
