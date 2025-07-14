import { FC } from "react"
import { condColor, formatNumber } from "../utils"

type PositionsPanelProps = {
  positions: any[]
}

const PositionsPanel: FC<PositionsPanelProps> = ({ positions }) => {

  const extractExchange = (position: any) => {
    // if (['NYSE', 'NASDAQ'].includes(position.listingExchange)) return position.listingExchange
    // return position.allExchanges.split(',')[0]
    return 'NASDAQ'
  }

  if (positions.length > 0) {
    debugger;
  }

  return (
    <table className="min-w-full text-left border-collapse text-gray-800 bg-white">
      <thead>
        <tr className="font-semibold text-xs border-b border-b-gray-300">
          <th className="px-4 py-3">Ticker</th>
          <th className="px-4 py-3 text-center">Pos</th>
          <th className="px-4 py-3 text-right">Mkt Val</th>
          <th className="px-4 py-3 text-right">Unrlzd P&L</th>
          <th className="px-4 py-3 text-right">Mkt Price</th>
        </tr>
      </thead>
      <tbody>
        {positions
          .sort((a, b) => {
            if (a.unrealizedPnL > b.unrealizedPnL) return -1;
            if (a.unrealizedPnL < b.unrealizedPnL) return 1;
            return 0;
          })
          .filter(position => position.pos > 0)
          .map((position) => (
            <tr key={position.symbol} className="border-b last:border-0 hover:bg-gray-50 text-sm">
              <td className="px-4 py-3 font-semibold">
                <a className="" target="_blank" rel="noopener noreferrer" href={`https://www.tradingview.com/symbols/${position.exchange}-${position.symbol}/`}>{position.symbol}</a>
              </td>
              <td className="px-4 py-3 text-center">{position.pos}</td>
              <td className="px-4 py-3 text-right">{formatNumber(position.marketValue)}</td>
              <td className={`px-4 py-3 text-right ${condColor(position.unrealizedPnL)}`}>{formatNumber(position.unrealizedPnL)}</td>
              <td className="px-4 py-3 text-right">{formatNumber(position.currentPrice)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}

export default PositionsPanel