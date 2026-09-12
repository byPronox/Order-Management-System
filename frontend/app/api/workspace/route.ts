import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { workspaceId } = await request.json()

  const response = NextResponse.json({ success: true })
  response.cookies.set('workspace_id', String(workspaceId), {
    httpOnly: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}