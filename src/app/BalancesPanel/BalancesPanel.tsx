import { FC } from "react"
import { condColor, formatNumber } from "../utils"

type BalancesPanelProps = {
  balances: {
    totalCash: number
    netLiquidation: number
    dailyPNL: number
    unrealizedPNL: number
    realizedPNL: number
  }
}

const BalancesPanel: FC<BalancesPanelProps> = ({ balances }) => {

  const fieldRender = (label: string, value: number, shouldSetColors: boolean = false) => {
    return (
      <div className="flex flex-row items-center gap-2 text-gray-700 border-b border-b-gray-100 py-1 w-full">
        <div className="w-[165px] text-right">{label}:</div>
        <div className={`font-semibold ${shouldSetColors ? condColor(value) : ''}`}>{formatNumber(value || 0)}</div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col items-center gap-2 pt-8">
        {fieldRender("Total Cash", balances.totalCash)}
        {fieldRender("Net Liquidation", balances.netLiquidation)}
        {fieldRender("Daily P&L", balances.dailyPNL, true)}
        {fieldRender("Unrealized P&L", balances.unrealizedPNL, true)}
        {fieldRender("Realized P&L", balances.realizedPNL, true)}        
      </div>
    </div>
  )
}

export default BalancesPanel