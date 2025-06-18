import { makeRequest } from "@/app/utils";
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

  const waitTillConnected = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        makeRequest('/api/ibkr/status').then(status => {
          console.log('IBKR status:', status);
          if (status.authenticated && status.connected) {
            setIbkrStatus(IbkrStatusEnum.connected);
            clearInterval(interval);
            resolve(status);
            onConnect();
          }
          console.log('Waiting for IBKR connection...');
        }).catch(err => {
          setIbkrStatus(IbkrStatusEnum.error);
          setErrorMessage(err.message);
          console.error("Error fetching IBKR status:", err);
          clearInterval(interval);
          resolve(null);
        });
      }, 1000);
    });
  }

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
            await waitTillConnected()
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
    if (ibkrStatus === IbkrStatusEnum.disconnected) {
      window.open('https://localhost:5055');
      await waitTillConnected()
    } else if (ibkrStatus === IbkrStatusEnum.open) {
      makeRequest('/api/ibkr/reconnect', { method: 'POST' }).then(async status => {
        await waitTillConnected()
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
          ibkrStatus === IbkrStatusEnum.open || ibkrStatus === IbkrStatusEnum.disconnected || ibkrStatus === IbkrStatusEnum.connecting ? (
            <Button onClick={connectToIbkr} disabled={ibkrStatus === IbkrStatusEnum.connecting}>
              Connect
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