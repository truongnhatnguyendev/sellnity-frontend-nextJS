// src/middleware.ts hoặc middleware.ts nếu không dùng src/
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/products", request.url));
  }
  return NextResponse.next();
}
