import { FC } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatNumber } from "../utils"

type PositionsPanelProps = {
  positions: any[]
}

const PositionsPanel: FC<PositionsPanelProps> = ({ positions }) => {

  console.log('-----------------------')
  console.log(positions)
  console.log('-----------------------')

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Ticker</TableHead>
          <TableHead className="text-center">Pos</TableHead>
          <TableHead className="text-right">Avg Cost</TableHead>
          <TableHead className="text-right">Mkt Val</TableHead>
          <TableHead className="text-right">Unrlzd P&L</TableHead>
          <TableHead className="text-right">Mkt Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {positions
          .sort((a, b) => {
             if (a.unrealizedPnl > b.unrealizedPnl) return -1;
             if (a.unrealizedPnl < b.unrealizedPnl) return 1;
              return 0;
          })
          .filter(position => position.position > 0)
          .map((position) => (
          <TableRow key={position.conid}>
            <TableCell className="font-medium">{position.contractDesc}</TableCell>
            <TableCell className="font-light text-center">{position.position}</TableCell>
            <TableCell className="font-light text-right">{formatNumber(position.avgCost)}</TableCell>
            <TableCell className="font-light text-right">{formatNumber(position.mktValue)}</TableCell>
            <TableCell className="font-light text-right">{formatNumber(position.unrealizedPnl)}</TableCell>
            <TableCell className="font-light text-right">{formatNumber(position.mktPrice)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default PositionsPanel