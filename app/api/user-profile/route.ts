import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const {
      full_name,
      age,
      monthly_income,
      financial_goal,
      risk_tolerance,
      occupation,
      investment_experience,
      existing_investments,
      monthly_expenses,
      dependents,
      preferred_investment_types,
    } = body;

    // Validate required fields
    if (!full_name || !age || !monthly_income || !financial_goal || !risk_tolerance || !occupation) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Convert numeric strings to numbers
    const numericAge = parseInt(age);
    const numericIncome = parseFloat(monthly_income);
    const numericExpenses = monthly_expenses ? parseFloat(monthly_expenses) : 0;
    const numericDependents = dependents ? parseInt(dependents) : 0;

    // Insert user profile
    const result = await db.query(
      `INSERT INTO user_profiles (
        clerk_id,
        full_name,
        age,
        monthly_income,
        financial_goal,
        risk_tolerance,
        occupation,
        investment_experience,
        existing_investments,
        monthly_expenses,
        dependents,
        preferred_investment_types
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        full_name,
        numericAge,
        numericIncome,
        financial_goal,
        risk_tolerance,
        occupation,
        investment_experience || null,
        existing_investments || null,
        numericExpenses,
        numericDependents,
        preferred_investment_types || null,
      ]
    );

    return NextResponse.json({ success: true, message: 'Profile created successfully' });
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

    const body = await req.json();
    const {
      full_name,
      age,
      monthly_income,
      financial_goal,
      risk_tolerance,
      occupation,
      investment_experience,
      existing_investments,
      monthly_expenses,
      dependents,
      preferred_investment_types,
    } = body;

    // Validate required fields
    if (!full_name || !age || !monthly_income || !financial_goal || !risk_tolerance || !occupation) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }

    // Convert numeric strings to numbers
    const numericAge = parseInt(age);
    const numericIncome = parseFloat(monthly_income);
    const numericExpenses = monthly_expenses ? parseFloat(monthly_expenses) : 0;
    const numericDependents = dependents ? parseInt(dependents) : 0;

    // Update user profile
    const result = await db.query(
      `UPDATE user_profiles SET
        full_name = ?,
        age = ?,
        monthly_income = ?,
        financial_goal = ?,
        risk_tolerance = ?,
        occupation = ?,
        investment_experience = ?,
        existing_investments = ?,
        monthly_expenses = ?,
        dependents = ?,
        preferred_investment_types = ?
      WHERE clerk_id = ?`,
      [
        full_name,
        numericAge,
        numericIncome,
        financial_goal,
        risk_tolerance,
        occupation,
        investment_experience || null,
        existing_investments || null,
        numericExpenses,
        numericDependents,
        preferred_investment_types || null,
        userId,
      ]
    );

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
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

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const [profile] = await db.query(
      'SELECT * FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );

    if (!profile) {
      return new NextResponse(
        JSON.stringify({ error: 'Profile not found' }),
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch profile' }),
      { status: 500 }
    );
  }
} 