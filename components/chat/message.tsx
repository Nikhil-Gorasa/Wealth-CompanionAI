'use client';

import { Message } from '@/lib/store';
import { format } from 'date-fns';
import { BookmarkIcon, CodeIcon, CopyIcon, TrashIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-tomorrow.css';
import { useEffect } from 'react';

interface ChatMessageProps {
  message: Message;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ChatMessage({ message, onSave, onDelete }: ChatMessageProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [message]);

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div
      className={cn(
        'flex w-full gap-4 p-4 transition-colors',
        message.role === 'assistant'
          ? 'bg-secondary/50'
          : 'bg-background hover:bg-secondary/20'
      )}
    >
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {format(message.timestamp, 'HH:mm • MMM d, yyyy')}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onSave(message.id)}
              className={cn(message.saved && 'text-primary')}
            >
              <BookmarkIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(message.id)}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="whitespace-pre-wrap">{message.content}</div>
        {message.codeSnippets?.map((snippet, index) => (
          <div key={index} className="relative rounded-md bg-zinc-950 p-4">
            <div className="absolute right-2 top-2 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(snippet)}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
            <pre className="overflow-x-auto">
              <code className="language-javascript">{snippet}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}