"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, loginWithGoogle } = useAuth();
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const result = await login({
        email: loginEmail,
        password: loginPassword,
      });

      if (result.success) {
        router.push('/');
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('An unexpected error occurred');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');
    setSignupLoading(true);

    try {
      const result = await signup({
        email: signupEmail,
        password: signupPassword,
        fullName: signupFullName,
      });

      if (result.success) {
        setSignupSuccess(result.message || 'Account created successfully!');
        setSignupEmail('');
        setSignupPassword('');
        setSignupFullName('');
      } else {
        setSignupError(result.error || 'Signup failed');
      }
    } catch (error) {
      setSignupError('An unexpected error occurred');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result.success && result.error) {
        setLoginError(result.error);
      }
    } catch (error) {
      setLoginError('Failed to connect to Google');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E0C4BC]/20 via-white to-[#6BBFAC]/10 dark:from-[#0a1a13] dark:via-[#083022] dark:to-[#0a1a13] p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#E95331]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#6BBFAC]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-5 hover:opacity-80 transition-opacity">
            <Image
              src="/brand/toto_logo_plain.png"
              alt="toto"
              width={120}
              height={42}
              className="h-10 w-auto mx-auto dark:hidden"
            />
            <Image
              src="/brand/toto_logo_plain_light.png"
              alt="toto"
              width={120}
              height={42}
              className="h-10 w-auto mx-auto hidden dark:block"
            />
          </Link>
          <div className="w-14 h-14 relative mx-auto mb-4">
            <Image
              src="/brand/totos/party_toto.png"
              alt="Toto"
              fill
              className="object-contain"
              sizes="56px"
            />
          </div>
          <h1 className="text-2xl font-display text-[#083022] dark:text-white mb-1">
            {t("auth.title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-subtitle tracking-wide">
            {t("auth.subtitle")}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#0d2a1f] rounded-2xl border border-[#E0C4BC]/30 dark:border-white/10 shadow-elevated overflow-hidden">
          {/* Tab Switcher */}
          <div className="flex border-b border-[#E0C4BC]/20 dark:border-white/10">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'login'
                  ? 'text-[#E95331] border-b-2 border-[#E95331] bg-[#E95331]/5'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {t("auth.tabLogin")}
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-3.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'signup'
                  ? 'text-[#E95331] border-b-2 border-[#E95331] bg-[#E95331]/5'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {t("auth.tabSignup")}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'login' ? (
              <>
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-[#083022] dark:text-white">{t("auth.welcomeBack")}</h2>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{t("auth.loginDesc")}</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email" className="text-sm font-medium text-[#083022] dark:text-slate-300">{t("auth.email")}</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#E0C4BC]/40 dark:border-white/15 bg-white dark:bg-[#0a1a13] focus-visible:ring-[#E95331]/30 focus-visible:border-[#E95331]/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-password" className="text-sm font-medium text-[#083022] dark:text-slate-300">{t("auth.password")}</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#E0C4BC]/40 dark:border-white/15 bg-white dark:bg-[#0a1a13] focus-visible:ring-[#E95331]/30 focus-visible:border-[#E95331]/50"
                    />
                  </div>

                  {loginError && (
                    <div className="text-sm text-[#E95331] bg-[#E95331]/10 p-3 rounded-xl border border-[#E95331]/20">
                      {loginError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/15 rounded-xl border-0 font-semibold"
                    disabled={loginLoading}
                  >
                    {loginLoading ? t("auth.loggingIn") : t("auth.loginButton")}
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-[#083022] dark:text-white">{t("auth.createAccount")}</h2>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">{t("auth.signupDesc")}</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-name" className="text-sm font-medium text-[#083022] dark:text-slate-300">{t("auth.fullName")}</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="John Doe"
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      className="h-11 rounded-xl border-[#E0C4BC]/40 dark:border-white/15 bg-white dark:bg-[#0a1a13] focus-visible:ring-[#E95331]/30 focus-visible:border-[#E95331]/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-[#083022] dark:text-slate-300">{t("auth.email")}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      className="h-11 rounded-xl border-[#E0C4BC]/40 dark:border-white/15 bg-white dark:bg-[#0a1a13] focus-visible:ring-[#E95331]/30 focus-visible:border-[#E95331]/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-[#083022] dark:text-slate-300">{t("auth.password")}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="h-11 rounded-xl border-[#E0C4BC]/40 dark:border-white/15 bg-white dark:bg-[#0a1a13] focus-visible:ring-[#E95331]/30 focus-visible:border-[#E95331]/50"
                    />
                    <p className="text-xs text-slate-400">{t("auth.passwordHint")}</p>
                  </div>

                  {signupError && (
                    <div className="text-sm text-[#E95331] bg-[#E95331]/10 p-3 rounded-xl border border-[#E95331]/20">
                      {signupError}
                    </div>
                  )}
                  {signupSuccess && (
                    <div className="text-sm text-[#6BBFAC] bg-[#6BBFAC]/10 p-3 rounded-xl border border-[#6BBFAC]/20">
                      {signupSuccess}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-11 bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/15 rounded-xl border-0 font-semibold"
                    disabled={signupLoading}
                  >
                    {signupLoading ? t("auth.creatingAccount") : t("auth.signupButton")}
                  </Button>
                </form>
              </>
            )}

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E0C4BC]/30 dark:border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-[#0d2a1f] px-3 text-slate-400 dark:text-slate-500 font-medium">
                  {t("auth.orContinueWith")}
                </span>
              </div>
            </div>

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl border-[#E0C4BC]/40 dark:border-white/15 hover:border-[#083022]/30 dark:hover:border-white/25 transition-all text-[#083022] dark:text-slate-300"
              onClick={handleGoogleLogin}
              disabled={loginLoading || signupLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {t("auth.continueGoogle")}
            </Button>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-5 text-center text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
          {t("auth.termsNotice")}
        </p>
      </motion.div>
    </div>
  );
}
