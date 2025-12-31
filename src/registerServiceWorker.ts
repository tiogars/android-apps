/**
 * Service Worker Registration with Update Detection
 * 
 * This module handles service worker registration and provides
 * update detection and notification for PWA updates.
 */

export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
}

export function registerServiceWorker(config?: ServiceWorkerConfig): () => void {
  let updateCheckInterval: ReturnType<typeof setInterval> | null = null;

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = '/service-worker.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          // Check for updates immediately after registration
          registration.update();

          // Check for updates every hour
          updateCheckInterval = setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // Listen for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                console.log('New service worker available');
                if (config?.onUpdate) {
                  config.onUpdate(registration);
                }
              }
            });
          });

          // Success callback
          if (config?.onSuccess) {
            config.onSuccess(registration);
          }
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });

      // Listen for controller change (new service worker took over)
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('Service Worker controller changed, reloading page');
        window.location.reload();
      });
    });
  }

  // Return cleanup function
  return () => {
    if (updateCheckInterval) {
      clearInterval(updateCheckInterval);
    }
  };
}

/**
 * Unregister all service workers (useful for debugging)
 */
export async function unregisterServiceWorker(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const registration of registrations) {
      await registration.unregister();
    }
  }
}
