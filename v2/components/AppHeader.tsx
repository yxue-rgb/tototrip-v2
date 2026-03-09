"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Home, MapPin, Plane, User, LogOut, Menu, X, MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import Image from "next/image";

interface AppHeaderProps {
  currentPage?: "home" | "trips" | "locations" | "chat";
}

export function AppHeader({ currentPage }: AppHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: "home", label: "Home", icon: Home, path: "/" },
    { key: "trips", label: "My Trips", icon: Plane, path: "/trips" },
    { key: "locations", label: "Locations", icon: MapPin, path: "/locations" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#0a1a13]/80 backdrop-blur-xl border-b border-[#E0C4BC]/30 dark:border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/brand/toto_logo_plain.png"
            alt="toto"
            width={72}
            height={24}
            className="h-6 w-auto dark:hidden"
          />
          <Image
            src="/brand/toto_logo_plain_light.png"
            alt="toto"
            width={72}
            height={24}
            className="h-6 w-auto hidden dark:block"
          />
        </button>

        {/* Desktop Navigation */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.key;
              const Icon = item.icon;
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(item.path)}
                  className={`flex items-center gap-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#083022]/10 dark:bg-[#6BBFAC]/10 text-[#083022] dark:text-[#6BBFAC] hover:bg-[#083022]/15 dark:hover:bg-[#6BBFAC]/15"
                      : "text-slate-500 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}

            {/* User Section */}
            <LanguageToggle />
            <ThemeToggle />
            <div className="ml-3 pl-3 border-l border-[#E0C4BC]/30 dark:border-white/15 flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-[#083022]/70 dark:text-slate-400">
                <div className="w-7 h-7 rounded-full bg-[#083022] flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="max-w-[120px] truncate">{user.fullName || user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-slate-400 hover:text-[#083022] hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        )}

        {/* Mobile Hamburger */}
        {user && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-[#083022] dark:text-slate-400 min-h-[44px] min-w-[44px]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}

        {/* Not logged in */}
        {!user && (
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              onClick={() => router.push("/auth")}
              size="sm"
              className="bg-[#E95331] hover:bg-[#d44a2b] text-white shadow-md shadow-[#E95331]/20 border-0"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {user && mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E0C4BC]/30 dark:border-white/10 bg-white/95 dark:bg-[#0d2a1f]/95 backdrop-blur-xl shadow-xl">
          <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.key;
              const Icon = item.icon;
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  size="sm"
                  onClick={() => { router.push(item.path); setMobileMenuOpen(false); }}
                  className={`justify-start gap-2 rounded-lg ${
                    isActive
                      ? "bg-[#083022]/10 dark:bg-[#6BBFAC]/10 text-[#083022] dark:text-[#6BBFAC]"
                      : "text-slate-500 dark:text-slate-400 hover:text-[#083022] dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
            <div className="border-t border-[#E0C4BC]/30 dark:border-white/10 my-2" />
            <div className="flex items-center gap-2 px-3 py-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <div className="border-t border-[#E0C4BC]/30 dark:border-white/10 my-2" />
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-[#083022] flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm text-[#083022]/70 dark:text-slate-400">{user.fullName || user.email}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="justify-start gap-2 text-slate-400 hover:text-[#E95331]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
