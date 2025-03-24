import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { message } = body;

    if (!message) {
      return new NextResponse('Message is required', { status: 400 });
    }

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a prompt that emphasizes financial education and Indian context
    const prompt = `You are Invest Sathi, an AI-powered financial assistant helping Indian investors. 
    The user's question is: "${message}"
    
    Please provide a clear, concise, and educational response that:
    1. Uses simple language and real-world examples
    2. Relates to the Indian financial context
    3. Includes relevant numbers and statistics when appropriate
    4. Maintains a friendly and supportive tone
    
    Response:`;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Error in chat API:', error);
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