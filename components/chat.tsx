'use client';

import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, ChevronDown, ChevronUp, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  summary?: string;
  details?: string;
}

const formatSpecialText = (text: string) => {
  // Handle bold text with **
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>');
  
  // Handle section headers with : at the end
  text = text.replace(/([^:]+):/g, '<span class="font-semibold text-primary">$1:</span>');
  
  // Handle bullet points
  text = text.replace(/^[•-]\s*(.*)$/gm, '<li class="flex items-start gap-2"><span class="text-primary mt-1">•</span>$1</li>');
  
  return text;
};

// Add type definitions for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState<Set<number>>(new Set());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const isSpeechSupported = typeof window !== 'undefined' && 
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    
    setSpeechSupported(isSpeechSupported);

    if (isSpeechSupported) {
      try {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error, event.message);
          setIsRecording(false);
          
          // Handle specific error cases
          switch (event.error) {
            case 'network':
              toast.error('Network error. Please check your internet connection.');
              break;
            case 'no-speech':
              toast.error('No speech detected. Please try again.');
              break;
            case 'aborted':
              toast.error('Speech recognition was aborted.');
              break;
            case 'audio-capture':
              toast.error('No microphone found. Please check your device settings.');
              break;
            case 'not-allowed':
              toast.error('Microphone access denied. Please allow microphone access in your browser settings.');
              break;
            case 'service-not-available':
              toast.error('Speech recognition service is not available. Please try again later.');
              break;
            default:
              toast.error('Speech recognition failed. Please try again.');
          }
        };

        // Add connection status check
        recognitionRef.current.onstart = () => {
          // Check if we're online
          if (!navigator.onLine) {
            recognitionRef.current?.stop();
            toast.error('No internet connection. Please check your network.');
          }
        };
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        setSpeechSupported(false);
        toast.error('Speech recognition is not available in your browser.');
      }
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        utteranceRef.current = new SpeechSynthesisUtterance();
        utteranceRef.current.onend = () => setIsSpeaking(false);
        utteranceRef.current.onerror = (event) => {
          console.error('Speech synthesis error:', event);
          setIsSpeaking(false);
          toast.error('Text-to-speech failed. Please try again.');
        };
      } catch (error) {
        console.error('Failed to initialize speech synthesis:', error);
        toast.error('Text-to-speech is not available in your browser.');
      }
    }

    // Add online/offline event listeners
    const handleOnline = () => {
      if (isRecording) {
        toast.success('Connection restored. You can continue speaking.');
      }
    };

    const handleOffline = () => {
      if (isRecording) {
        recognitionRef.current?.stop();
        toast.error('Connection lost. Please check your internet connection.');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleRecording = () => {
    if (!speechSupported) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (!navigator.onLine) {
      toast.error('No internet connection. Please check your network.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Failed to start recording:', error);
        toast.error('Failed to start recording. Please try again.');
      }
    }
  };

  const speakText = (text: string) => {
    if (!utteranceRef.current) {
      toast.error('Text-to-speech is not supported in your browser');
      return;
    }

    window.speechSynthesis.cancel();
    utteranceRef.current.text = text;
    window.speechSynthesis.speak(utteranceRef.current);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleMessageExpansion = (index: number) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = (text: string) => {
    const lines = text.split('\n');
    const summaryLines: string[] = [];
    const detailLines: string[] = [];
    let isSummary = true;

    for (const line of lines) {
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        isSummary = false;
        detailLines.push(line);
      } else if (isSummary && summaryLines.length < 5) {
        summaryLines.push(line);
      } else {
        isSummary = false;
        detailLines.push(line);
      }
    }

    return {
      summary: summaryLines.join('\n'),
      details: detailLines.join('\n')
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      const { summary, details } = processMessage(data.message);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        summary,
        details
      }]);

      // Automatically speak the summary
      if (summary) {
        speakText(summary);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-lg p-4',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                )}
              >
                {message.role === 'assistant' && message.summary ? (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        className="whitespace-pre-line font-medium flex-1"
                        dangerouslySetInnerHTML={{ __html: formatSpecialText(message.summary) }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => isSpeaking ? stopSpeaking() : speakText(message.summary || '')}
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {message.details && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full flex items-center justify-center gap-2 mt-2"
                          onClick={() => toggleMessageExpansion(index)}
                        >
                          {expandedMessages.has(index) ? (
                            <>
                              Show Less <ChevronUp className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              Show More <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                        {expandedMessages.has(index) && (
                          <div 
                            className="mt-2 pt-2 border-t whitespace-pre-line text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: formatSpecialText(message.details) }}
                          />
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div 
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: formatSpecialText(message.content) }}
                  />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-4 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-muted-foreground">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          {speechSupported && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleRecording}
              disabled={isLoading || !navigator.onLine}
              className={cn(
                isRecording && "bg-red-100 dark:bg-red-900/20",
                !navigator.onLine && "opacity-50 cursor-not-allowed"
              )}
              title={!navigator.onLine ? "No internet connection" : isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
} 