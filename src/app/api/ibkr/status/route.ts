import getCookiesFromRequest from "@/lib/getCookiesFromRequest";
import { ibkrApi } from "@/lib/ibkrApi";
import { NextRequest, NextResponse } from "next/server";

if (process.env.NODE_ENV === 'development') process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const GET = async (req: NextRequest) => {
  console.log("Fetching IBKR status...", 'Got Here');
  try {
    const status = await ibkrApi({
      endpoint: '/iserver/auth/status',
      cookies: getCookiesFromRequest(req)
    });
    debugger
    return NextResponse.json(status);
  } catch (e: any) {
    debugger
    console.error("Error fetching IBKR status:", e.message);
    if (e.cause) {
      console.error("Cause:", e.cause.code, e.cause.message);
    }
    return NextResponse.json({ connected: false, authenticated: false, error: e.message });
  }
}