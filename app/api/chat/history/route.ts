import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Get user's profile ID
    const profiles = await db.query(
      'SELECT id FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );

    if (!profiles || profiles.length === 0) {
      return NextResponse.json([]);
    }

    const profile = profiles[0];

    // Get chat history
    const messages = await db.query(
      'SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at ASC',
      [profile.id]
    );

    // Ensure we return an array
    return NextResponse.json(Array.isArray(messages) ? messages : []);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json([]);
  }
} 