"use client";

import { useState } from "react";
import { updateSetting } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const title = formData.get("hero_title") as string;
    const subtitle = formData.get("hero_subtitle") as string;
    
    if (title) await updateSetting("hero_title", title);
    if (subtitle) await updateSetting("hero_subtitle", subtitle);
    
    setLoading(false);
    alert("Đã lưu cài đặt!");
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Cài Đặt Giao Diện</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Tên Giáo Xứ (Hero Title)</label>
            <Input name="hero_title" placeholder="VD: GIÁO XỨ THIÊN HOA" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Tiêu đề phụ (Hero Subtitle)</label>
            <Input name="hero_subtitle" placeholder="VD: Giáo Phận Buôn Ma Thuột" />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </div>
    </div>
  );
}
