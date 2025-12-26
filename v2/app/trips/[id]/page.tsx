"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Edit,
  Trash2,
  ArrowLeft,
  Plus
} from "lucide-react";
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

interface SavedLocation {
  id: string;
  name: string;
  description: string | null;
  category: string;
  address: string | null;
  city: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  visit_date: string | null;
  notes: string | null;
  rating: number | null;
  price_level: number | null;
  opening_hours: string | null;
  contact_info: string | null;
  image_urls: string[] | null;
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

const categoryLabels: Record<string, string> = {
  attraction: "景点",
  restaurant: "餐厅",
  hotel: "酒店",
  shopping: "购物",
  transport: "交通",
  other: "其他",
};

export default function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { session } = useAuth();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [tripId, setTripId] = useState<string>("");

  useEffect(() => {
    params.then((resolvedParams) => {
      setTripId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (!session) {
      router.push("/login");
      return;
    }

    if (tripId) {
      loadTrip();
    }
  }, [session, router, tripId]);

  const loadTrip = async () => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trip");
      }

      const data = await response.json();
      setTrip(data.trip);
      setLocations(data.locations || []);
    } catch (error) {
      console.error("Error loading trip:", error);
      toast.error("加载行程失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!confirm("确定要删除这个行程吗？此操作不可恢复。")) {
      return;
    }

    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete trip");
      }

      toast.success("行程已删除");
      router.push("/trips");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("删除行程失败");
    }
  };

  const handleRemoveLocation = async (locationId: string) => {
    if (!confirm("确定要从行程中移除这个地点吗？")) {
      return;
    }

    try {
      const response = await fetch(`/api/trips/${tripId}/locations`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ locationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove location");
      }

      setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
      toast.success("地点已移除");
    } catch (error) {
      console.error("Error removing location:", error);
      toast.error("移除地点失败");
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

  if (!trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <p className="text-gray-500 mb-4">行程不存在</p>
          <Button onClick={() => router.push("/trips")}>返回行程列表</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="trips" />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/trips")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回行程列表
          </Button>

        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{trip.title}</h1>
              <Badge className={statusColors[trip.status]}>
                {statusLabels[trip.status]}
              </Badge>
            </div>
            {trip.description && (
              <p className="text-gray-600 mt-2">{trip.description}</p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/trips/${tripId}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              编辑
            </Button>
            <Button variant="destructive" onClick={handleDeleteTrip}>
              <Trash2 className="h-4 w-4 mr-2" />
              删除
            </Button>
          </div>
        </div>
      </div>

      {trip.cover_image_url && (
        <div className="mb-6 h-64 w-full overflow-hidden rounded-lg">
          <img
            src={trip.cover_image_url}
            alt={trip.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">目的地</p>
                <p className="font-semibold">
                  {trip.destination_city
                    ? `${trip.destination_city}, ${trip.destination_country}`
                    : trip.destination_country}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">日期</p>
                <p className="font-semibold">
                  {trip.start_date && formatDate(trip.start_date)}
                  {trip.start_date && trip.end_date && " - "}
                  {trip.end_date && formatDate(trip.end_date)}
                  {!trip.start_date && !trip.end_date && "未设置"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">旅行人数</p>
                <p className="font-semibold">{trip.travelers_count} 人</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">预算</p>
                <p className="font-semibold">
                  {trip.total_budget
                    ? `${trip.total_budget} ${trip.currency}`
                    : "未设置"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-2xl font-bold">行程地点</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            onClick={() => router.push(`/locations?from=trip&tripId=${tripId}`)}
            className="flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4 mr-2" />
            从已保存地点添加
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/chat")}
            className="flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4 mr-2" />
            AI推荐地点
          </Button>
        </div>
      </div>

      {locations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">还没有添加地点</p>
            <Button onClick={() => router.push("/locations")}>
              浏览已保存的地点
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <Card key={location.id}>
              {location.image_urls && location.image_urls.length > 0 && (
                <div className="h-40 w-full overflow-hidden rounded-t-lg">
                  <img
                    src={location.image_urls[0]}
                    alt={location.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    <Badge variant="outline" className="mt-2">
                      {categoryLabels[location.category] || location.category}
                    </Badge>
                  </div>
                </div>
                {location.description && (
                  <CardDescription className="line-clamp-2 mt-2">
                    {location.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                {location.visit_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>计划访问: {formatDate(location.visit_date)}</span>
                  </div>
                )}
                {location.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{location.address}</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveLocation(location.id)}
                  className="w-full"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  从行程中移除
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
