import getCookiesFromRequest from "@/lib/getCookiesFromRequest";
import { ibkrApi } from "@/lib/ibkrApi";
import { NextRequest, NextResponse } from "next/server";

// if (process.env.NODE_ENV === 'development') 
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const GET = async (req: NextRequest) => {
  try {
    const [pnlResp, ledgerResp]: any[] = await Promise.all([
      ibkrApi({ endpoint: '/iserver/account/pnl/partitioned' }),
      ibkrApi({ endpoint: '/portfolio/U13793951/ledger' })
    ]);
    const { cashbalance, realizedpnl } = (ledgerResp['USD'] || {});
    const pnl = pnlResp.upnl['U13793951.Core']

    return NextResponse.json({ 
      totalCash: cashbalance, 
      netLiquidation: pnl.nl,
      dailyPNL: pnl.dpl,
      unrealizedPNL: pnl.upl,
      realizedPNL: realizedpnl
    });
  } catch (e: any) {
    debugger
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
