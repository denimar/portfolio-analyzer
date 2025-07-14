'use client'

import { formatNumber } from '@/app/utils'
import React, { FC } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'

const renderBarLabel = (netLiquidationValue: number, props: any) => {
  const { x, y, width, value } = props
  const line1 = `${value.toFixed(1)}%`
  const line2 = formatNumber(netLiquidationValue * (value / 100)) // Example calculation for the second line
  return (
    <text
      x={x + width / 2}
      y={y - 20} // shift upward to make space for both lines
      fill="#374151"
      fontSize={12}
      fontWeight={500}
      textAnchor="middle"
      fontFamily="Inter, Helvetica Neue, sans-serif"
    >
      <tspan x={x + width / 2} dy="0">{line1}</tspan>
      <tspan 
        x={x + width / 2} 
        dy="14"
        fontSize={9}
      >
        {line2}
      </tspan> {/* Adjust line height */}
    </text>
  )
}
type AllocationGraphProps = {
  totalCash: number;
  positions: any[]
  expectedAllocation: any[]
}

const getActualAllocation = (netLiquidationValue: number, positions: any[], expectedAllocation: any): number => {
  const totalInCategory = positions.reduce((acc, pos) => {
    const itemsInCategory = expectedAllocation.items.filter((itm: any) => itm.ticker === pos.symbol);
    const totalPosValue = itemsInCategory.reduce((itemAcc: number) => itemAcc + (pos.currentPrice * (pos.pos || 0)), 0);
    acc += totalPosValue;
    return acc;
  }, 0);
  return totalInCategory / netLiquidationValue * 100;
}

