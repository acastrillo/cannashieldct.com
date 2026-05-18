import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const scorecardEndpoint =
  process.env.SCORECARD_LAMBDA_URL ||
  'https://whv5jnt2svbzkpx6l2psbmfnxe0pqdha.lambda-url.us-east-1.on.aws/'

export async function POST(request: NextRequest) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Submit a valid scorecard request.' },
      { status: 400 },
    )
  }

  try {
    const lambdaResponse = await fetch(scorecardEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    const responseText = await lambdaResponse.text()
    const contentType =
      lambdaResponse.headers.get('content-type') || 'application/json'

    return new NextResponse(responseText, {
      status: lambdaResponse.status,
      headers: { 'Content-Type': contentType },
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          'The scorecard service is unavailable right now. Try again in a minute.',
      },
      { status: 502 },
    )
  }
}
