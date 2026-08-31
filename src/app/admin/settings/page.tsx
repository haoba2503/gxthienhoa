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
    const address = formData.get("contact_address") as string;
    const phone = formData.get("contact_phone") as string;
    const history = formData.get("history_text") as string;
    
    if (title !== null) await updateSetting("hero_title", title);
    if (subtitle !== null) await updateSetting("hero_subtitle", subtitle);
    if (address !== null) await updateSetting("contact_address", address);
    if (phone !== null) await updateSetting("contact_phone", phone);
    if (history !== null) await updateSetting("history_text", history);
    
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
          <div className="grid gap-2 mt-4">
            <h3 className="text-lg font-bold border-b pb-2">Liên Hệ</h3>
            <label className="text-sm font-medium text-gray-700">Địa chỉ nhà thờ</label>
            <Input name="contact_address" placeholder="VD: Thôn 4, Quảng Tín, Đắk R'Lấp, Đắk Nông" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium text-gray-700">Điện thoại VP Giáo Xứ</label>
            <Input name="contact_phone" placeholder="VD: 0261.3.123.456" />
          </div>
          <div className="grid gap-2 mt-4">
            <h3 className="text-lg font-bold border-b pb-2">Lịch Sử Giáo Xứ</h3>
            <label className="text-sm font-medium text-gray-700">Đoạn văn giới thiệu lịch sử</label>
            <textarea name="history_text" className="w-full border border-gray-300 p-3 rounded-md" rows={6} placeholder="Nhập nội dung lịch sử hình thành giáo xứ..."></textarea>
          </div>
          <Button type="submit" disabled={loading} className="mt-4">
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </form>
      </div>
    </div>
  );
}
