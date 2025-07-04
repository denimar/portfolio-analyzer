import { makeRequest } from "./makeRequest";

export const waitTillConnected = (
  timeoutSeconds: number = 30, 
  fallback?: () => void,
  onConnect?: () => void
) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1000;
    
    const interval = setInterval(() => {
      // Check if timeout has been reached
      if (Date.now() - startTime >= timeoutMs) {
        clearInterval(interval);
        if (fallback) {
          fallback();
        }
        resolve(null);
        return;
      }

      makeRequest('/api/ibkr/status').then(status => {
        console.log('IBKR status:', status);
        if (status.authenticated && status.connected) {
          clearInterval(interval);
          resolve(status);
          if (onConnect) {
            onConnect();
          }
        }
        console.log('Waiting for IBKR connection...');
      }).catch(err => {
        console.error("Error fetching IBKR status:", err);
        clearInterval(interval);
        resolve(null);
      });
    }, 1000);
  });
}; 