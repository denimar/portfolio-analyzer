import { FC } from 'react';
import portfolio from './portfolio.json';
import { formatNumber } from '@/app/utils';

type PortfolioGridProps = {
  netLiquidationValue: number;
}

const PortfolioGrid: FC<PortfolioGridProps> = ({ netLiquidationValue }) => {

  return (
    <div className="overflow-x-auto bg-white py-2 px-6 rounded-2xl shadow-md border-t border-t-gray-200 w-full">
      <table className="min-w-full text-left border-collapse text-gray-800">
        <thead>
          <tr className="font-semibold text-xs border-b border-b-gray-300">
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-center">Expected Allocation</th>
            <th className="px-4 py-3 text-center">Actual Allocation</th>            
            <th className="px-4 py-3">Suggested Assets</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((row) => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50 text-xs">
              <td className="px-4 py-3 font-semibold">{row.category}</td>
              <td className="px-4 py-3 text-right">{formatNumber(netLiquidationValue * row.allocation / 100)} - {row.allocation.toString()}%</td>
              <td className="px-4 py-3 text-right">{formatNumber(netLiquidationValue * row.allocation / 100)} - {row.allocation.toString()}%</td>              
              <td className="px-4 py-3">{row.suggestedAssets.replaceAll(",", ", ")}</td>
              <td className="px-4 py-3 text-gray-600">{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PortfolioGrid;