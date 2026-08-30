import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "aprrc_admin_session";

async function isValidSession(token: string | undefined) {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminLogin = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin") && !isAdminLogin;
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminArea && !isAdminApi) return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const valid = await isValidSession(token);

  if (!valid) {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
