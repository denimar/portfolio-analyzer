import getCookiesFromRequest from "@/lib/getCookiesFromRequest";
import { ibkrApi } from "@/lib/ibkrApi";
import { NextRequest, NextResponse } from "next/server";

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const GET = async (req: NextRequest) => {
  try {
    const status = await ibkrApi({
      endpoint: '/iserver/auth/status',
      cookies: getCookiesFromRequest(req)
    });
    return NextResponse.json(status);
  } catch (e: any) {
    console.error("Error fetching IBKR status:", e.message);
    return NextResponse.json({ connected: false, authenticated: false, error: e.message });
  }
}