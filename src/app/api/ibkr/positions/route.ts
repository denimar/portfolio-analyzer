import getCookiesFromRequest from "@/lib/getCookiesFromRequest";
import { ibkrApi } from "@/lib/ibkrApi";
import { NextRequest, NextResponse } from "next/server";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const GET = async (req: NextRequest) => {
  try {
    const positions = await ibkrApi({
      endpoint: '/portfolio/U13793951/positions/0',
      cookies: getCookiesFromRequest(req)
    });
    return NextResponse.json(positions);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }), { status: 500 };
  }
}