import portfolio from './portfolio.json';

const PortfolioGrid = () => {

  function formatCurrency(amount: number) {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  }

  return (
    <div className="overflow-x-auto bg-white p-6 rounded-2xl shadow-md">
      <table className="min-w-full text-left border-collapse text-gray-800">
        <thead>
          <tr className="font-semibold text-xs border-b">
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-center">Allocation</th>
            <th className="px-4 py-3 text-right">Amount (USD)</th>
            <th className="px-4 py-3">Suggested Assets</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((row) => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50 text-xs">
              <td className="px-4 py-3">{row.category}</td>
              <td className="px-4 py-3 text-center">{row.allocation}%</td>
              <td className="px-4 py-3 text-right">{formatCurrency(row.amount)}</td>
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