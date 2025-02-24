import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Temporarily return NextResponse.next() to disable auth checks
  return NextResponse.next()

  // Original auth code (commented out for now)
  /*
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && !req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  if (session && req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
  */
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

