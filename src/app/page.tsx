"use client";

import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";
import { useState, useCallback, useEffect, useTransition, Suspense } from "react";
import axios from "axios";
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
import LoadingSkeleton from "./components/LoadingSkeleton";
import AppHeaderSkeleton from "./components/AppHeaderSkeleton";

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

  useEffect(() => {
    startTransition(async () => {
      const [fetchedPositions, fetchedAccountSummary] = await Promise.all([
        axios.get('https://denimarlab.pro/api/positions').then(res => res.data.data),
        axios.get('https://denimarlab.pro/api/accounts-summary').then(res => res.data),
      ]);
      setPositions(fetchedPositions);
      setAccountSummary(fetchedAccountSummary);
    });
  }, []);

  return (
    <>
      {isPending ? (
        <>
          <AppHeaderSkeleton />
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader className="animate-spin h-10 w-10 text-slate-400" />
          </div>
        </>
      ) : (
        <>
          <AppHeader 
            accountSummary={accountSummary}
            portfolios={expectedAllocationJSON}
            selectedPortfolioId={selectedPortfolioId}
            onPortfolioChange={handlePortfolioChange}
          />
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-lg">
                <TabsTrigger 
                  value="my_allocation" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 rounded-md transition-all duration-200"
                >
                  Allocation
                </TabsTrigger>
                <TabsTrigger 
                  value="allocation_strategy"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 rounded-md transition-all duration-200"
                >
                  Strategy
                </TabsTrigger>
                <TabsTrigger 
                  value="positions"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 rounded-md transition-all duration-200"
                >
                  Positions
                </TabsTrigger>
                <TabsTrigger 
                  value="performance"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900 data-[state=inactive]:text-slate-600 rounded-md transition-all duration-200"
                >
                  Performance
                </TabsTrigger>
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
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Performance Analytics</h3>
                  <p className="text-slate-600 max-w-md">Track your portfolio performance over time with detailed analytics, charts, and insights. Coming soon!</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </>
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
