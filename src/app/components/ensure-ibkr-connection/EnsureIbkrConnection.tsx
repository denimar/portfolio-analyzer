import { makeRequest, waitTillConnected } from "@/app/utils";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { FC, useEffect, useState } from "react";

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

  useEffect(() => {
    makeRequest('/api/ibkr/status').then(status => {
      if (status.authenticated && status.connected) {
        setIbkrStatus(IbkrStatusEnum.connected);
        onConnect();
      } else {
        const statusStr = JSON.stringify(status, null, 2)
        const needToReconnect = !statusStr.includes('401')
        if (needToReconnect) {
          setIbkrStatus(IbkrStatusEnum.open);
          makeRequest('/api/ibkr/reconnect', { method: 'POST' }).then(async status => {
            await waitTillConnected(5, () => {
              setIbkrStatus(IbkrStatusEnum.error);
              setErrorMessage('Connection timeout after 30 seconds');
            }, onConnect);
          });
        } else {
          setIbkrStatus(IbkrStatusEnum.disconnected);
        }
      }
    }).catch(err => {
      setErrorMessage(err.message);
      setIbkrStatus(IbkrStatusEnum.error);
    });
  }, []);

  const connectToIbkr = async () => {
    setIbkrStatus(IbkrStatusEnum.connecting);
    setErrorMessage(null);
    
    if (ibkrStatus === IbkrStatusEnum.disconnected) {
      window.open('https://localhost:5055');
      await waitTillConnected(30, () => {
        setIbkrStatus(IbkrStatusEnum.error);
        setErrorMessage('Connection timeout after 30 seconds');
      }, onConnect);
    } else if (ibkrStatus === IbkrStatusEnum.open) {
      makeRequest('/api/ibkr/reconnect', { method: 'POST' }).then(async status => {
        await waitTillConnected(30, () => {
          setIbkrStatus(IbkrStatusEnum.error);
          setErrorMessage('Connection timeout after 30 seconds');
        }, onConnect);
      });
    }
  }

  if (ibkrStatus !== IbkrStatusEnum.connected) {
    return (
      <div className="flex flex-col items-center gap-2 justify-center min-h-screen">
        <p className="text-gray-500">Waiting for IBKR connection...</p>
        {
          ibkrStatus === IbkrStatusEnum.connecting && (
            <Loader className="animated-spin" />
          )
        }
        {
          errorMessage && (
            <div className="text-red-500 text-center max-w-md">
              <p className="font-medium">Connection Error:</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          )
        }
        {
          (ibkrStatus === IbkrStatusEnum.open || ibkrStatus === IbkrStatusEnum.disconnected || ibkrStatus === IbkrStatusEnum.connecting) ? (
            <Button onClick={connectToIbkr} disabled={ibkrStatus === IbkrStatusEnum.connecting}>
              Connect
            </Button>
          ) : ibkrStatus === IbkrStatusEnum.error ? (
            <Button onClick={connectToIbkr}>
              Retry Connection
            </Button>
          ) : null
        }
      </div>
    )
  }

  return (
    <>
      {children}
    </>
  )
}

export default EnsureIbkrConnection;