'use client';

import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessage } from '@/components/chat/message';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getGeminiResponse } from '@/lib/gemini';
import { useChatStore } from '@/lib/store';
import {
  BarChart3,
  Download,
  HomeIcon,
  MoonIcon,
  SunIcon,
  Trash2Icon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

export default function ChatPage() {
  const { setTheme, theme } = useTheme();
  const {
    messages,
    addMessage,
    toggleSaved,
    isTyping,
    setTyping,
    clearMessages,
  } = useChatStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    addMessage({ role: 'user', content });
    setTyping(true);

    try {
      const response = await getGeminiResponse(content);
      addMessage({ role: 'assistant', content: response });
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setTyping(false);
    }
  };

  const handleExport = () => {
    const exportData = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp).toISOString(),
      saved: msg.saved,
    }));

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    const newMessages = messages.filter((msg) => msg.id !== id);
    useChatStore.setState({ messages: newMessages });
    toast.success('Message deleted');
  };

  return (
    <main className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b bg-background p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Wealth CompanionAI</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <HomeIcon className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? (
              <SunIcon className="h-4 w-4" />
            ) : (
              <MoonIcon className="h-4 w-4" />
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={handleExport}>
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              clearMessages();
              toast.success('Chat cleared');
            }}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="flex flex-col">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onSave={toggleSaved}
              onDelete={handleDelete}
            />
          ))}
          {isTyping && (
            <div className="flex w-full gap-4 bg-secondary/50 p-4">
              <div className="flex gap-2">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce delay-100">•</span>
                <span className="animate-bounce delay-200">•</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <ChatInput onSend={handleSendMessage} isLoading={isTyping} />
    </main>
  );
}