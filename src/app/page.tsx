"use client";

import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";
import LoginPopup from "./components/LoginPopup";
import { ibkrApi } from "./utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [positions, setPositions] = useState<any[]>([]);

  const loadPositions = async () => {
    const positionsResp: any = await ibkrApi({ endpoint: '/portfolio/U13793951/positions/0' });    
    debugger
    setPositions(positionsResp.positions || []);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)] w-full h-full bg-gray-50 text-gray-100">
      <main className="flex flex-col gap-6 sm:gap-8 row-start-2 items-center sm:items-start w-full h-full max-w-screen-xl ">
        <LoginPopup />
        <Button onClick={() => loadPositions()}>Load Positions</Button>
        <div>
          <pre>
            <code>
              {JSON.stringify(positions, null, 2)}
            </code>
          </pre>
        </div>
        <PortfolioGrid netLiquidationValue={130000} />
      </main>
    </div>
  );
}
