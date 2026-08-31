"use client";

import { useState } from "react";
import { createPost, deletePost } from "../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PostsAdmin({
  searchParams,
}: {
  searchParams: { posts: string }
}) {
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    let finalUrl = formData.get("imageUrl") as string;
    if (file) {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (json.url) {
        finalUrl = json.url;
      }
    }

    await createPost({
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      type: formData.get("type") as string,
      imageUrl: finalUrl,
    });
    setLoading(false);
    e.currentTarget.reset();
    setFile(null);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Quản lý Bài Viết</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Đăng bài mới</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tiêu đề</label>
            <Input name="title" required placeholder="Nhập tiêu đề..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Loại</label>
            <select name="type" className="w-full p-2 border rounded-md dark:bg-zinc-950 dark:border-zinc-800" required>
              <option value="ANNOUNCEMENT">Thông báo</option>
              <option value="FEATURED">Nổi bật</option>
              <option value="NEWS">Tin tức</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hình ảnh (Upload File hoặc nhập URL)</label>
            <div className="flex gap-2">
              <input type="file" className="flex-1 p-2 border rounded-md dark:bg-zinc-950 dark:border-zinc-800" onChange={e => setFile(e.target.files?.[0] || null)} />
              <Input name="imageUrl" placeholder="https://..." className="flex-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nội dung</label>
            <Textarea name="content" required rows={5} placeholder="Nhập nội dung..." />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Đăng bài"}
          </Button>
        </form>
      </div>
    </div>
  );
}
