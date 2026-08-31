"use client";

import { useState, useEffect } from "react";
import { getCouncilMembers, createCouncilMember, updateCouncilMember, deleteCouncilMember } from "../../actions";

export default function CouncilAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', phone: '', imageUrl: '', order: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getCouncilMembers();
    setItems(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let finalUrl = formData.imageUrl;

    if (file) {
      const data = new FormData();
      data.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (json.url) {
        finalUrl = json.url;
      }
    }

    const payload = { ...formData, imageUrl: finalUrl, order: Number(formData.order) };

    if (editingId) {
      await updateCouncilMember(editingId, payload);
    } else {
      await createCouncilMember(payload);
    }
    
    setEditingId(null);
    setFormData({ name: '', role: '', phone: '', imageUrl: '', order: 0 });
    setFile(null);
    loadData();
  }

  async function handleDelete(id: string) {
    if (confirm('Bạn có chắc muốn xoá?')) {
      await deleteCouncilMember(id);
      loadData();
    }
  }

  function handleEdit(item: any) {
    setEditingId(item.id);
    setFormData({ name: item.name || '', role: item.role || '', phone: item.phone || '', imageUrl: item.imageUrl || '', order: item.order });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Ban Thường Vụ Hội Đồng Giáo Xứ</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Sửa' : 'Thêm mới'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ Tên</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chức vụ</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự</label>
              <input type="number" className="w-full border p-2 rounded" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Hình ảnh</label>
              <input type="file" className="w-full border p-2 rounded" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', role: '', phone: '', imageUrl: '', order: 0 }); }} className="bg-gray-400 text-white px-4 py-2 rounded">Hủy</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm flex items-center p-4">
            <img src={item.imageUrl || 'https://via.placeholder.150'} alt={item.name} className="w-16 h-16 rounded-full object-cover mr-4 border" />
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-red-500 font-semibold">{item.role}</p>
              <p className="text-sm text-gray-500">{item.phone}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline text-sm">Sửa</button>
                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm">Xoá</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
