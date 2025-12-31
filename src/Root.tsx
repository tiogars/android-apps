import { useState, useEffect } from 'react'
import { Snackbar, Alert, Button } from '@mui/material'
import App from './App'
import { registerServiceWorker } from './registerServiceWorker'

export default function Root() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Register service worker with update detection
    const cleanup = registerServiceWorker({
      onUpdate: (reg) => {
        console.log('App update available');
        setUpdateAvailable(true);
        setRegistration(reg);
      },
      onSuccess: () => {
        console.log('Service worker registered successfully');
      },
    });

    // Cleanup interval on unmount
    return cleanup;
  }, []);

  const handleUpdateClick = () => {
    if (registration?.waiting) {
      // Tell the service worker to skip waiting and become active
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      setUpdateAvailable(false);
    }
  };

  const handleUpdateDismiss = () => {
    setUpdateAvailable(false);
  };

  return (
    <>
      <App />
      <Snackbar
        open={updateAvailable}
        onClose={handleUpdateDismiss}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="info"
          variant="filled"
          onClose={handleUpdateDismiss}
          action={
            <Button color="inherit" size="small" onClick={handleUpdateClick}>
              UPDATE
            </Button>
          }
        >
          A new version is available! Click UPDATE to refresh.
        </Alert>
      </Snackbar>
    </>
  );
}
