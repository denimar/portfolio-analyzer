"use client";

import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { openIbkrLoginPopup } from "./utils";
import { Loader } from "lucide-react";

enum IbkrStatusEnum {
  waiting = 'waiting',
  connecting = 'connecting',
  connected = 'connected',
  disconnected = 'disconnected',
  error = 'error',
}

export default function Home() {
  const [positions, setPositions] = useState<any[]>([]);
  const [ibkrStatus, setIbkrStatus] = useState<IbkrStatusEnum>(IbkrStatusEnum.waiting);

  useEffect(() => {
    axios.get('/api/ibkr/status').then(res => res.data).then(status => {
      if (status.authenticated && status.connected) {
        setIbkrStatus(IbkrStatusEnum.connected);
      } else {
        setIbkrStatus(IbkrStatusEnum.disconnected);
        openIbkrLoginPopup(() => {
          setIbkrStatus(IbkrStatusEnum.connecting);
        });
      }
    }).catch(err => {
      console.error("Error fetching IBKR status:", err);
      setIbkrStatus(IbkrStatusEnum.error);
    });
  }, []);

  const loadPositions = async () => {
    const positions = await axios.get('/api/ibkr/positions').then(res => res.data)
    // const positionsResp: any = await ibkrApiClient({ endpoint: '/portfolio/U13793951/positions/0' });    

    // const sessionCookies = document.cookie; // assuming you're in an API route handler
    // const positionsResp: any = await ibkrApi({
    //   method: 'GET',
    //   endpoint: '/portfolio/U13793951/positions/0',
    //   data: { /* order payload */ },
    //   cookies: sessionCookies,
    // });

    setPositions(positions);
  }

  if (ibkrStatus !== IbkrStatusEnum.connected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Waiting for IBKR connection...</p>
        <Loader className="animated-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)] w-full h-full bg-gray-50">
      <main className="flex flex-col gap-6 sm:gap-8 row-start-2 items-center sm:items-start w-full h-full max-w-screen-xl ">
        <div>{ibkrStatus}</div>
        <Button onClick={() => loadPositions()}>Load Positions</Button>
        <div className="text-black">
          <code>
            {JSON.stringify(positions, null, 2)}
          </code>
        </div>
        <PortfolioGrid netLiquidationValue={130000} />
      </main>
    </div>
  );
}
