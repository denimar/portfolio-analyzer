import { FC } from 'react';
import { ChevronDown } from 'lucide-react';

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
    <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg border">
      <label className="text-sm font-medium text-gray-700">Portfolio Strategy:</label>
      <div className="relative">
        <select
          value={selectedPortfolioId}
          onChange={(e) => onPortfolioChange(e.target.value)}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px]"
        >
          {portfolios.map((portfolio) => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
      {selectedPortfolio && (
        <div className="text-xs text-gray-600 max-w-md">
          {selectedPortfolio.notes}
        </div>
      )}
    </div>
  );
};

export default PortfolioSelector; 