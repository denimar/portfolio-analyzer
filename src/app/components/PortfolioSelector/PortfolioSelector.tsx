import { FC } from 'react';
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
  const selectedPortfolio = portfolios.find(p => p.id === selectedPortfolioId);

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-sky-50 to-sky-100 rounded-lg border border-sky-200 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
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

        {/* Portfolio Description */}
        {selectedPortfolio && (
          <div className="flex-1">
            <div className="flex items-start gap-2 mb-2">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <h3 className="text-sm font-semibold text-gray-800">
                {selectedPortfolio.name} Strategy
              </h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed pl-6">
              {selectedPortfolio.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSelector; 