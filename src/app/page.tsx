"use client";

import { Button } from "@/components/ui/button";
import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";
import { redirect } from "next/navigation";

export default function Home() {

  const onClickLogin = () => {
    redirect("/login");
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)] w-full h-full bg-gray-50 text-gray-100">
      <main className="flex flex-col gap-6 sm:gap-8 row-start-2 items-center sm:items-start w-full h-full max-w-screen-xl ">
        <Button onClick={onClickLogin}>
          Login
        </Button>
        <PortfolioGrid netLiquidationValue={130000} />
      </main>
    </div>
  );
}
