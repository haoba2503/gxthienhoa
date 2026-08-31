"use client";

import { useState } from "react";

export default function Announcements({ items }: { items: any[] }) {
  const [selected, setSelected] = useState<any>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  if (!items || items.length === 0) return null;

  return (
    <>
      <div className="announce-list">
        {items.map(item => (
          <div key={item.id} className="announce-item" style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(245, 158, 11, 0.1)', borderLeft: '4px solid #f59e0b', marginBottom: '15px', cursor: 'pointer' }} onClick={() => setSelected(item)}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              {item.imageUrl && !imgErrors[item.id] ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} 
                  onError={() => setImgErrors(prev => ({ ...prev, [item.id]: true }))} 
                />
              ) : (
                <div style={{ width: '80px', height: '80px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className="bi bi-bell-fill" style={{ fontSize: '30px', color: '#f59e0b', animation: 'ring 2s infinite' }}></i>
                </div>
              )}
              <div>
                <h3 style={{ fontSize: '18px', color: '#92400e', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: '#b45309', fontSize: '15px', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.content}</p>
                <span style={{ fontSize: '13px', color: '#d97706', marginTop: '5px', display: 'inline-block', fontWeight: 'bold' }}>Xem chi tiết &rarr;</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelected(null)}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#f3f4f6', border: 'none', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px' }}>&times;</button>
            {selected.imageUrl && (
              <img src={selected.imageUrl} alt={selected.title} style={{ width: '100%', height: '300px', objectFit: 'cover', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }} />
            )}
            <div style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '24px', color: '#92400e', marginBottom: '15px' }}>{selected.title}</h2>
              <div style={{ color: '#4b5563', fontSize: '16px', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{selected.content}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
