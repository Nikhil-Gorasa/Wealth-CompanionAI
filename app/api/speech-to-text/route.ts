import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

// The API endpoint for Google Cloud Speech-to-Text
const SPEECH_TO_TEXT_URL = 'https://speech.googleapis.com/v1/speech:recognize';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;

    if (!audioFile) {
      return new NextResponse('Audio file is required', { status: 400 });
    }

    console.log('Processing audio file:', {
      type: audioFile.type,
      size: audioFile.size,
    });

    // Convert Blob to Base64
    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    // Prepare the request body
    const requestBody = {
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-IN',
        model: 'default',
        useEnhanced: true,
        enableAutomaticPunctuation: true,
      },
      audio: {
        content: base64Audio,
      },
    };

    console.log('Sending request to Google Cloud Speech-to-Text');

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('Google API key is not configured');
    }

    // Make the API request
    const response = await fetch(`${SPEECH_TO_TEXT_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to transcribe audio');
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      throw new Error('No transcription results received');
    }

    const transcription = data.results
      .map((result: any) => result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join('\n');

    console.log('Transcription received:', transcription);

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error('Error in speech-to-text API:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Authentication Error',
            details: 'Invalid Google Cloud API key. Please check your configuration.'
          }), 
          { status: 401 }
        );
      }
      
      if (error.message.includes('quota')) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Quota Exceeded',
            details: 'Google Cloud Speech-to-Text quota exceeded. Please try again later.'
          }), 
          { status: 429 }
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