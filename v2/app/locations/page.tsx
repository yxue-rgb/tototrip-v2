"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, MapPin, Loader2, Plus } from "lucide-react";
import { LocationCard } from "@/app/chat/components/LocationCard";
import { Location } from "@/lib/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AppHeader } from "@/components/AppHeader";

interface SavedLocation extends Location {
  id: string;
  created_at: string;
  visited: boolean;
  notes?: string;
  user_rating?: number;
  trip_id?: string | null;
}

interface Trip {
  id: string;
  title: string;
  destination_city: string | null;
  destination_country: string;
}

function LocationsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, user } = useAuth();
  const [locations, setLocations] = useState<SavedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [showAddToTripDialog, setShowAddToTripDialog] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<SavedLocation | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [visitDate, setVisitDate] = useState<string>("");
  const [isAddingToTrip, setIsAddingToTrip] = useState(false);

  // Get query params for trip context
  const fromTrip = searchParams?.get("from") === "trip";
  const contextTripId = searchParams?.get("tripId") || "";

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }

    loadLocations();
    loadTrips();
  }, [user, router]);

  const loadLocations = async () => {
    if (!session?.access_token) return;

    try {
      setIsLoading(true);
      const response = await fetch("/api/locations", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations || []);
      } else {
        toast.error("Failed to load locations");
      }
    } catch (error) {
      console.error("Error loading locations:", error);
      toast.error("Failed to load locations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    if (!confirm("Are you sure you want to delete this location?")) {
      return;
    }

    try {
      const response = await fetch(`/api/locations/${locationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.ok) {
        setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
        toast.success("Location deleted");
      } else {
        toast.error("Failed to delete location");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location");
    }
  };

  const loadTrips = async () => {
    if (!session?.access_token) return;

    try {
      const response = await fetch("/api/trips", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips || []);
      }
    } catch (error) {
      console.error("Error loading trips:", error);
    }
  };

  const handleAddToTrip = (location: SavedLocation) => {
    setSelectedLocation(location);
    // If coming from a trip page, pre-select that trip
    if (fromTrip && contextTripId) {
      setSelectedTripId(contextTripId);
    }
    setShowAddToTripDialog(true);
  };

  const handleAddLocationToTrip = async () => {
    if (!selectedTripId || !selectedLocation) {
      toast.error("Please select a trip");
      return;
    }

    setIsAddingToTrip(true);

    try {
      const response = await fetch(`/api/trips/${selectedTripId}/locations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          locationId: selectedLocation.id,
          visitDate: visitDate || null,
        }),
      });

      if (response.ok) {
        toast.success("地点已添加到行程");
        setShowAddToTripDialog(false);
        setSelectedLocation(null);
        setSelectedTripId("");
        setVisitDate("");
        loadLocations(); // Reload to update trip_id

        // If coming from a trip page, navigate back to it
        if (fromTrip && contextTripId) {
          setTimeout(() => {
            router.push(`/trips/${contextTripId}`);
          }, 1000); // Small delay to show the success message
        }
      } else {
        toast.error("添加失败");
      }
    } catch (error) {
      console.error("Error adding location to trip:", error);
      toast.error("添加失败");
    } finally {
      setIsAddingToTrip(false);
    }
  };

  const categories = [
    { value: "all", label: "All" },
    { value: "restaurant", label: "Restaurants" },
    { value: "attraction", label: "Attractions" },
    { value: "hotel", label: "Hotels" },
    { value: "shopping", label: "Shopping" },
    { value: "transport", label: "Transport" },
    { value: "other", label: "Other" },
  ];

  const filteredLocations =
    selectedCategory === "all"
      ? locations
      : locations.filter((loc) => loc.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your saved locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="locations" />

      {/* Sub-header with context info */}
      {fromTrip && (
        <div className="bg-blue-50 border-b border-blue-100 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/trips/${contextTripId}`)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  返回行程
                </Button>
                <p className="text-sm text-blue-700 font-medium">
                  点击 + 按钮将地点添加到您的行程
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">我的地点</h1>
          <p className="text-gray-600">
            {locations.length} 个已保存的地点
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
                className="whitespace-nowrap"
              >
                {cat.label}
                {cat.value !== "all" && (
                  <span className="ml-1 text-xs">
                    (
                    {
                      locations.filter((loc) => loc.category === cat.value)
                        .length
                    }
                    )
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Locations Grid */}
        {filteredLocations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {selectedCategory === "all"
                ? "No saved locations yet"
                : `No ${selectedCategory} locations saved`}
            </h3>
            <p className="text-gray-600 mb-6">
              Start chatting with AI to get location recommendations and save them!
            </p>
            <Button onClick={() => router.push("/")}>
              Start Planning Your Trip
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLocations.map((location) => (
              <div key={location.id} className="relative">
                <LocationCard
                  location={location}
                  onClick={() => {
                    // Could open a detail modal here
                  }}
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToTrip(location);
                    }}
                    title="Add to trip"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLocation(location.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add to Trip Dialog */}
      <Dialog open={showAddToTripDialog} onOpenChange={setShowAddToTripDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加地点到行程</DialogTitle>
            <DialogDescription>
              将 {selectedLocation?.name} 添加到您的行程中
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="trip">选择行程</Label>
              <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                <SelectTrigger id="trip">
                  <SelectValue placeholder="选择一个行程" />
                </SelectTrigger>
                <SelectContent>
                  {trips.map((trip) => (
                    <SelectItem key={trip.id} value={trip.id}>
                      {trip.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {trips.length === 0 && (
                <p className="text-sm text-gray-500">
                  还没有行程。{" "}
                  <button
                    onClick={() => router.push("/trips/new")}
                    className="text-blue-600 hover:underline"
                  >
                    创建第一个行程
                  </button>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="visitDate">计划访问日期（可选）</Label>
              <Input
                id="visitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleAddLocationToTrip}
                disabled={!selectedTripId || isAddingToTrip}
                className="flex-1"
              >
                {isAddingToTrip ? "添加中..." : "添加到行程"}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddToTripDialog(false);
                  setSelectedLocation(null);
                  setSelectedTripId("");
                  setVisitDate("");
                }}
              >
                取消
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function LocationsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <LocationsPageContent />
    </Suspense>
  );
}
