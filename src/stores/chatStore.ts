import { create } from 'zustand';
import type { Message, ChatState, ChatNotification, TokenState } from '@/types';

// ============================================
// Chat Store — Per-Session Messages & Streaming
// ============================================

interface ChatStoreState {
  // Per-session message state
  messagesBySession: Record<string, Message[]>;
  chatState: ChatState;
  streamingMessageId: string | null;
  tokenUsage: TokenState;
  notifications: ChatNotification[];

  // Actions
  setMessages: (sessionId: string, messages: Message[]) => void;
  addMessage: (sessionId: string, message: Message) => void;
  updateMessage: (sessionId: string, messageId: string, updates: Partial<Message>) => void;
  removeMessage: (sessionId: string, messageId: string) => void;
  clearMessages: (sessionId: string) => void;

  // Streaming
  setChatState: (state: ChatState) => void;
  setStreamingMessageId: (id: string | null) => void;
  appendToStreamingMessage: (sessionId: string, content: string) => void;

  // Tokens
  setTokenUsage: (usage: TokenState) => void;
  addTokens: (input: number, output: number) => void;

  // Notifications
  addNotification: (notification: Omit<ChatNotification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Helpers
  getMessages: (sessionId: string) => Message[];
}

export const useChatStore = create<ChatStoreState>()((set, get) => ({
  messagesBySession: {},
  chatState: 'idle',
  streamingMessageId: null,
  tokenUsage: { input: 0, output: 0, accumulated: { input: 0, output: 0 } },
  notifications: [],

  setMessages: (sessionId, messages) =>
    set((state) => ({
      messagesBySession: { ...state.messagesBySession, [sessionId]: messages },
    })),

  addMessage: (sessionId, message) =>
    set((state) => ({
      messagesBySession: {
        ...state.messagesBySession,
        [sessionId]: [...(state.messagesBySession[sessionId] ?? []), message],
      },
    })),

  updateMessage: (sessionId, messageId, updates) =>
    set((state) => ({
      messagesBySession: {
        ...state.messagesBySession,
        [sessionId]: (state.messagesBySession[sessionId] ?? []).map((m) =>
          m.id === messageId ? { ...m, ...updates } : m,
        ),
      },
    })),

  removeMessage: (sessionId, messageId) =>
    set((state) => ({
      messagesBySession: {
        ...state.messagesBySession,
        [sessionId]: (state.messagesBySession[sessionId] ?? []).filter(
          (m) => m.id !== messageId,
        ),
      },
    })),

  clearMessages: (sessionId) =>
    set((state) => ({
      messagesBySession: { ...state.messagesBySession, [sessionId]: [] },
    })),

  setChatState: (chatState) => set({ chatState }),

  setStreamingMessageId: (id) => set({ streamingMessageId: id }),

  appendToStreamingMessage: (sessionId, content) =>
    set((state) => {
      const messages = state.messagesBySession[sessionId] ?? [];
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.role !== 'assistant') return state;

      const updatedContent = [...lastMsg.content];
      const lastContent = updatedContent[updatedContent.length - 1];
      if (lastContent && lastContent.type === 'text') {
        updatedContent[updatedContent.length - 1] = {
          ...lastContent,
          text: lastContent.text + content,
        };
      }

      return {
        messagesBySession: {
          ...state.messagesBySession,
          [sessionId]: [
            ...messages.slice(0, -1),
            { ...lastMsg, content: updatedContent },
          ],
        },
      };
    }),

  setTokenUsage: (usage) => set({ tokenUsage: usage }),

  addTokens: (input, output) =>
    set((state) => ({
      tokenUsage: {
        input,
        output,
        accumulated: {
          input: state.tokenUsage.accumulated.input + input,
          output: state.tokenUsage.accumulated.output + output,
        },
      },
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          ...notification,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        },
      ],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  getMessages: (sessionId) => get().messagesBySession[sessionId] ?? [],
}));
