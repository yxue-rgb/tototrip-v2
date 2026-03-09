"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Trash2, ChevronLeft, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import Image from 'next/image';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface SessionListProps {
  currentSessionId: string;
  onSessionChange?: (sessionId: string) => void;
}

export function SessionList({ currentSessionId, onSessionChange }: SessionListProps) {
  const router = useRouter();
  const { session } = useAuth();
  const { t } = useI18n();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth < 768;
    return true;
  });

  useEffect(() => {
    if (session?.access_token) loadSessions();
  }, [session]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sessions', {
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (response.ok) {
        const { sessions: sessionList } = await response.json();
        setSessions(sessionList);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ title: 'New Chat' }),
      });
      if (response.ok) {
        const { session: newSession } = await response.json();
        router.push(`/chat/${newSession.id}`);
        await loadSessions();
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t('chat.deleteConfirm'))) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });
      if (response.ok) {
        if (sessionId === currentSessionId) {
          router.push('/');
        } else {
          await loadSessions();
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const handleSessionClick = (sessionId: string) => {
    if (onSessionChange) {
      onSessionChange(sessionId);
    } else {
      router.push(`/chat/${sessionId}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isCollapsed) {
    return (
      <div className="fixed top-3 left-3 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="h-11 w-11 min-h-[44px] min-w-[44px] bg-white/80 dark:bg-[#0d2a1f]/80 backdrop-blur-xl border border-[#E0C4BC]/30 dark:border-white/10 shadow-soft rounded-xl text-[#083022] dark:text-slate-400 hover:text-[#083022] dark:hover:text-white"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <div
        className="md:hidden fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-30"
        onClick={() => setIsCollapsed(true)}
      />

      <div className="fixed md:relative top-0 left-0 h-screen w-72 bg-white dark:bg-[#0d2a1f] border-r border-[#E0C4BC]/20 dark:border-white/10 flex flex-col z-40">
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 relative rounded-lg overflow-hidden">
              <Image
                src="/brand/totos/plain_toto.png"
                alt="toto"
                fill
                className="object-contain"
                sizes="28px"
              />
            </div>
            <h2 className="font-semibold text-sm text-[#083022] dark:text-white">{t('chat.conversations')}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="md:hidden h-8 w-8 text-slate-400"
            aria-label="Close sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat */}
        <div className="px-3 pb-3">
          <Button
            onClick={handleNewChat}
            className="w-full bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/15 rounded-xl h-9 text-sm font-medium border-0"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {t('chat.newChat')}
          </Button>
        </div>

        {/* Sessions */}
        <ScrollArea className="flex-1 px-2">
          {isLoading ? (
            <div className="p-4 text-center">
              <div className="flex gap-1 justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#6BBFAC] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#6BBFAC] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-[#6BBFAC] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-center">
              <MessageSquare className="h-8 w-8 text-[#E0C4BC] dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t('chat.noConversations')}</p>
              <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1">{t('chat.noConversationsHint')}</p>
            </div>
          ) : (
            <div className="space-y-0.5 pb-4">
              {sessions.map((sess) => {
                const isActive = sess.id === currentSessionId;
                return (
                  <div
                    key={sess.id}
                    onClick={() => handleSessionClick(sess.id)}
                    className={`
                      group relative px-3 py-2.5 rounded-xl cursor-pointer
                      transition-all duration-200
                      ${isActive
                        ? 'bg-[#083022]/5 dark:bg-[#6BBFAC]/10 border border-[#083022]/10 dark:border-[#6BBFAC]/20'
                        : 'hover:bg-[#E0C4BC]/10 dark:hover:bg-white/5 border border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-start gap-2.5">
                      <MessageSquare className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${
                        isActive ? 'text-[#E95331]' : 'text-slate-300'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium truncate ${
                          isActive ? 'text-[#083022] dark:text-[#6BBFAC]' : 'text-slate-700 dark:text-slate-300'
                        }`}>
                          {sess.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(sess.updated_at)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDeleteSession(sess.id, e)}
                        className="opacity-0 group-hover:opacity-100 h-8 w-8 flex-shrink-0 text-slate-300 hover:text-[#E95331] hover:bg-[#E95331]/10 rounded-lg transition-all duration-200"
                        aria-label={`Delete conversation: ${sess.title}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
