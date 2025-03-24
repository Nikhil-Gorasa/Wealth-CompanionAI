import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  name: string;
  age: number;
  location: string;
  monthlyIncome: string;
  financialGoal: string;
  riskTolerance: 'Low' | 'Medium' | 'High';
  investmentExperience: 'None' | 'Beginner' | 'Intermediate';
  preferredLanguage: string;
  email: string;
  currentSavings?: string;
  existingInvestments?: string;
  timeHorizon?: 'Short-term' | 'Long-term';
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
  saved?: boolean;
  codeSnippets?: string[];
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  user: UserProfile | null;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  toggleSaved: (id: string) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isTyping: false,
      user: null,
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: Math.random().toString(36).substring(7),
              timestamp: Date.now(),
            },
          ],
        })),
      toggleSaved: (id) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, saved: !msg.saved } : msg
          ),
        })),
      setTyping: (typing) => set({ isTyping: typing }),
      clearMessages: () => set({ messages: [] }),
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'chat-storage',
    }
  )
);