"use client";

import { useState, useEffect } from "react";
import { getServices, createService, updateService, deleteService } from "../../actions";

export default function ServicesAdmin() {
  const [items, setItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ day: '', time: '', description: '', icon: 'bi-clock', order: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getServices();
    setItems(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...formData, order: Number(formData.order) };

    if (editingId) {
      await updateService(editingId, payload);
    } else {
      await createService(payload);
    }
    
    setEditingId(null);
    setFormData({ day: '', time: '', description: '', icon: 'bi-clock', order: 0 });
    loadData();
  }

  async function handleDelete(id: string) {
    if (confirm('Bạn có chắc muốn xoá?')) {
      await deleteService(id);
      loadData();
    }
  }

  function handleEdit(item: any) {
    setEditingId(item.id);
    setFormData({ day: item.day || '', time: item.time || '', description: item.description || '', icon: item.icon || 'bi-clock', order: item.order });
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lịch Giờ Lễ</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">{editingId ? 'Sửa' : 'Thêm mới'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ngày (VD: Chúa Nhật)</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.day} onChange={e => setFormData({...formData, day: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Giờ (VD: 04:30 - 16:15)</label>
              <input required type="text" className="w-full border p-2 rounded" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Mô tả (VD: Lễ thiếu nhi)</label>
              <input type="text" className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Thứ tự hiển thị</label>
              <input type="number" className="w-full border p-2 rounded" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded font-medium hover:bg-teal-700">Lưu</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ day: '', time: '', description: '', icon: 'bi-clock', order: 0 }); }} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">Hủy</button>}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-50 dark:bg-zinc-800">
            <tr>
              <th className="p-4 font-medium">Ngày</th>
              <th className="p-4 font-medium">Giờ lễ</th>
              <th className="p-4 font-medium">Mô tả</th>
              <th className="p-4 font-medium">Thứ tự</th>
              <th className="p-4 font-medium w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 font-semibold text-teal-700">{item.day}</td>
                <td className="p-4">{item.time}</td>
                <td className="p-4 text-gray-500">{item.description}</td>
                <td className="p-4">{item.order}</td>
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
                <td colSpan={5} className="p-8 text-center text-gray-500">Chưa có dữ liệu.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
