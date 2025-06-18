import { ibkrApi } from "@/lib/ibkrApi";
import { NextRequest, NextResponse } from "next/server";

// if (process.env.NODE_ENV === 'development') 
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const GET = async (req: NextRequest) => {
  const watchListPercs = [ //Hard-coded for now
    {
      id: '115', //US Stocks
      allocation: 30,
      notes: 'Core market exposure'
    },
    {
      id: '116', //Tech & Thematic
      allocation: 10,
      notes: 'Growth-focused assets'
    },
    {
      id: '117', //International ETFs
      allocation: 10,
      notes: 'Global diversification'
    },
    {
      id: '118', //REITs
      allocation: 10,
      notes: 'Income + real estate'
    },
    {
      id: '119', //Dividends & Defensives
      allocation: 10,
      notes: 'Stability + dividend income'
    },
    {
      id: '120', //Short-Term Bonds / Cash
      allocation: 10,
      notes: 'Capital preservation'
    },
    {
      id: '121', //Gold ETF
      allocation: 10,
      notes: 'Inflation hedge'
    },
    {
      id: '122', //Bitcoin ETF
      allocation: 10,
      notes: 'Asymmetric growth play'
    },
  ]
  try {
    const watchlistsResp = await Promise.all(watchListPercs.map(watchListPerc => ibkrApi({ endpoint: `/iserver/watchlist?id=${watchListPerc.id}`})));  
    const watchlists = watchlistsResp.map((resp: any, index) => {
      const watchListPercObj = watchListPercs.find(watchListPerc => watchListPerc.id === resp.id)
      return {
        id: resp.id,
        category: resp.name,
        allocation: watchListPercObj?.allocation,
        notes: watchListPercObj?.notes,
        items: [...resp.instruments],
      }
    });
    return NextResponse.json(watchlists || []);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
