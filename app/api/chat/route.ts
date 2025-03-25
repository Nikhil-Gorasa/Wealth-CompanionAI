import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
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

// Initialize Gemini AI
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    console.log('Received chat request');
    const { userId } = await auth();
    
    if (!userId) {
      console.log('No user ID found');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      console.log('No message provided');
      return new NextResponse('Message is required', { status: 400 });
    }

    console.log('Processing message for user:', userId);

    // Get user's profile ID
    const profiles = await db.query<UserProfile[]>(
      'SELECT id, monthly_income, monthly_expenses, financial_goal, risk_tolerance, investment_experience, existing_investments, preferred_investment_types FROM user_profiles WHERE clerk_id = ?',
      [userId]
    );

    if (!profiles || profiles.length === 0) {
      console.log('No profile found for user:', userId);
      return new NextResponse(
        JSON.stringify({ error: 'Profile not found. Please complete your profile first.' }),
        { status: 404 }
      );
    }

    const profile = profiles[0];
    console.log('Found user profile:', profile.id);

    // Prepare context for the AI
    const context = profile ? `
      User Profile:
      - Monthly Income: ₹${profile.monthly_income}
      - Monthly Expenses: ₹${profile.monthly_expenses}
      - Financial Goal: ${profile.financial_goal}
      - Risk Tolerance: ${profile.risk_tolerance}
      - Investment Experience: ${profile.investment_experience}
      - Existing Investments: ${profile.existing_investments}
      - Preferred Investment Types: ${profile.preferred_investment_types}
    ` : '';

    // Save user message to database
    await db.query(
      'INSERT INTO chat_history (user_id, message, is_ai) VALUES (?, ?, ?)',
      [profile.id, message, false]
    );
    console.log('Saved user message to database');

    try {
      // Initialize the model with the correct model name and configuration
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.9,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 2048,
        },
      });
      console.log('Initialized Gemini model');

      // Create a chat instance
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 2048,
        },
      });

      // Create a comprehensive prompt for the financial AI assistant
      const prompt = `
        ${context}
        
        User Question: ${message}
        
        Please structure your response in the following format:

        [SUMMARY]
        Provide exactly 5 lines that summarize the key points of your response. Each line should be a complete thought and end with a period.

        [DETAILS]
        After the summary, provide detailed information in bullet points, organized by category if applicable. Use the following format:
        • Main point 1
        • Main point 2
          - Sub-point 2.1
          - Sub-point 2.2
        • Main point 3

        Guidelines:
        1. Keep the summary concise and actionable
        2. Use clear, simple language
        3. Focus on practical advice
        4. Include specific numbers or percentages when relevant
        5. Ensure bullet points are properly indented and formatted
      `;

      // Generate response
      console.log('Generating AI response');
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Generated AI response');

      // Process the response to ensure proper formatting
      const processedText = text
        .replace(/\[SUMMARY\]/g, '')
        .replace(/\[DETAILS\]/g, '')
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

      // Save AI response to database
      await db.query(
        'INSERT INTO chat_history (user_id, message, is_ai) VALUES (?, ?, ?)',
        [profile.id, processedText, true]
      );
      console.log('Saved AI response to database');

      return NextResponse.json({ message: processedText });
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.error('API key error:', error.message);
        return new NextResponse(
          JSON.stringify({ 
            error: 'Service Configuration Error',
            details: 'AI service is not properly configured'
          }), 
          { 
            status: 503,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      if (error.message.includes('database')) {
        console.error('Database error:', error.message);
        return new NextResponse(
          JSON.stringify({ 
            error: 'Database Error',
            details: 'Failed to save or retrieve messages'
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