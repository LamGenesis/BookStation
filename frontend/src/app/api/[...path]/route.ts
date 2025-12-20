import { NextRequest, NextResponse } from 'next/server';

// Backend URL - sử dụng service name trong Docker network hoặc env variable
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8080';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path);
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
  try {
    // Reconstruct the API path
    const apiPath = pathSegments.join('/');
    const url = new URL(request.url);
    
    // Skip uploads path - handled by separate route
    if (apiPath.startsWith('uploads/')) {
      return NextResponse.json(
        { message: 'Use /api/uploads/... for static files' },
        { status: 400 }
      );
    }
    
    // Build backend URL
    const backendUrl = `${BACKEND_URL}/api/${apiPath}${url.search}`;
    
    // Get request body if exists
    let body: BodyInit | null = null;
    const contentType = request.headers.get('content-type');
    
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (contentType?.includes('multipart/form-data')) {
        // For multipart/form-data, forward as FormData
        const formData = await request.formData();
        body = formData;
      } else if (contentType?.includes('application/json')) {
        const jsonData = await request.json();
        body = JSON.stringify(jsonData);
      } else {
        body = await request.text();
      }
    }
    
    // Forward headers (except host and connection)
    const headers: HeadersInit = {};
    request.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey !== 'host' &&
        lowerKey !== 'connection' &&
        lowerKey !== 'content-length'
      ) {
        // Don't set Content-Type for FormData, let fetch set it with boundary
        if (lowerKey === 'content-type' && body instanceof FormData) {
          return;
        }
        headers[key] = value;
      }
    });
    
    // Make request to backend
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
    });
    
    // Get response body
    let responseBody: BodyInit | null = null;
    
    // For 204 No Content, don't try to read the body
    if (response.status === 204 || response.status === 304) {
      responseBody = null;
    } else {
      responseBody = await response.arrayBuffer();
    }
    
    // Forward response with same status and headers
    const responseHeaders = new Headers();
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey !== 'content-encoding' &&
        lowerKey !== 'transfer-encoding' &&
        lowerKey !== 'connection'
      ) {
        responseHeaders.set(key, value);
      }
    });
    
    // For 204 No Content, return response without body
    if (response.status === 204) {
      return new NextResponse(null, {
        status: 204,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    }
    
    return new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