const AllocationGraph: FC<AllocationGraphProps> = ({ totalCash, positions, expectedAllocation }) => {

  const netLiquidationValue = totalCash + positions.reduce((acc, pos) => acc + (pos.currentPrice * (pos.pos || 0)), 0);

  const getUncategorizedPositions = () => {
    return positions.filter(pos => {
      if (pos.pos === 0) return false; // Skip positions with zero quantity
      const hasPositionsInCategory = expectedAllocation.some(wl => {
        return wl.items.some((itm: any) => itm.ticker === pos.symbol);
      });
      return !hasPositionsInCategory;
    });
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const category = payload[0].payload.category
      const isUncategorized = category === "Uncategorized"      
      const watchList = expectedAllocation.find(wl => wl.category === category)
      const items = isUncategorized ? getUncategorizedPositions() : watchList ? positions.filter(pos => pos.pos > 0 && watchList.items.some((wli: any) => pos.symbol === wli.ticker)) : [];
      
      return (
        <div className="bg-sky-50 border rounded shadow text-sm">
          <div className="font-semibold border-b border-b-blue-200 mb-2 p-2 text-base text-sky-900">{payload[0].payload.category}</div>
          <table>
            <tr>
              <td className="w-[65px] pr-4 font-semibold py-1 px-2">Expected:</td>
              <td className='w-[50px] text-right py-1 px-2'>{payload[0].payload.expected.toFixed(1)}%</td>
              <td className='w-[100px] text-right py-1 px-2'>{formatNumber(netLiquidationValue * payload[0].payload.expected / 100)}</td>
            </tr>
            <tr>
              <td className="w-[65px] pr-4 font-semibold py-1 px-2">Actual:</td>
              <td className='w-[50px] text-right py-1 px-2'>{payload[0].payload.actual.toFixed(1)}%</td>
              <td className='w-[100px] text-right py-1 px-2'>{formatNumber(netLiquidationValue * payload[0].payload.actual / 100)}</td>
            </tr>
            {
              items.length > 0 && (
                <tr className='bg-white'>
                  <td colSpan={3} className='pt-2 pb-2 px-0'>
                    <table className='w-full'>
                      {
                        items.map(pos => (
                          <tr key={pos.symbol} className='text-gray-600'>
                            <td className="w-[65px] pr-4 px-2">
                              <a href={`https://finance.yahoo.com/quote/${pos.symbol}`} target="_blank" rel="noopener noreferrer">
                                {(pos.symbol || '').replaceAll(",", ", ")}
                              </a>
                            </td>
                            <td className='w-[65px] text-right py-1 px-2'>{((pos.marketValue || 0) / netLiquidationValue * 100).toFixed(1)}%</td>
                            <td className='w-[100px] text-right px-2'>{formatNumber(pos.marketValue)}</td>
                          </tr>
                        ))
                      }
                    </table>
                  </td>
                </tr>
              )
            }
          </table>
        </div>
      )
    }
    return null
  }

  const uncategorizedAllocation = positions.filter(pos => {
    const hasPositionsInCategory = expectedAllocation.some(wl => {
      return wl.items.some((itm: any) => itm.ticker === pos.symbol);
    });
    return !hasPositionsInCategory;
  });
  const uncategorizedAllocationValue = uncategorizedAllocation.reduce((acc, wl) => acc + wl.marketValue, 0);
  const categorizedData = expectedAllocation.map(wl => {
    const actualAllocation = getActualAllocation(netLiquidationValue, positions, wl);
    return {
      category: wl.category,
      expected: wl.allocation,
      actual: actualAllocation
    }
  });
  
  const uncategorizedData = [{
    category: "Uncategorized",
    expected: 0,
    actual: uncategorizedAllocationValue * 100 / netLiquidationValue
  }];
  
  const data = [...categorizedData, ...uncategorizedData];

  // Calculate top 2 BUY categories (actual < expected, not Uncategorized)
  const buyCategories = data
    .filter(item => item.category !== "Uncategorized" && item.actual < item.expected)
    .map(item => ({
      ...item,
      buyAmount: netLiquidationValue * (item.expected - item.actual) / 100
    }))
    .sort((a, b) => b.buyAmount - a.buyAmount)
    .slice(0, 3);

  return (
    <div className="flex flex-1 w-full absolute h-[calc(100%-180px)] pt-4">
      <div className="flex flex-col w-full">
        {/* Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <defs>
                <linearGradient id="expectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="uncategorizedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} horizontal={false} strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis
                dataKey="category"
                angle={-30}
                textAnchor="end"
                interval={0}
                height={90}
                tick={{
                  fontSize: 12,
                  fontFamily: 'Inter, Helvetica Neue, sans-serif',
                  fill: '#374151',
                  fontWeight: 300
                }}
              />
              <YAxis hide={true} />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="top" 
                height={36}
                wrapperStyle={{
                  fontSize: '12px',
                  fontFamily: 'Inter, Helvetica Neue, sans-serif',
                  fontWeight: 300
                }}
              />
              <Bar 
                dataKey="expected" 
                name="Expected %" 
                fill="url(#expectedGradient)" 
                radius={[4, 4, 0, 0]} 
                label={(props) => renderBarLabel(netLiquidationValue, props)} 
              />
              <Bar 
                dataKey="actual" 
                name="Actual %" 
                fill="url(#actualGradient)" 
                radius={[4, 4, 0, 0]} 
                label={(props) => renderBarLabel(netLiquidationValue, props)} 
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.category === "Uncategorized" ? "url(#uncategorizedGradient)" : "url(#actualGradient)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* BUY Categories Below Chart */}
        {buyCategories.length > 0 && (
          <div className="flex flex-row justify-center gap-8 mt-8">
            {buyCategories.map((item, idx) => (
              <div key={item.category} className="p-4 bg-white rounded-lg border border-emerald-200 shadow-sm min-w-[220px] text-center">
                <div className="font-medium text-slate-800 text-base mb-1">{item.category}</div>
                <div className="text-emerald-600 text-lg font-bold">BUY</div>
                <div className="text-emerald-700 text-base font-semibold mt-1">{formatNumber(item.buyAmount)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AllocationGraph
