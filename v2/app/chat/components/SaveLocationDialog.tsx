"use client";

import { useState, useEffect } from "react";
import { Location } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Calendar, Plus } from "lucide-react";

interface Trip {
  id: string;
  title: string;
  destination_city: string | null;
  destination_country: string;
}

interface SaveLocationDialogProps {
  location: Location | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location, tripId?: string, visitDate?: string) => Promise<void>;
  sessionToken?: string;
}

export function SaveLocationDialog({
  location,
  isOpen,
  onClose,
  onSave,
  sessionToken,
}: SaveLocationDialogProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [addToTrip, setAddToTrip] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [visitDate, setVisitDate] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTrips, setIsLoadingTrips] = useState(false);

  // Load trips when dialog opens
  useEffect(() => {
    if (isOpen && sessionToken) {
      loadTrips();
    }
  }, [isOpen, sessionToken]);

  const loadTrips = async () => {
    if (!sessionToken) return;

    setIsLoadingTrips(true);
    try {
      const response = await fetch("/api/trips", {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTrips(data.trips || []);
      }
    } catch (error) {
      console.error("Error loading trips:", error);
    } finally {
      setIsLoadingTrips(false);
    }
  };

  const handleSave = async () => {
    if (!location) return;

    setIsSaving(true);
    try {
      await onSave(
        location,
        addToTrip && selectedTripId ? selectedTripId : undefined,
        addToTrip && visitDate ? visitDate : undefined
      );
      handleClose();
    } catch (error) {
      console.error("Error saving location:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setAddToTrip(false);
    setSelectedTripId("");
    setVisitDate("");
    onClose();
  };

  if (!location) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>保存地点</DialogTitle>
          <DialogDescription>
            将 {location.name} 保存到您的收藏
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Location Preview */}
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{location.name}</p>
              {location.address && (
                <p className="text-xs text-gray-600 truncate">{location.address}</p>
              )}
            </div>
          </div>

          {/* Add to Trip Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="addToTrip"
              checked={addToTrip}
              onCheckedChange={(checked) => setAddToTrip(checked as boolean)}
            />
            <label
              htmlFor="addToTrip"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              同时添加到行程
            </label>
          </div>

          {/* Trip Selection */}
          {addToTrip && (
            <div className="space-y-3 pl-6 border-l-2 border-blue-200">
              <div className="space-y-2">
                <Label htmlFor="trip">选择行程</Label>
                <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                  <SelectTrigger id="trip">
                    <SelectValue placeholder={isLoadingTrips ? "加载中..." : "选择一个行程"} />
                  </SelectTrigger>
                  <SelectContent>
                    {trips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id}>
                        {trip.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {trips.length === 0 && !isLoadingTrips && (
                  <p className="text-xs text-gray-500">
                    还没有行程。请先创建一个行程。
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="visitDate">计划访问日期（可选）</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <Input
                    id="visitDate"
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving || (addToTrip && !selectedTripId)}
              className="flex-1"
            >
              {isSaving ? "保存中..." : "保存"}
            </Button>
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSaving}
            >
              取消
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
