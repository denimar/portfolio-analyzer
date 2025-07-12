import { FC, useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';

type Portfolio = {
  id: string;
  name: string;
  notes: string;
  items: any[];
};

type PortfolioSelectorProps = {
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  onPortfolioChange: (portfolioId: string) => void;
};

const PortfolioSelector: FC<PortfolioSelectorProps> = ({ 
  portfolios, 
  selectedPortfolioId, 
  onPortfolioChange 
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId);

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
      {/* Portfolio Selection */}
      <div className="flex items-center gap-3 min-w-fit">
        <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
          Portfolio Strategy:
        </label>
        <div className="relative">
          <select
            value={selectedPortfolioId}
            onChange={(e) => onPortfolioChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[220px] shadow-sm hover:border-gray-400 transition-colors"
          >
            {portfolios.map((portfolio) => (
              <option key={portfolio.id} value={portfolio.id}>
                {portfolio.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Portfolio Description with Tooltip */}
      {selectedPortfolio && (
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Info 
                className="h-4 w-4 text-blue-600 cursor-help hover:text-blue-700 transition-colors"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              />
              {showTooltip && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-3 bg-white border border-gray-200 text-gray-800 text-sm rounded-lg shadow-xl max-w-sm z-50 min-w-64">
                  <div className="relative">
                    <div className="font-medium text-gray-900 mb-1">Strategy Overview</div>
                    <div className="text-gray-700 leading-relaxed">
                      {selectedPortfolio.notes}
                    </div>
                    {/* Tooltip arrow pointing up */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-transparent border-b-white"></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-b-6 border-transparent border-b-gray-200 -mb-1"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioSelector; 