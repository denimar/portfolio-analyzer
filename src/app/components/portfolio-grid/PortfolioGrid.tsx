import { FC } from 'react';

type PortfolioGridProps = {
  expectedAllocation: any[]
}

const PortfolioGrid: FC<PortfolioGridProps> = ({ expectedAllocation }) => {
  if (expectedAllocation.length > 0) {
    const aloc = expectedAllocation.map(wl => {
      return {
        category: wl.category,
        expected: wl.allocation,
        actual: wl.allocation + Math.random() * 10 - 5,
      }
    })
  }

  return (
    <div className="overflow-x-auto bg-white px-6full">
      <table className="min-w-full text-left border-collapse text-gray-800">
        <thead>
          <tr className="font-semibold text-xs border-b border-b-gray-300">
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3 text-center">Allocation</th>
            <th className="px-4 py-3">Suggested Assets</th>
            <th className="px-4 py-3">Notes</th>
          </tr>
        </thead>
        <tbody>
          {expectedAllocation.map((row) => (
            <tr key={row.id} className="border-b last:border-0 hover:bg-gray-50 text-xs">
              <td className="px-4 py-3 font-semibold">{row.category}</td>
              <td className="px-4 py-3 text-center">{row.allocation.toString()}%</td>
              <td className="px-4 py-3">{row.items.map((itm: any) => (itm.ticker || '').replaceAll(",", ", ")).join(', ')}</td>
              <td className="px-4 py-3 text-gray-600">{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/*
      <div className='w-full flex flex-col items-center text-sky-900 border-t border-t-sky-200 p-4 bg-sky-50 h-full'>
        <div className='w-[750px]'>
          <div className='w-full font-bold text-lg text-center'>Dollar Cost Averaging (DCA)</div>
          <div className='mt-2 w-full flex flex-col space-y-1 p-2 items-center'>
            <span className='font-semibold mr-2'>Rules:</span>
            <span>1. Long-term investment.</span>
            <span>2. Monthly contributions</span>
            <span>3. Indicators: EMA 100, Bollinger Bands and Stochastic RSI</span>
          </div>
          <div className='mt-2 w-full flex flex-col space-y-1 p-2 items-center'>
            <span className='font-semibold mr-2'>Only Buy When:</span>
            <span>1. Stochastic RSI is oversold.</span>
            <span>2. Price is bellow or close to EMA 100</span>
            <span>3. Price is bellow Bollinger Lower Band</span>
          </div>
          <div className='mt-2 w-full flex flex-col space-y-1 p-2 items-center'>
            <span className='font-semibold mr-2'>Only Sell When:</span>
            <span>1. Price is above Bollinger Upper Band</span>
          </div>
        </div>
      </div>
      */}
    </div>
  );
}

export default PortfolioGrid;