"use client";

import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import EnsureIbkrConnection from "./components/ensure-ibkr-connection";

enum IbkrStatusEnum {
  waiting = 'waiting',
  connecting = 'connecting',
  connected = 'connected',
  disconnected = 'disconnected',
  error = 'error',
}

export default function Home() {
  const [positions, setPositions] = useState<any[]>([]);

  const loadPositions = async () => {
    const positions = await axios.get('/api/ibkr/positions').then(res => res.data)
    setPositions(positions);
  }

  const onIbkrConnected = async () => {
    loadPositions();
  }

  return (
    <EnsureIbkrConnection onConnect={onIbkrConnected}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)] w-full h-full bg-gray-50">
        <main className="flex flex-col gap-6 sm:gap-8 row-start-2 items-center sm:items-start w-full h-full max-w-screen-xl ">
          <Button onClick={() => loadPositions()}>Load Positions</Button>
          <div className="text-black">
            <code>
              {JSON.stringify(positions, null, 2)}
            </code>
          </div>
          <PortfolioGrid netLiquidationValue={130000} />
        </main >
      </div >
    </EnsureIbkrConnection >
  );
}
