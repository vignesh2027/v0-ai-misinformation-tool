import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Simple middleware that just passes through
  return NextResponse.next({
    request,
  })
}
