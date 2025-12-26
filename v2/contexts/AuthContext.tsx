"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { User, AuthState, SignupData, LoginData, UpdateProfileData } from '@/lib/auth-types';

interface AuthContextType extends AuthState {
  signup: (data: SignupData) => Promise<{ success: boolean; error?: string; message?: string }>;
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          fullName: data.full_name,
          avatarUrl: data.avatar_url,
          phone: data.phone,
          preferredLanguage: data.preferred_language,
          homeCountry: data.home_country,
          currencyPreference: data.currency_preference,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      // Use Supabase client directly for signup
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName || '',
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { success: false, error: error.message || 'Failed to create account' };
      }

      if (!authData.user) {
        return { success: false, error: 'Signup failed' };
      }

      // Check if email confirmation is required
      if (authData.user && !authData.session) {
        return {
          success: true,
          message: 'Account created! Please check your email to confirm your account.',
        };
      }

      return { success: true, message: 'Account created successfully!' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Failed to create account' };
    }
  };

  const login = async (data: LoginData) => {
    try {
      // Use Supabase client directly for login to ensure session is saved
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message || 'Invalid email or password' };
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed' };
      }

      // Session will be updated via onAuthStateChange listener
      // and Supabase automatically stores it in localStorage
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Failed to login' };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Google login error:', error);
        return { success: false, error: error.message || 'Failed to login with Google' };
      }

      // OAuth login will redirect, so we return success here
      return { success: true };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: 'Failed to login with Google' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const accessToken = session?.access_token;
      if (!accessToken) {
        return { success: false, error: 'Not authenticated' };
      }

      const response = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error };
      }

      setUser(result.user);
      return { success: true };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
