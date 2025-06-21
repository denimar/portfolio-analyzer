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
  ResponsiveContainer
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
  watchLists: any[]
}

const getActualAllocation = (netLiquidationValue: number, positions: any[], watchList: any): number => {
  const totalInCategory = positions.reduce((acc, pos) => {
    const itemsInCategory = watchList.items.filter((itm: any) => itm.ticker === pos.contractDesc);
    const totalPosValue = itemsInCategory.reduce((itemAcc: number) => itemAcc + (pos.mktPrice * (pos.position || 0)), 0);
    acc += totalPosValue;
    return acc;
  }, 0);
  return totalInCategory / netLiquidationValue * 100;
}

const AllocationGraph: FC<AllocationGraphProps> = ({ totalCash, positions, watchLists }) => {

  const netLiquidationValue = totalCash + positions.reduce((acc, pos) => acc + (pos.mktPrice * (pos.position || 0)), 0);

  const getUncategorizedPositions = () => {
    return positions.filter(pos => {
      if (pos.position === 0) return false; // Skip positions with zero quantity
      const hasPositionsInCategory = watchLists.some(wl => {
        return wl.items.some((itm: any) => itm.ticker === pos.contractDesc);
      });
      return !hasPositionsInCategory;
    });
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const category = payload[0].payload.category
      const isUncategorized = category === "Uncategorized"      
      const watchList = watchLists.find(wl => wl.category === category)
      const items = isUncategorized ? getUncategorizedPositions() : watchList ? positions.filter(pos => pos.position > 0 && watchList.items.some((wli: any) => pos.contractDesc === wli.ticker)) : [];
      
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
                          <tr key={pos.contractDesc} className='text-gray-600'>
                            <td className="w-[65px] pr-4 px-2">{pos.contractDesc}</td>
                            <td className='w-[65px] text-right py-1 px-2'>{((pos.mktPrice * (pos.position || 0)) / netLiquidationValue * 100).toFixed(1)}%</td>
                            <td className='w-[100px] text-right px-2'>{formatNumber(pos.mktPrice * (pos.position || 0))}</td>
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
    const hasPositionsInCategory = watchLists.some(wl => {
      return wl.items.some((itm: any) => itm.ticker === pos.contractDesc);
    });
    return !hasPositionsInCategory;
  });
  const uncategorizedAllocationValue = uncategorizedAllocation.reduce((acc, wl) => acc + wl.mktValue, 0);
  const data = watchLists.map(wl => {
    const actualAllocation = getActualAllocation(netLiquidationValue, positions, wl);
    return {
      category: wl.category,
      expected: wl.allocation,
      actual: actualAllocation
    }
  }).concat([{
    category: "Uncategorized",
    expected: 0,
    actual: uncategorizedAllocationValue * 100 / netLiquidationValue
  }])

  return (
    <div className="flex flex-1 w-full absolute h-[calc(100%-180px)] pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
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
              fontWeight: 600
            }}
          />
          <YAxis hide={true} />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="expected" name="Expected %" fill="#a6a6a6" radius={[4, 4, 0, 0]} label={(props) => renderBarLabel(netLiquidationValue, props)} />
          <Bar dataKey="actual" name="Actual %" fill="#336699" radius={[4, 4, 0, 0]} label={(props) => renderBarLabel(netLiquidationValue, props)} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AllocationGraph
