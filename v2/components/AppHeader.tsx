"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Home, MapPin, Plane, User, LogOut } from "lucide-react";

interface AppHeaderProps {
  currentPage?: "home" | "trips" | "locations" | "chat";
}

export function AppHeader({ currentPage }: AppHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">TOTO Trip</span>
        </button>

        {/* Navigation */}
        {user && (
          <nav className="flex items-center gap-2">
            <Button
              variant={currentPage === "home" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/")}
              className="hidden md:flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              首页
            </Button>
            <Button
              variant={currentPage === "trips" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/trips")}
              className="flex items-center gap-2"
            >
              <Plane className="h-4 w-4" />
              <span className="hidden sm:inline">我的行程</span>
            </Button>
            <Button
              variant={currentPage === "locations" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/locations")}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">我的地点</span>
            </Button>

            {/* User Menu */}
            <div className="ml-4 pl-4 border-l border-gray-200 flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{user.fullName || user.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">退出</span>
              </Button>
            </div>
          </nav>
        )}

        {/* Not logged in */}
        {!user && (
          <Button
            variant="outline"
            onClick={() => router.push("/auth")}
          >
            登录
          </Button>
        )}
      </div>
    </header>
  );
}
