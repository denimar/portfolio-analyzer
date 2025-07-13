import { condColor, formatNumber } from "@/app/utils";
import { FC } from "react";
import PortfolioSelector from "../PortfolioSelector";
import IbkrStatus from "../IbkrStatus";

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
    <div className="shadow-lg border-b border-b-slate-200 z-20 bg-white">
      
      {/* Account Summary Row */}
      <div className="flex flex-row items-center justify-between pr-10 pl-6 py-4 min-h-[60px]">
        <PortfolioSelector 
          portfolios={portfolios}
          selectedPortfolioId={selectedPortfolioId}
          onPortfolioChange={onPortfolioChange}
        />

        <div className="flex flex-1 flex-row gap-8 items-center justify-end text-sm min-h-[40px] pr-4">
          <div className="flex flex-col items-end">
            <div className="text-slate-500 text-xs font-medium">Total Cash</div>
            <div className="font-semibold text-slate-900">{formatNumber(accountSummary.totalCash)}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-slate-500 text-xs font-medium">Net Liquidation Value</div>
            <div className="font-semibold text-slate-900">{formatNumber(accountSummary.netLiquidationValue)}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-slate-500 text-xs font-medium">Daily P&L</div>
            <div className={`font-semibold ${condColor(accountSummary.dailyPnL)}`}>
              {accountSummary.dailyPnL > 0 ? '+' : ''}{formatNumber(accountSummary.dailyPnL)}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-slate-500 text-xs font-medium">Unrealized P&L</div>
            <div className={`font-semibold ${condColor(accountSummary.unrealizedPnL)}`}>
              {accountSummary.unrealizedPnL > 0 ? '+' : ''}{formatNumber(accountSummary.unrealizedPnL)}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-slate-500 text-xs font-medium">Realized P&L</div>
            <div className={`font-semibold ${condColor(accountSummary.realizedPnL)}`}>
              {accountSummary.realizedPnL > 0 ? '+' : ''}{formatNumber(accountSummary.realizedPnL)}
            </div>
          </div>
          <div className="ml-6">
            <IbkrStatus className="mb-2" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppHeader