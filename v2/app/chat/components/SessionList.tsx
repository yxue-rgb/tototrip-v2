"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, MessageSquare, Trash2, ChevronLeft, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load sessions on mount
  useEffect(() => {
    if (session?.access_token) {
      loadSessions();
    }
  }, [session]);

  const loadSessions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/sessions', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
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
        body: JSON.stringify({
          title: 'New Chat',
        }),
      });

      if (response.ok) {
        const { session: newSession } = await response.json();
        router.push(`/chat/${newSession.id}`);
        await loadSessions(); // Reload session list
      }
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent session switch on delete

    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        // If deleting current session, redirect to home
        if (sessionId === currentSessionId) {
          router.push('/');
        } else {
          // Just reload the list
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

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Mobile collapsed state
  if (isCollapsed) {
    return (
      <div className="fixed top-16 left-0 z-40">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="m-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {!isCollapsed && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative top-0 left-0 h-screen w-64 bg-white border-r
        flex flex-col z-40 transition-transform
        ${isCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Conversations</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            className="w-full"
            variant="default"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Session List */}
        <ScrollArea className="flex-1 px-2">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Loading...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No conversations yet
            </div>
          ) : (
            <div className="space-y-1">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  onClick={() => handleSessionClick(sess.id)}
                  className={`
                    group relative p-3 rounded-lg cursor-pointer
                    transition-colors hover:bg-gray-100
                    ${sess.id === currentSessionId ? 'bg-blue-50 border border-blue-200' : ''}
                  `}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className={`h-4 w-4 mt-1 flex-shrink-0 ${
                      sess.id === currentSessionId ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        sess.id === currentSessionId ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {sess.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(sess.updated_at)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteSession(sess.id, e)}
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
