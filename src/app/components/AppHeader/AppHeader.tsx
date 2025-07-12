import { condColor, formatNumber } from "@/app/utils";
import { FC } from "react";
import PortfolioSelector from "../PortfolioSelector";

type Portfolio = {
  id: string;
  name: string;
  notes: string;
  items: any[];
};

type AppHeaderProps = {
  accountSummary: any;
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  onPortfolioChange: (portfolioId: string) => void;
}

const AppHeader: FC<AppHeaderProps> = ({ 
  accountSummary, 
  portfolios, 
  selectedPortfolioId, 
  onPortfolioChange 
}) => {
  return (
    <div className="shadow-lg border-b border-b-sky-200 z-20 bg-sky-50">
      {/* Portfolio Selector Row */}
      <div className="px-6 py-3 border-b border-b-sky-200">
        <PortfolioSelector 
          portfolios={portfolios}
          selectedPortfolioId={selectedPortfolioId}
          onPortfolioChange={onPortfolioChange}
        />
      </div>
      
      {/* Account Summary Row */}
      <div className="flex flex-row items-center justify-between pr-10 pl-6 py-3 min-h-[50px]">
        <div className="flex flex-1 flex-row gap-10 items-center justify-end text-xs min-h-[32px] pr-16">
          <div className="flex flex-col">
            <div className="font-semibold">Total Cash</div>
            <div>{formatNumber(accountSummary.totalCash)}</div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">Net Liquidation Value</div>
            <div>{formatNumber(accountSummary.netLiquidationValue)}</div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">Daily P&L</div>
            <div className={`${condColor(accountSummary.dailyPNL)}`}>{accountSummary.dailyPNL > 0 ? '+' : ''}{formatNumber(accountSummary.dailyPNL)}</div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">Unrealized P&L</div>
            <div className={`${condColor(accountSummary.unrealizedPNL)}`}>{accountSummary.unrealizedPNL > 0 ? '+' : ''}{formatNumber(accountSummary.unrealizedPNL)}</div>
          </div>
          <div className="flex flex-col">
            <div className="font-semibold">Realized P&L</div>
            <div className={`${condColor(accountSummary.realizedPNL)}`}>{accountSummary.realizedPNL > 0 ? '+' : ''}{formatNumber(accountSummary.realizedPNL)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppHeader