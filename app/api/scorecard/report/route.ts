import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

const scorecardEndpoint =
  process.env.SCORECARD_LAMBDA_URL ||
  'https://whv5jnt2svbzkpx6l2psbmfnxe0pqdha.lambda-url.us-east-1.on.aws/'

const reportToken = process.env.SCORECARD_REPORT_TOKEN || ''

function reportEndpoint(request: NextRequest) {
  const url = new URL('report', scorecardEndpoint)
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value)
  })
  return url
}

function proxiedHeaders(lambdaResponse: Response) {
  const headers = new Headers()
  const contentType = lambdaResponse.headers.get('content-type')
  const contentDisposition = lambdaResponse.headers.get('content-disposition')

  if (contentType) headers.set('Content-Type', contentType)
  if (contentDisposition) {
    headers.set('Content-Disposition', contentDisposition)
  }
  headers.set('Cache-Control', 'no-store')
  return headers
}

function authHeaders() {
  return reportToken ? { 'x-scorecard-report-token': reportToken } : undefined
}

export async function GET(request: NextRequest) {
  try {
    const lambdaResponse = await fetch(reportEndpoint(request), {
      method: 'GET',
      headers: authHeaders(),
      cache: 'no-store',
    })
    const body = await lambdaResponse.arrayBuffer()

    return new NextResponse(body, {
      status: lambdaResponse.status,
      headers: proxiedHeaders(lambdaResponse),
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          'The scorecard report service is unavailable right now. Try again in a minute.',
      },
      { status: 502 },
    )
  }
}

export async function POST(request: NextRequest) {
  let payload: unknown

  try {
    payload = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Submit a valid scorecard report request.' },
      { status: 400 },
    )
  }

  try {
    const lambdaResponse = await fetch(reportEndpoint(request), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeaders() || {}),
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })
    const body = await lambdaResponse.arrayBuffer()

    return new NextResponse(body, {
      status: lambdaResponse.status,
      headers: proxiedHeaders(lambdaResponse),
    })
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          'The scorecard report service is unavailable right now. Try again in a minute.',
      },
      { status: 502 },
    )
  }
}
