import { Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl?: string | null;
  phone?: string | null;
  preferredLanguage?: string;
  homeCountry?: string | null;
  currencyPreference?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  preferredLanguage?: string;
  homeCountry?: string;
  currencyPreference?: string;
}
