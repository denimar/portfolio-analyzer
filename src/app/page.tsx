import PortfolioGrid from "./components/portfolio-grid/PortfolioGrid";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-8 sm:gap-16 font-[family-name:var(--font-geist-sans)] w-full h-full">
      <main className="flex flex-col gap-6 sm:gap-8 row-start-2 items-center sm:items-start w-full h-full max-w-screen-xl border-r border-r-gray-100 border-l border-l-gray-100 ">
        <PortfolioGrid />
      </main>
    </div>
  );
}
