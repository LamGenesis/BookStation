import { NextRequest, NextResponse } from 'next/server';

// Backend URL - sử dụng service name trong Docker network hoặc env variable
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:8080';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const filePath = path.join('/');
    
    // Build backend URL for static files
    const backendUrl = `${BACKEND_URL}/uploads/${filePath}`;
    
    // Fetch file from backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        // Forward only necessary headers
        'Accept': request.headers.get('Accept') || '*/*',
      },
    });
    
    if (!response.ok) {
      return new NextResponse('File not found', { status: response.status });
    }
    
    // Get file content as array buffer
    const fileBuffer = await response.arrayBuffer();
    
    // Determine content type from response or file extension
    const contentType = response.headers.get('content-type') || 
      getContentType(filePath);
    
    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Upload proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase();
  const contentTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
  };
  return contentTypes[ext || ''] || 'application/octet-stream';
}

