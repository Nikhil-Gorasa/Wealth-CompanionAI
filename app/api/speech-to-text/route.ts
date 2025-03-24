import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import speech from '@google-cloud/speech';
import { protos } from '@google-cloud/speech';

// Initialize Speech-to-Text client
const speechClient = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

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

    // Convert Blob to Buffer
    const buffer = Buffer.from(await audioFile.arrayBuffer());

    // Configure the request
    const audio = {
      content: buffer.toString('base64'),
    };

    const config: protos.google.cloud.speech.v1.IRecognitionConfig = {
      encoding: 'WEBM_OPUS' as const,
      sampleRateHertz: 48000,
      languageCode: 'en-IN',
      model: 'default',
      useEnhanced: true,
      enableAutomaticPunctuation: true,
      metadata: {
        recordingDeviceType: 'PC' as const,
        recordingDeviceName: 'browser',
      },
    };

    const request: protos.google.cloud.speech.v1.IRecognizeRequest = {
      audio: audio,
      config: config,
    };

    console.log('Sending request to Google Cloud Speech-to-Text');
    
    // Perform the transcription
    const [response] = await speechClient.recognize(request);
    
    if (!response.results || response.results.length === 0) {
      throw new Error('No transcription results received');
    }

    const transcription = response.results
      .map((result: protos.google.cloud.speech.v1.ISpeechRecognitionResult) => 
        result.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join('\n');

    console.log('Transcription received:', transcription);

    return NextResponse.json({ text: transcription });
  } catch (error) {
    console.error('Error in speech-to-text API:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
      if (error.message.includes('credentials')) {
        return new NextResponse(
          JSON.stringify({ 
            error: 'Authentication Error',
            details: 'Invalid Google Cloud credentials. Please check your configuration.'
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