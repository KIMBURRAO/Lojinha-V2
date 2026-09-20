import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { signToken, getTokenCookieOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ adminId: admin.id, email: admin.email });
    
    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email }
    });

    const cookieOptions = getTokenCookieOptions(token);
    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
