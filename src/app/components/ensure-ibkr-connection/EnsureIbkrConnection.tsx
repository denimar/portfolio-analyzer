import IbkrConnectModal from "@/app/modals/CloseOutCartModal";
import { makeRequest } from "@/app/utils";
import { FC, useEffect, useState } from "react";

type EnsureIbkrConnectionProps = {
  children: React.ReactNode;
  onConnect: () => void;
  onDisconnect: () => void;
  onError: (errorMessage: string) => void;
}

const EnsureIbkrConnection: FC<EnsureIbkrConnectionProps> = ({ children, onConnect, onDisconnect, onError }) => {
  const [openIbkrConnectModal, setOpenIbkrConnectModal] = useState(false);

  const waitTillConnected = () => {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        makeRequest('/api/ibkr/status').then(status => {
          if (status.authenticated && status.connected) {
            clearInterval(interval);
            resolve(status);
          }
          console.log('Waiting for IBKR connection...');
        }).catch(err => {
          console.error("Error fetching IBKR status:", err);
          clearInterval(interval);
          resolve(null);
        });
      }, 1000);
    });
  }

  useEffect(() => {
    debugger
    makeRequest('/api/ibkr/status').then(status => {
      debugger
      if (status.authenticated && status.connected) {
        onConnect();
      } else {
        const statusStr = JSON.stringify(status, null, 2) 
        debugger
        const needToReconnect = !statusStr.includes('401')
        if (needToReconnect) {
          makeRequest('/api/ibkr/reconnect', { method: 'POST' }).then(async status => {
            await waitTillConnected()
            onConnect();
          });
        } else {
          setOpenIbkrConnectModal(true);
        }
      }
    }).catch(err => {
      onError(err.message);
    });
  }, []);


  return (
    <>
      <IbkrConnectModal open={openIbkrConnectModal} setOpen={setOpenIbkrConnectModal} />
      { children }
    </>
  )
}

export default EnsureIbkrConnection;