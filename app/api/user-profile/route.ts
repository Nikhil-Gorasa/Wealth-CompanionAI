import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    
    // Check if profile already exists
    const existingProfile = await db.query(
      'SELECT * FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );

    if (Array.isArray(existingProfile) && existingProfile.length > 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Profile already exists' }),
        { status: 409 }
      );
    }

    // Insert new user profile
    await db.query(
      `INSERT INTO user_profiles (
        clerk_id,
        full_name,
        age,
        location,
        monthly_income,
        financial_goal,
        risk_tolerance,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        userId,
        data.full_name,
        data.age,
        data.location,
        data.monthly_income,
        data.financial_goal,
        data.risk_tolerance,
      ]
    );

    return NextResponse.json({ message: 'Profile created successfully' });
  } catch (error) {
    console.error('Error creating profile:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to create profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();
    
    // Check if profile exists
    const existingProfile = await db.query(
      'SELECT * FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );

    if (!Array.isArray(existingProfile) || existingProfile.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404 }
      );
    }

    // Update existing user profile
    await db.query(
      `UPDATE user_profiles SET
        full_name = ?,
        age = ?,
        location = ?,
        monthly_income = ?,
        financial_goal = ?,
        risk_tolerance = ?,
        updated_at = NOW()
      WHERE clerk_id = ?`,
      [
        data.full_name,
        data.age,
        data.location,
        data.monthly_income,
        data.financial_goal,
        data.risk_tolerance,
        userId,
      ]
    );

    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return new NextResponse(
      JSON.stringify({ 
        error: 'Failed to update profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500 }
    );
  }
} 