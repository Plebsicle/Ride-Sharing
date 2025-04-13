import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    
    const backendResponse = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({ error: 'Failed to parse error response' }));
      return NextResponse.json(
        { error: errorData.error || 'Login failed' },
        { status: backendResponse.status }
      );
    }

    const data = await backendResponse.json();

    // Set the JWT token in a secure HTTP-only cookie
    const response = NextResponse.json({ 
      message: 'Login successful',
      user: data.user 
    });
    
    response.cookies.set('token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
