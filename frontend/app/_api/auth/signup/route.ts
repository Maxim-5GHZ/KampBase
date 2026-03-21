import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const backendUrl = process.env.API_URL || 'http://localhost:8080';
  const url = `${backendUrl}/api/auth/signup`;

  // Выводим в консоль сразу, чтобы точно увидеть
  console.error('=== API ROUTE DEBUG ===');
  console.error('API_URL from env:', process.env.API_URL);
  console.error('Backend URL:', url);
  console.error('Request body:', body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });
    const responseText = await response.text();
    console.error('Backend status:', response.status);
    console.error('Backend response:', responseText);
    return new NextResponse(responseText, { status: response.status });
  } catch (error: any) {
    console.error('Proxy error:', error);
    return new NextResponse(`Proxy error: ${error.message}`, { status: 500 });
  }
}