"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, MessageCircle, Map, Globe, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, logout, session } = useAuth();
  const [destination, setDestination] = useState("");
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  const handleStartChat = async () => {
    setIsCreatingSession(true);

    try {
      // If user is logged in, create a new session in the database
      if (session?.access_token) {
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            title: destination || 'New Chat',
          }),
        });

        if (response.ok) {
          const { session: newSession } = await response.json();
          router.push(`/chat/${newSession.id}`);
        } else {
          // Fallback to temporary ID
          const tempId = `temp-${Date.now()}`;
          router.push(`/chat/${tempId}`);
        }
      } else {
        // Not logged in, use temporary ID
        const tempId = `temp-${Date.now()}`;
        router.push(`/chat/${tempId}`);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      // Fallback
      const tempId = `temp-${Date.now()}`;
      router.push(`/chat/${tempId}`);
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="font-bold text-xl">TOTO Trip</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-gray-900">How it Works</a>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user.fullName || user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => router.push('/auth')}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-block mb-4">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                ✨ Powered by AI
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your AI Companion
              <br />
              for China Travel
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              24/7 real-time assistance, cultural insights, and instant translations
              for foreign travelers exploring China
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-12">
              <Input
                placeholder="Where do you want to go?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="text-lg h-12"
                onKeyDown={(e) => e.key === 'Enter' && handleStartChat()}
              />
              <Button
                onClick={handleStartChat}
                size="lg"
                disabled={isCreatingSession}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isCreatingSession ? 'Starting...' : 'Start Planning'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-blue-600">24/7</div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">Instant</div>
                <div className="text-sm text-gray-600">Responses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600">Smart</div>
                <div className="text-sm text-gray-600">Recommendations</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            Your Personal Travel Assistant
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Everything you need for a smooth journey in China
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Chat Companion</h3>
              <p className="text-gray-600">
                Ask anything about China - from ordering food to understanding customs.
                Get instant, helpful responses in your language.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl border-2 border-gray-100 hover:border-purple-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Planning</h3>
              <p className="text-gray-600">
                Get personalized itineraries that adapt to weather, your energy level,
                and real-time conditions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl border-2 border-gray-100 hover:border-pink-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cultural Insights</h3>
              <p className="text-gray-600">
                Learn about local customs, etiquette, and hidden gems that only
                locals know about.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl font-bold text-center mb-16">
            Simple, Fast, Smart
          </h2>

          <div className="space-y-12">
            {[
              {
                step: "1",
                title: "Start a Conversation",
                description: "Just type where you want to go or what you need help with",
                color: "blue"
              },
              {
                step: "2",
                title: "Get AI-Powered Suggestions",
                description: "Receive personalized recommendations based on your preferences",
                color: "purple"
              },
              {
                step: "3",
                title: "Explore with Confidence",
                description: "Use our 24/7 companion to navigate, translate, and discover China",
                color: "pink"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="flex gap-6 items-start"
              >
                <div className={`w-12 h-12 bg-${item.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-${item.color}-600 font-bold text-xl`}>{item.step}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-lg">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Explore China?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey with your AI travel companion today
          </p>
          <Button
            onClick={handleStartChat}
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6"
          >
            Start Your Trip
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl text-center text-gray-600">
          <p>&copy; 2024 TOTO Trip. Made with ❤️ for travelers.</p>
        </div>
      </footer>
    </div>
  );
}
