"use client";

import { useState, useEffect } from "react";
import { getZones, createZone, updateZone, deleteZone } from "../../actions";

export default function ZonesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', patron: '', description: '', contactInfo: '', membersCount: 0, imageUrl: '', order: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getZones();
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

    const payload = { ...formData, imageUrl: finalUrl, order: Number(formData.order), membersCount: Number(formData.membersCount) };

    if (editingId) {
      await updateZone(editingId, payload);
    } else {
      await createZone(payload);
    }
    
    setEditingId(null);
    setFormData({ name: '', patron: '', description: '', contactInfo: '', membersCount: 0, imageUrl: '', order: 0 });
    setFile(null);
    loadData();
  }

  async function handleDelete(id: string) {
    if (confirm('Bạn có chắc muốn xoá?')) {
      await deleteZone(id);
      loadData();
    }
  }

  function handleEdit(item: any) {
    setEditingId(item.id);
    setFormData({ 
      name: item.name || '', 
      patron: item.patron || '', 
      description: item.description || '', 
      contactInfo: item.contactInfo || '',
      membersCount: item.membersCount || 0,
      imageUrl: item.imageUrl || '', 
      order: item.order 
    });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Các Giáo Khu</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Sửa Giáo Khu' : 'Thêm Giáo Khu Mới'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên Giáo Khu</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="VD: Giáo khu 1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bổn mạng</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.patron} onChange={e => setFormData({...formData, patron: e.target.value})} placeholder="VD: Thánh Giuse" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Mô tả giới thiệu</label>
              <textarea className="w-full border p-2 rounded" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Liên hệ (Ông Trùm)</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.contactInfo} onChange={e => setFormData({...formData, contactInfo: e.target.value})} placeholder="Tên và SĐT" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Số lượng thành viên/gia đình</label>
              <input type="number" className="w-full border p-2 rounded" value={formData.membersCount} onChange={e => setFormData({...formData, membersCount: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự hiển thị</label>
              <input type="number" className="w-full border p-2 rounded" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Upload Hình ảnh (Tuỳ chọn)</label>
              <input type="file" className="w-full border p-2 rounded" onChange={e => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded font-medium hover:bg-teal-700">Lưu Giáo Khu</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', patron: '', description: '', contactInfo: '', membersCount: 0, imageUrl: '', order: 0 }); }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Hủy</button>}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="p-4 font-medium">Tên Giáo Khu</th>
              <th className="p-4 font-medium">Bổn mạng</th>
              <th className="p-4 font-medium">Liên hệ</th>
              <th className="p-4 font-medium">Thành viên</th>
              <th className="p-4 font-medium w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-semibold text-teal-700">
                  <div className="flex items-center gap-3">
                    {item.imageUrl && <img src={item.imageUrl} className="w-10 h-10 rounded-full object-cover" />}
                    {item.name}
                  </div>
                </td>
                <td className="p-4">{item.patron}</td>
                <td className="p-4">{item.contactInfo}</td>
                <td className="p-4">{item.membersCount}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 px-2 py-1 bg-blue-50 rounded">Sửa</button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 px-2 py-1 bg-red-50 rounded">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có giáo khu nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
