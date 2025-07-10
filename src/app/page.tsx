"use client";

import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";
import { useState, useCallback, useEffect, useTransition, Suspense } from "react";
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
import expectedAllocationJSON from "./components/portfolio-grid/expectedAllocation.json";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader } from "lucide-react";

// Local storage key for portfolio selection
const PORTFOLIO_STORAGE_KEY = 'portfolio-analyzer-selected-portfolio';

// Helper function to safely get item from localStorage
const getStoredPortfolioId = (): string => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      return stored || "50"; // Default to Defensive Portfolio if nothing stored
    }
  } catch (error) {
    console.warn('localStorage not available:', error);
  }
  return "50"; // Default fallback
};

// Helper function to safely save to localStorage
const savePortfolioId = (portfolioId: string): void => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(PORTFOLIO_STORAGE_KEY, portfolioId);
    }
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
};

// Main content component that uses useSearchParams
function HomeContent() {
  const [positions, setPositions] = useState<any[]>([]);
  const [accountSummary, setAccountSummary] = useState<any>({});
  const [activeTab, setActiveTab] = useState("my_allocation");
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string>(() => getStoredPortfolioId());
  const [isPending, startTransition] = useTransition()
  
  const searchParams = useSearchParams();
  const router = useRouter();

  // Map URL query values to tab values
  const tabMapping = {
    "allocation": "my_allocation",
    "strategy": "allocation_strategy", 
    "positions": "positions",
    "performance": "performance"
  };

  // Get the selected portfolio data
  const selectedPortfolio = expectedAllocationJSON.find(item => item.id === selectedPortfolioId);
  
  // Transform the portfolio data for components
  const expectedAllocation = selectedPortfolio?.items.map(item => ({  
    category: item.category,
    allocation: item.allocation,
    notes: item.notes,
    items: item.tickers.map(ticker => ({
      ticker: ticker.name,
      description: ticker.description,
      isETF: ticker.isETF
    }))
  })) || [];

  // Initialize tab from URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabMapping[tabParam as keyof typeof tabMapping]) {
      setActiveTab(tabMapping[tabParam as keyof typeof tabMapping]);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Find the URL key for this tab value
    const urlKey = Object.keys(tabMapping).find(key => tabMapping[key as keyof typeof tabMapping] === value);
    
    if (urlKey) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", urlKey);
      router.push(`?${params.toString()}`);
    }
  };

  const handlePortfolioChange = (portfolioId: string) => {
    setSelectedPortfolioId(portfolioId);
    savePortfolioId(portfolioId);
  };

  const loadInitialData = useCallback(async () => {
    startTransition(async () => {
      const [fetchedPositions, fetchedAccountSummary] = await Promise.all([
        axios.get('/api/ibkr/positions').then(res => res.data),
        axios.get('/api/ibkr/account/summary').then(res => res.data),
      ]);
      setPositions(fetchedPositions);
      setAccountSummary(fetchedAccountSummary);
    });
  }, []);

  const onIbkrConnected = useCallback(async () => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <EnsureIbkrConnection onConnect={onIbkrConnected}>
      <AppHeader 
        accountSummary={accountSummary}
        portfolios={expectedAllocationJSON}
        selectedPortfolioId={selectedPortfolioId}
        onPortfolioChange={handlePortfolioChange}
      />
      {
        isPending ? <div className="flex items-center justify-center h-screen"><Loader className="animate-spin h-6 w-6" /></div> : (
          <div className="p-2">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
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
                <div className="p-4">Performance (Coming soon..)</div>
              </TabsContent>
            </Tabs>
          </div>
        )
      }
    </EnsureIbkrConnection >
  );
}

// Loading fallback component
function HomeLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin h-6 w-6" />
    </div>
  );
}

// Main page component with Suspense boundary
export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
