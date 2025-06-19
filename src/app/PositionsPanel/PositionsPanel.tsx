import { FC } from "react"
import { condColor, formatNumber } from "../utils"

type PositionsPanelProps = {
  positions: any[]
}

const PositionsPanel: FC<PositionsPanelProps> = ({ positions }) => {

  const extractExchange = (position: any) => {
    if (['NYSE', 'NASDAQ'].includes(position.listingExchange)) return position.listingExchange
    return position.allExchanges.split(',')[0]
  }

  return (
    <table className="min-w-full text-left border-collapse text-gray-800">
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
            if (a.unrealizedPnl > b.unrealizedPnl) return -1;
            if (a.unrealizedPnl < b.unrealizedPnl) return 1;
            return 0;
          })
          .filter(position => position.position > 0)
          .map((position) => (
            <tr key={position.conid} className="border-b last:border-0 hover:bg-gray-50 text-sm">
              <td className="px-4 py-3 font-semibold">
                <a className="" target="_blank" rel="noopener noreferrer" href={`https://www.tradingview.com/symbols/${extractExchange(position)}-${position.contractDesc}/`}>{position.contractDesc}</a>
              </td>
              <td className="px-4 py-3 text-center">{position.position}</td>
              <td className="px-4 py-3 text-right">{formatNumber(position.mktValue)}</td>
              <td className={`px-4 py-3 text-right ${condColor(position.unrealizedPnl)}`}>{formatNumber(position.unrealizedPnl)}</td>
              <td className="px-4 py-3 text-right">{formatNumber(position.mktPrice)}</td>
            </tr>
          ))}
      </tbody>
    </table>

    // <Table>
    //   <TableHeader>
    //     <TableRow>
    //       <TableHead className="w-[100px]">Ticker</TableHead>
    //       <TableHead className="text-center">Pos</TableHead>
    //       <TableHead className="text-right">Mkt Val</TableHead>
    //       <TableHead className="text-right">Unrlzd P&L</TableHead>
    //       <TableHead className="text-right">Mkt Price</TableHead>
    //     </TableRow>
    //   </TableHeader>
    //   <TableBody>
    //     {positions
    //       .sort((a, b) => {
    //          if (a.unrealizedPnl > b.unrealizedPnl) return -1;
    //          if (a.unrealizedPnl < b.unrealizedPnl) return 1;
    //           return 0;
    //       })
    //       .filter(position => position.position > 0)
    //       .map((position) => (
    //       <TableRow key={position.conid}>
    //         <TableCell className="font-medium">{position.contractDesc}</TableCell>
    //         <TableCell className="font-light text-center">{position.position}</TableCell>
    //         <TableCell className="font-light text-right">{formatNumber(position.mktValue)}</TableCell>
    //         <TableCell className="font-light text-right">{formatNumber(position.unrealizedPnl)}</TableCell>
    //         <TableCell className="font-light text-right">{formatNumber(position.mktPrice)}</TableCell>
    //       </TableRow>
    //     ))}
    //   </TableBody>
    // </Table>
  )
}

export default PositionsPanel