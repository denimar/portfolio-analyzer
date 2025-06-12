import getCookiesFromRequest from "@/lib/getCookiesFromRequest";
import { ibkrApi } from "@/lib/ibkrApi";
import { NextRequest, NextResponse } from "next/server";

if (process.env.NODE_ENV === 'development') process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const GET = async (req: NextRequest) => {
  try {
    const cookies: any = req.headers.get('authorization')
    debugger
    const status = await ibkrApi({
      endpoint: '/iserver/auth/status',
      cookies
    });
    return NextResponse.json(status);
  } catch (e: any) {
    return NextResponse.json({ connected: false, authenticated: false, error: e.message });
  }
}