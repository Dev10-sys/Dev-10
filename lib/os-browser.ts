/**
 * Opens a URL inside the in-OS browser app window.
 * Dispatches two events: one to open the browser app, one to navigate to the URL.
 */
export function openInOsBrowser(url: string) {
  if (typeof window === "undefined") return;
  // First, open the browser app
  window.dispatchEvent(new CustomEvent("copilot-open-app", { detail: { appId: "browser" } }));
  // Then navigate (small delay to allow browser to mount if not already open)
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent("browser-navigate", { detail: { url } }));
  }, 120);
}
