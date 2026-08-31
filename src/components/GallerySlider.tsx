"use client";

import { useState, useEffect } from "react";

export default function GallerySlider({ items }: { items: any[] }) {
  const itemsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  if (!items || items.length === 0) return null;

  const currentItems = items.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePrev = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    if (totalPages <= 1) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
    }, 5000); // Tự động slide mỗi 5 giây
    return () => clearInterval(interval);
  }, [totalPages]);

  // Dummy items to prevent grid stretching when there are few items on the last page
  const emptySlots = itemsPerPage - currentItems.length;
  const placeholders = Array.from({ length: Math.max(0, emptySlots) }).map((_, i) => (
    <div key={`empty-${i}`} style={{ visibility: 'hidden', pointerEvents: 'none', height: '250px' }}></div>
  ));

  return (
    <div style={{ position: 'relative' }}>
      <div className="gallery-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', minHeight: '300px' }}>
        {currentItems.map(item => (
          <div key={item.id} className="gallery-card" style={{ borderRadius: '12px', overflow: 'hidden', position: 'relative', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
            {item.type === 'IMAGE' ? (
              <div style={{ height: '250px', backgroundImage: `url(${item.url})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.3s' }} className="gallery-img"></div>
            ) : (
              <div style={{ height: '250px', position: 'relative' }}>
                <iframe src={item.url} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen></iframe>
              </div>
            )}
            <div className="gallery-overlay" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '20px 15px 15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  {item.tags && <span style={{ display: 'inline-block', background: '#0f766e', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', marginBottom: '8px', textTransform: 'uppercase' }}>{item.tags}</span>}
                  <h3 style={{ fontSize: '16px', margin: 0, color: 'white' }}>{item.title}</h3>
                </div>
                {item.date && <span style={{ fontSize: '12px', color: '#9ca3af' }}>{item.date}</span>}
              </div>
            </div>
          </div>
        ))}
        {placeholders}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', gap: '15px' }}>
          <button onClick={handlePrev} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
            &larr;
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <div key={idx} onClick={() => setCurrentPage(idx)} style={{ width: '10px', height: '10px', borderRadius: '50%', background: idx === currentPage ? '#0f766e' : 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: '0.2s' }}></div>
            ))}
          </div>

          <button onClick={handleNext} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.2s' }} onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
