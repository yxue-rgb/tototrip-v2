"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";

export default function NewTripPage() {
  const { session } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destinationCity: "",
    destinationCountry: "China",
    startDate: "",
    endDate: "",
    totalBudget: "",
    currency: "CNY",
    travelersCount: "1",
    coverImageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("请先登录");
      router.push("/login");
      return;
    }

    if (!formData.title || !formData.destinationCountry) {
      toast.error("请填写行程标题和目的地国家");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || null,
          destinationCity: formData.destinationCity || null,
          destinationCountry: formData.destinationCountry,
          startDate: formData.startDate || null,
          endDate: formData.endDate || null,
          totalBudget: formData.totalBudget ? parseFloat(formData.totalBudget) : null,
          currency: formData.currency,
          travelersCount: parseInt(formData.travelersCount),
          coverImageUrl: formData.coverImageUrl || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create trip");
      }

      const data = await response.json();
      toast.success("行程创建成功！");
      router.push(`/trips/${data.trip.id}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      toast.error("创建行程失败");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader currentPage="trips" />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/trips")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回
        </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">创建新行程</CardTitle>
          <CardDescription>填写行程信息，开始规划您的旅行</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                行程标题 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="例如：北京5日游"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">行程描述</Label>
              <Textarea
                id="description"
                placeholder="简单描述一下这次旅行的主题或目的..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destinationCountry">
                  目的地国家 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="destinationCountry"
                  placeholder="例如：China"
                  value={formData.destinationCountry}
                  onChange={(e) => handleChange("destinationCountry", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationCity">目的地城市</Label>
                <Input
                  id="destinationCity"
                  placeholder="例如：北京"
                  value={formData.destinationCity}
                  onChange={(e) => handleChange("destinationCity", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">开始日期</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">结束日期</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  min={formData.startDate}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalBudget">总预算</Label>
                <Input
                  id="totalBudget"
                  type="number"
                  placeholder="例如：5000"
                  value={formData.totalBudget}
                  onChange={(e) => handleChange("totalBudget", e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">货币</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleChange("currency", value)}
                >
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CNY">CNY - 人民币</SelectItem>
                    <SelectItem value="USD">USD - 美元</SelectItem>
                    <SelectItem value="EUR">EUR - 欧元</SelectItem>
                    <SelectItem value="GBP">GBP - 英镑</SelectItem>
                    <SelectItem value="JPY">JPY - 日元</SelectItem>
                    <SelectItem value="KRW">KRW - 韩元</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="travelersCount">旅行人数</Label>
              <Input
                id="travelersCount"
                type="number"
                placeholder="1"
                value={formData.travelersCount}
                onChange={(e) => handleChange("travelersCount", e.target.value)}
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImageUrl">封面图片URL（可选）</Label>
              <Input
                id="coverImageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.coverImageUrl}
                onChange={(e) => handleChange("coverImageUrl", e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "创建中..." : "创建行程"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/trips")}
                disabled={loading}
              >
                取消
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
