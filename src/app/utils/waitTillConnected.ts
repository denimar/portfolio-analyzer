import { makeRequest } from "./makeRequest";

export const waitTillConnected = (
  timeoutSeconds: number = 30, 
  fallback?: () => void,
  onConnect?: () => void
) => {
  return new Promise(async (resolve) => {
    const startTime = Date.now();
    const timeoutMs = timeoutSeconds * 1000;
    
    // First check if already connected
    try {
      const initialStatus = await makeRequest('/api/ibkr/status');
      if (initialStatus.authenticated && initialStatus.connected) {
        console.log('Already connected, no need to wait');
        if (onConnect) {
          onConnect();
        }
        resolve(initialStatus);
        return;
      }
    } catch (error) {
      console.log('Initial status check failed, starting polling...');
    }
    
    const interval = setInterval(async () => {
      // Check if timeout has been reached
      if (Date.now() - startTime >= timeoutMs) {
        clearInterval(interval);
        if (fallback) {
          fallback();
        }
        resolve(null);
        return;
      }

      try {
        const status = await makeRequest('/api/ibkr/status');
        console.log('IBKR status check:', status);
        if (status.authenticated && status.connected) {
          clearInterval(interval);
          resolve(status);
          if (onConnect) {
            onConnect();
          }
        } else {
          console.log('Waiting for IBKR connection...');
        }
      } catch (err) {
        console.error("Error fetching IBKR status:", err);
        // Don't clear interval on error, keep trying until timeout
      }
    }, 1000);
  });
}; 