"use client";

import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";
import { useState } from "react";
import axios from "axios";
import EnsureIbkrConnection from "./components/ensure-ibkr-connection";
import PositionsPanel from "./PositionsPanel/PositionsPanel";
import DashboardWidget from "./components/DashboardWidget";
import BalancesPanel from "./BalancesPanel";

export default function Home() {
  const [positions, setPositions] = useState<any[]>([]);
  const [accountSummary, setAccountSummary] = useState<any>({});

  const loadInitialData = async () => {
    const [fetchedPositions, fetchedAccountSummary] = await Promise.all([
      axios.get('/api/ibkr/positions').then(res => res.data),
      axios.get('/api/ibkr/account/summary').then(res => res.data)
    ]);
    setPositions(fetchedPositions);
    setAccountSummary(fetchedAccountSummary);
  }

  const onIbkrConnected = async () => {
    loadInitialData();
  }

  return (
    <EnsureIbkrConnection onConnect={onIbkrConnected}>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-8 sm:gap-16 w-full h-full bg-gray-100 select-none">
        <main className="flex flex-col gap-3 sm:gap-3 row-start-2 items-center sm:items-start w-full h-full max-w-screen-xl ">
          <div className="flex flex-row gap-3 w-full">
            <DashboardWidget title="Balances" className="w-[350px]">
              <BalancesPanel balances={accountSummary} />
            </DashboardWidget>
            <DashboardWidget title="Portfolio" className="flex flex-1">
              <PositionsPanel positions={positions} />
            </DashboardWidget>
          </div>
          <DashboardWidget title="Strategy" className="w-full">
            <PortfolioGrid netLiquidationValue={130000} positions={positions} />
          </DashboardWidget>
        </main >
      </div >
    </EnsureIbkrConnection >
  );
}
