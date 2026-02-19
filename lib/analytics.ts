type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

type AnalyticsWindow = Window & {
  gtag?: (command: string, eventName: string, params?: AnalyticsPayload) => void;
  plausible?: (eventName: string, options?: { props?: AnalyticsPayload }) => void;
  dataLayer?: unknown[];
};

export function trackEvent(eventName: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const win = window as AnalyticsWindow;

  if (typeof win.gtag === "function") {
    win.gtag("event", eventName, payload);
  }

  if (typeof win.plausible === "function") {
    win.plausible(eventName, { props: payload });
  }

  if (Array.isArray(win.dataLayer)) {
    win.dataLayer.push({ event: eventName, ...payload });
  }
}
