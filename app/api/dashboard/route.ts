import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface UserProfile extends RowDataPacket {
  id: number;
  clerk_id: string;
  monthly_income: number;
  monthly_expenses: number;
  financial_goal: string;
  risk_tolerance: string;
  investment_experience: string;
  existing_investments: string;
  preferred_investment_types: string;
}

interface ChatHistory extends RowDataPacket {
  id: number;
  user_id: number;
  message: string;
  is_ai: boolean;
  created_at: Date;
}

export async function GET() {
  try {
    console.log('Starting dashboard API request');
    
    const { userId } = await auth();
    console.log('Auth check - userId:', userId);
    
    if (!userId) {
      console.log('No userId found, returning 401');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check database connection first
    const isConnected = await db.checkConnection();
    if (!isConnected) {
      console.error('Database is not connected');
      return new NextResponse(
        JSON.stringify({ error: 'Database connection failed' }),
        { status: 500 }
      );
    }

    // Fetch user profile
    console.log('Fetching user profile for clerk_id:', userId);
    const profiles = await db.query<UserProfile[]>(
      'SELECT * FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );

    if (!profiles || profiles.length === 0) {
      console.log('No profile found for userId:', userId);
      return new NextResponse(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404 }
      );
    }

    const userData = profiles[0];
    console.log('Found user profile:', userData);

    // Fetch chat history
    console.log('Fetching chat history for user_id:', userData.id);
    const history = await db.query<ChatHistory[]>(
      'SELECT * FROM chat_history WHERE user_id = ? ORDER BY created_at DESC LIMIT 10',
      [userData.id]
    );

    console.log('Found chat history:', history);

    return NextResponse.json({
      userData,
      chatHistory: history || []
    });
  } catch (error) {
    console.error('Error in dashboard API:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
} 