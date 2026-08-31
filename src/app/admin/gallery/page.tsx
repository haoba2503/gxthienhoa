"use client";

import { useState, useEffect } from "react";
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from "../../actions";

export default function GalleryAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', url: '', type: 'IMAGE', date: '', tags: '', order: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getGalleryItems();
    setItems(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let finalUrl = formData.url;

    if (file) {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (json.url) {
        finalUrl = json.url;
      }
    }

    const payload = { ...formData, url: finalUrl, order: Number(formData.order) };

    if (editingId) {
      await updateGalleryItem(editingId, payload);
    } else {
      await createGalleryItem(payload);
    }
    
    setEditingId(null);
    setFormData({ title: '', url: '', type: 'IMAGE', date: '', tags: '', order: 0 });
    setFile(null);
    loadData();
  }

  async function handleDelete(id: string) {
    if (confirm('Bạn có chắc muốn xoá?')) {
      await deleteGalleryItem(id);
      loadData();
    }
  }

  function handleEdit(item: any) {
    setEditingId(item.id);
    setFormData({ title: item.title || '', url: item.url, type: item.type, date: item.date || '', tags: item.tags || '', order: item.order });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Thư Viện Ảnh & Video</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Sửa' : 'Thêm mới'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Loại</label>
              <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="IMAGE">Hình Ảnh</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload File (Nếu là Ảnh)</label>
              <input type="file" className="w-full border p-2 rounded" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Hoặc URL (Link YouTube)</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Ngày tháng</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thẻ (Tags)</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự</label>
              <input type="number" className="w-full border p-2 rounded" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ title: '', url: '', type: 'IMAGE', date: '', tags: '', order: 0 }); }} className="bg-gray-400 text-white px-4 py-2 rounded">Hủy</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm">
            {item.type === 'IMAGE' ? (
              <img src={item.url} alt={item.title} className="w-full h-40 object-cover" />
            ) : (
              <iframe src={item.url} className="w-full h-40" />
            )}
            <div className="p-4">
              <h3 className="font-bold">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.date} • {item.tags}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Sửa</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">Xoá</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
