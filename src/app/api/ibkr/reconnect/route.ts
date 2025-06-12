import { ibkrApi } from "@/lib/ibkrApi";
import { NextRequest, NextResponse } from "next/server";

// if (process.env.NODE_ENV === 'development') 
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const POST = async (req: NextRequest) => {
  try {
    const response = await ibkrApi({ endpoint: '/iserver/reauthenticate' });
    return NextResponse.json(response);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, {  status: 500 });
  }
}