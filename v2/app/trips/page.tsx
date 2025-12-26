"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, DollarSign, Plus } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";

interface Trip {
  id: string;
  title: string;
  description: string | null;
  destination_city: string | null;
  destination_country: string;
  start_date: string | null;
  end_date: string | null;
  total_budget: number | null;
  currency: string;
  travelers_count: number;
  status: "planning" | "booked" | "ongoing" | "completed" | "cancelled";
  is_public: boolean;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors = {
  planning: "bg-blue-500",
  booked: "bg-green-500",
  ongoing: "bg-yellow-500",
  completed: "bg-gray-500",
  cancelled: "bg-red-500",
};

const statusLabels = {
  planning: "计划中",
  booked: "已预订",
  ongoing: "进行中",
  completed: "已完成",
  cancelled: "已取消",
};

export default function TripsPage() {
  const { session, user } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    loadTrips();
  }, [session, router]);

  const loadTrips = async () => {
    try {
      const response = await fetch("/api/trips", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }

      const data = await response.json();
      setTrips(data.trips || []);
    } catch (error) {
      console.error("Error loading trips:", error);
      toast.error("加载行程失败");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCreateTrip = () => {
    router.push("/trips/new");
  };

  const handleTripClick = (tripId: string) => {
    router.push(`/trips/${tripId}`);
  };

  if (!session) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="trips" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">我的行程</h1>
            <p className="text-gray-500 mt-2">管理您的旅行计划</p>
          </div>
          <Button onClick={handleCreateTrip} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            创建新行程
          </Button>
        </div>

      {trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <MapPin className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">还没有行程</h2>
          <p className="text-gray-500 mb-6">开始规划您的第一次旅行吧！</p>
          <Button onClick={handleCreateTrip} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            创建第一个行程
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card
              key={trip.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTripClick(trip.id)}
            >
              {trip.cover_image_url && (
                <div className="h-48 w-full overflow-hidden rounded-t-lg">
                  <img
                    src={trip.cover_image_url}
                    alt={trip.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl">{trip.title}</CardTitle>
                  <Badge className={statusColors[trip.status]}>
                    {statusLabels[trip.status]}
                  </Badge>
                </div>
                {trip.description && (
                  <CardDescription className="line-clamp-2">
                    {trip.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {trip.destination_city
                      ? `${trip.destination_city}, ${trip.destination_country}`
                      : trip.destination_country}
                  </span>
                </div>

                {(trip.start_date || trip.end_date) && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {trip.start_date && formatDate(trip.start_date)}
                      {trip.start_date && trip.end_date && " - "}
                      {trip.end_date && formatDate(trip.end_date)}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {trip.travelers_count > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{trip.travelers_count} 人</span>
                    </div>
                  )}

                  {trip.total_budget && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {trip.total_budget} {trip.currency}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="text-xs text-gray-400">
                创建于 {formatDate(trip.created_at)}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
