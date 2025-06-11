import { NextRequest } from "next/server";

const getCookiesFromRequest = (request: NextRequest): string => {
  const allCookies = request.cookies.getAll();
  return allCookies.map(({ name, value }) => `${name}=${value}`).join('; ');
}

export default getCookiesFromRequest;