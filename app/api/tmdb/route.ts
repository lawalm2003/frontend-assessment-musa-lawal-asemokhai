import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api.themoviedb.org/3';

export async function GET(request: NextRequest) {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'TMDB_API_KEY is not configured' },
      { status: 500 },
    );
  }

  const { searchParams } = request.nextUrl;
  const endpoint = searchParams.get('endpoint');

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Missing endpoint param' },
      { status: 400 },
    );
  }

  // Forward all params except 'endpoint' to TMDB
  const tmdbParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== 'endpoint') tmdbParams.set(key, value);
  });
  tmdbParams.set('api_key', apiKey);

  const url = `${BASE_URL}${endpoint}?${tmdbParams.toString()}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    return NextResponse.json(
      { error: `TMDB error: ${res.status} ${res.statusText}` },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
