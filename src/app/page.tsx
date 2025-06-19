"use client";

import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";
import { useState } from "react";
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

export default function Home() {
  const [currentTab, setCurrentTab] = useState<string>("my_allocation");
  const [positions, setPositions] = useState<any[]>([]);
  const [accountSummary, setAccountSummary] = useState<any>({});
  const [watchLists, setWatchLists] = useState<any>([]);

  const loadInitialData = async () => {
    const [fetchedPositions, fetchedAccountSummary, fetchedWatchLists] = await Promise.all([
      axios.get('/api/ibkr/positions').then(res => res.data),
      axios.get('/api/ibkr/account/summary').then(res => res.data),
      axios.get('/api/ibkr/watchlist').then(res => res.data)
    ]);
    setPositions(fetchedPositions);
    setAccountSummary(fetchedAccountSummary);
    setWatchLists(fetchedWatchLists);
  }

  const onIbkrConnected = async () => {
    loadInitialData();
  }

  return (
    <EnsureIbkrConnection onConnect={onIbkrConnected}>
      <AppHeader accountSummary={accountSummary} />
      <div className="p-2">
        <Tabs defaultValue="my_allocation">
          <TabsList>
            <TabsTrigger value="my_allocation">Allocation</TabsTrigger>
            <TabsTrigger value="allocation_strategy">Strategy</TabsTrigger>
            <TabsTrigger value="positions">Positions</TabsTrigger>
          </TabsList>
          <TabsContent value='my_allocation'>
            <AllocationGraph totalCash={accountSummary.totalCash} positions={positions} watchLists={watchLists} />
          </TabsContent>
          <TabsContent value='allocation_strategy'>
            <PortfolioGrid totalCash={accountSummary.totalCash} positions={positions} watchLists={watchLists} />
          </TabsContent>
          <TabsContent value='positions'>
            <PositionsPanel positions={positions} />
          </TabsContent>
        </Tabs>
      </div>
    </EnsureIbkrConnection >
  );
}
