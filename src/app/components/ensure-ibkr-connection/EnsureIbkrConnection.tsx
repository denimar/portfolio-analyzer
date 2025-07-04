import { makeRequest, waitTillConnected } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { FC, useEffect, useState, useCallback } from "react";

enum IbkrStatusEnum {
  waiting = 'waiting',
  connecting = 'connecting',
  open = 'open', //with session, but not connected - needs to reconnect
  connected = 'connected',
  disconnected = 'disconnected',
  error = 'error',
}

type EnsureIbkrConnectionProps = {
  children: React.ReactNode;
  onConnect: () => void;
}

const EnsureIbkrConnection: FC<EnsureIbkrConnectionProps> = ({ children, onConnect }) => {
  const [ibkrStatus, setIbkrStatus] = useState<IbkrStatusEnum>(IbkrStatusEnum.waiting);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(true);

  const MAX_RETRIES = 3;
  const CONNECTION_TIMEOUT = 30; // seconds
  const RECONNECT_TIMEOUT = 15; // seconds

  const clearError = useCallback(() => {
    setErrorMessage(null);
  }, []);

  const handleConnectionSuccess = useCallback(() => {
    setIbkrStatus(IbkrStatusEnum.connected);
    setRetryCount(0);
    clearError();
    onConnect();
  }, [onConnect, clearError]);

  const handleConnectionError = useCallback((error: string, shouldRetry: boolean = true) => {
    setErrorMessage(error);
    setIbkrStatus(IbkrStatusEnum.error);
    
    if (shouldRetry && retryCount < MAX_RETRIES) {
      // Auto-retry after 3 seconds
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        connectToIbkr();
      }, 3000);
    }
  }, [retryCount]);

  const checkConnectionStatus = useCallback(async (): Promise<boolean> => {
    try {
      const status = await makeRequest('/api/ibkr/status');
      console.log('IBKR status check:', status);
      
      if (status.authenticated && status.connected) {
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error checking IBKR status:', error);
      return false;
    }
  }, []);

  const connectToIbkr = useCallback(async () => {
    setIbkrStatus(IbkrStatusEnum.connecting);
    clearError();
    
    try {
      // First check if we're already connected
      const isConnected = await checkConnectionStatus();
      if (isConnected) {
        handleConnectionSuccess();
        return;
      }

      // Determine connection strategy based on current status
      if (ibkrStatus === IbkrStatusEnum.disconnected) {
        // Need to open IBKR Gateway and wait for connection
        window.open('https://localhost:5055');
        
        await waitTillConnected(CONNECTION_TIMEOUT, () => {
          handleConnectionError(`Connection timeout after ${CONNECTION_TIMEOUT} seconds. Please ensure IBKR Gateway is running.`);
        }, handleConnectionSuccess);
        
      } else if (ibkrStatus === IbkrStatusEnum.open) {
        // Try to reconnect existing session
        try {
          await makeRequest('/api/ibkr/reconnect', { method: 'POST' });
          
          // Check if reconnection was successful immediately
          const reconnected = await checkConnectionStatus();
          if (reconnected) {
            handleConnectionSuccess();
            return;
          }
          
          // Only wait if not immediately connected
          await waitTillConnected(RECONNECT_TIMEOUT, () => {
            handleConnectionError(`Reconnection timeout after ${RECONNECT_TIMEOUT} seconds. Please try again.`);
          }, handleConnectionSuccess);
          
        } catch (reconnectError: any) {
          handleConnectionError(`Reconnection failed: ${reconnectError.message}`);
        }
      }
      
    } catch (error: any) {
      handleConnectionError(`Connection failed: ${error.message}`);
    }
  }, [ibkrStatus, checkConnectionStatus, handleConnectionSuccess, handleConnectionError, clearError]);

  const initializeConnection = useCallback(async () => {
    setIsInitializing(true);
    
    try {
      const status = await makeRequest('/api/ibkr/status');
      console.log('Initial IBKR status:', status);
      
      if (status.authenticated && status.connected) {
        setIbkrStatus(IbkrStatusEnum.connected);
        onConnect();
        return;
      }
      
      // Check if we have a session but need to reconnect
      const hasSession = status['MAC'] !== undefined //status.authenticated || (status.error && !status.error.includes('401'));
      
      if (hasSession) {
        setIbkrStatus(IbkrStatusEnum.open);
        // Don't automatically reconnect - let user decide
        // The connection might already be working but status check failed
      } else {
        setIbkrStatus(IbkrStatusEnum.disconnected);
      }
      
    } catch (error: any) {
      console.error('Initial connection check failed:', error);
      setIbkrStatus(IbkrStatusEnum.disconnected);
      setErrorMessage(`Failed to check connection status: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  }, [onConnect]);

  useEffect(() => {
    initializeConnection();
  }, [initializeConnection]);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    connectToIbkr();
  }, [connectToIbkr]);

  if (ibkrStatus !== IbkrStatusEnum.connected) {
    return (
      <div className="flex flex-col items-center gap-4 justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">
            {isInitializing ? 'Initializing connection...' : 'Waiting for IBKR connection...'}
          </p>
          {retryCount > 0 && (
            <p className="text-sm text-orange-500">
              Retry attempt {retryCount} of {MAX_RETRIES}
            </p>
          )}
        </div>
        
        {ibkrStatus === IbkrStatusEnum.connecting && (
          <Loader className="animate-spin h-6 w-6" />
        )}
        
        {errorMessage && (
          <div className="text-red-500 text-center max-w-md bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="font-medium mb-1">Connection Error:</p>
            <p className="text-sm">{errorMessage}</p>
            {retryCount >= MAX_RETRIES && (
              <p className="text-xs text-red-400 mt-2">
                Maximum retry attempts reached. Please check your IBKR Gateway connection.
              </p>
            )}
          </div>
        )}
        
        <div className="flex gap-2">
          {(ibkrStatus === IbkrStatusEnum.open || ibkrStatus === IbkrStatusEnum.disconnected) && (
            <Button 
              onClick={connectToIbkr} 
              disabled={isInitializing}
              className="min-w-[120px]"
            >
              {ibkrStatus === IbkrStatusEnum.open ? 'Reconnect' : 'Connect'}
            </Button>
          )}
          
          {ibkrStatus === IbkrStatusEnum.error && retryCount < MAX_RETRIES && (
            <Button onClick={handleRetry} className="min-w-[120px]">
              Retry ({MAX_RETRIES - retryCount} left)
            </Button>
          )}
          
          {ibkrStatus === IbkrStatusEnum.error && retryCount >= MAX_RETRIES && (
            <Button onClick={handleRetry} className="min-w-[120px]">
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default EnsureIbkrConnection;