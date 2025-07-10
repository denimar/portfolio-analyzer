"use client";

import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";
import { useState, useCallback } from "react";
import axios from "axios";
import EnsureIbkrConnection from "./components/ensure-ibkr-connection";
import PositionsPanel from "./PositionsPanel/PositionsPanel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import AppHeader from "./components/AppHeader";
import AllocationGraph from "./components/AllocationGraph";
import expectedAllocation from "./components/portfolio-grid/expectedAllocation.json";

export default function Home() {
  const [positions, setPositions] = useState<any[]>([]);
  const [accountSummary, setAccountSummary] = useState<any>({});

  const loadInitialData = useCallback(async () => {
    const [fetchedPositions, fetchedAccountSummary] = await Promise.all([
      axios.get('/api/ibkr/positions').then(res => res.data),
      axios.get('/api/ibkr/account/summary').then(res => res.data),
    ]);
    setPositions(fetchedPositions);
    setAccountSummary(fetchedAccountSummary);
  }, []);

  const onIbkrConnected = useCallback(async () => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <EnsureIbkrConnection onConnect={onIbkrConnected}>
      <AppHeader accountSummary={accountSummary} />
      <div className="p-2">
        <Tabs defaultValue="my_allocation">
          <TabsList>
            <TabsTrigger value="my_allocation">Allocation</TabsTrigger>
            <TabsTrigger value="allocation_strategy">Strategy</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value='my_allocation'>
            <AllocationGraph totalCash={accountSummary.totalCash} positions={positions} expectedAllocation={expectedAllocation} />
          </TabsContent>
          <TabsContent value='allocation_strategy'>
            <PortfolioGrid expectedAllocation={expectedAllocation} />
          </TabsContent>
          <TabsContent value='positions'>
            <PositionsPanel positions={positions} />
          </TabsContent>
          <TabsContent value='performance'>
            <div className="p-4">Performance (Coming soon...)</div>
          </TabsContent>
        </Tabs>
      </div>
    </EnsureIbkrConnection >
  );
}
