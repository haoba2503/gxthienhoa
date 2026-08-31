"use client";

import { useState, useEffect } from "react";
import { getPriests, createPriest, updatePriest, deletePriest } from "../../actions";

export default function PriestsAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', period: '', description: '', imageUrl: '', isCurrent: false, order: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getPriests();
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
      await updatePriest(editingId, payload);
    } else {
      await createPriest(payload);
    }
    
    setEditingId(null);
    setFormData({ name: '', role: '', period: '', description: '', imageUrl: '', isCurrent: false, order: 0 });
    setFile(null);
    loadData();
  }

  async function handleDelete(id: string) {
    if (confirm('Bạn có chắc muốn xoá?')) {
      await deletePriest(id);
      loadData();
    }
  }

  function handleEdit(item: any) {
    setEditingId(item.id);
    setFormData({ name: item.name || '', role: item.role || '', period: item.period || '', description: item.description || '', imageUrl: item.imageUrl || '', isCurrent: item.isCurrent || false, order: item.order });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Quản lý Quý Cha</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Sửa' : 'Thêm mới'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Họ Tên</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vai trò (Chức vụ)</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thời gian quản xứ</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Đương nhiệm?</label>
              <select className="w-full border p-2 rounded" value={formData.isCurrent ? 'yes' : 'no'} onChange={e => setFormData({...formData, isCurrent: e.target.value === 'yes'})}>
                <option value="yes">Có</option>
                <option value="no">Không</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Mô tả thêm</label>
              <textarea className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Hình ảnh</label>
              <input type="file" className="w-full border p-2 rounded" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự</label>
              <input type="number" className="w-full border p-2 rounded" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', role: '', period: '', description: '', imageUrl: '', isCurrent: false, order: 0 }); }} className="bg-gray-400 text-white px-4 py-2 rounded">Hủy</button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white dark:bg-zinc-900 border rounded-xl overflow-hidden shadow-sm flex p-4">
            <img src={item.imageUrl || 'https://via.placeholder.150'} alt={item.name} className="w-24 h-32 object-cover mr-4 rounded border" />
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm font-semibold text-blue-600">{item.role}</p>
              <p className="text-sm text-gray-500">{item.period}</p>
              {item.isCurrent && <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1">Đương nhiệm</span>}
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
