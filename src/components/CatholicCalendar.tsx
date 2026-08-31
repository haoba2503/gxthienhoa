"use client";

import { useState, useEffect } from "react";

// Từ điển thu gọn dịch tiếng Anh sang Tiếng Việt
const EN_TO_VN: Record<string, string> = {
  "Ordinary Time": "Mùa Thường Niên",
  "Lent": "Mùa Chay",
  "Easter": "Mùa Phục Sinh",
  "Advent": "Mùa Vọng",
  "Christmas": "Mùa Giáng Sinh",
  "Sunday": "Chúa Nhật",
  "Feast": "Lễ Kính",
  "Solemnity": "Lễ Trọng",
  "Memorial": "Lễ Nhớ",
  "Saint": "Thánh",
  "St.": "Thánh",
  "Sts.": "Các Thánh",
  "Mary": "Đức Mẹ",
  "John": "Gioan",
  "Peter": "Phêrô",
  "Paul": "Phaolô",
  "Joseph": "Giuse",
  "Teresa": "Têrêsa",
  "Monica": "Mônica",
  "Augustine": "Âutinô",
  "Assumption": "Đức Mẹ Lên Trời",
  "Immaculate Conception": "Đức Mẹ Vô Nhiễm",
  "All Saints": "Các Thánh Nam Nữ",
  "All Souls": "Cầu Cho Các Tín Hữu Đã Qua Đời",
  "Christ the King": "Chúa Kitô Vua",
  "Ascension": "Chúa Giêsu Lên Trời",
  "Pentecost": "Chúa Thánh Thần Hiện Xuống",
  "Corpus Christi": "Mình và Máu Thánh Chúa Kitô",
  "Sacred Heart": "Thánh Tâm Chúa Giêsu",
  "Annunciation": "Lễ Truyền Tin",
  "Transfiguration": "Chúa Hiển Dung",
  "Presentation": "Dâng Chúa Trong Đền Thánh",
  "Baptism of the Lord": "Chúa Giêsu Chịu Phép Rửa",
  "Holy Trinity": "Chúa Ba Ngôi",
  "Ash Wednesday": "Thứ Tư Lễ Tro",
  "Holy Thursday": "Thứ Năm Tuần Thánh",
  "Good Friday": "Thứ Sáu Tuần Thánh",
  "Holy Saturday": "Thứ Bảy Tuần Thánh"
};

function translate(text: string) {
  if (!text) return text;
  let translated = text;
  for (const [en, vn] of Object.entries(EN_TO_VN)) {
    // Regex to match whole words or common prefix
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, vn);
  }
  // Một số xử lý thủ công cho chữ 'of'
  translated = translated.replace(/ of /gi, ' của ');
  translated = translated.replace(/ the /gi, ' ');
  return translated;
}

export default function CatholicCalendar() {
  const [date, setDate] = useState(() => {
    const d = new Date();
    // Chỉnh giờ về VN
    return new Date(d.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  });
  
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const todayStr = new Date().toLocaleString('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' });

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/calendar?year=${year}&month=${month}`)
      .then(res => res.json())
      .then(data => {
        if (active) {
          if (Array.isArray(data)) setDays(data);
          setLoading(false);
        }
      })
      .catch(e => {
        console.error("Calendar fetch error:", e);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [year, month]);

  const handlePrev = () => setDate(new Date(year, month - 2, 1));
  const handleNext = () => setDate(new Date(year, month, 1));
  const handleToday = () => setDate(new Date());

  // Generate calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month, 0).getDate();
  const blanks = Array.from({ length: firstDay }).map((_, i) => <div key={`blank-${i}`} className="calendar-day blank"></div>);
  
  // Fallback to local days if API failed or empty
  const calendarData = days.length > 0 ? days : Array.from({ length: daysInMonth }).map((_, i) => {
    const d = new Date(year, month - 1, i + 1);
    const dateStr = d.toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const isSunday = d.getDay() === 0;
    return {
      date: dateStr,
      season: isSunday ? 'Chúa Nhật' : 'Ngày Thường',
      celebrations: [{ title: '', colour: isSunday ? 'green' : 'white', rank_num: 3.14 }]
    };
  });

  const calendarDays = calendarData.map((dayInfo, i) => {
    const isToday = dayInfo.date === todayStr;
    const celebration = dayInfo.celebrations && dayInfo.celebrations[0];
    const isFeast = celebration && celebration.rank_num < 3.10; // Feasts, Solemnities
    
    // Convert color to a hex value
    let colorHex = '#e5e7eb'; // default grey
    if (celebration) {
      switch (celebration.colour) {
        case 'green': colorHex = '#22c55e'; break;
        case 'red': colorHex = '#ef4444'; break;
        case 'white': colorHex = '#facc15'; break; // Use yellow for white/gold for visibility
        case 'violet': colorHex = '#8b5cf6'; break;
      }
    }

    return (
      <div key={dayInfo.date} className={`calendar-day ${isToday ? 'today' : ''}`} style={{ border: isToday ? `2px solid ${colorHex}` : '1px solid #e5e7eb', padding: '10px', background: isToday ? '#f9fafb' : 'white', borderRadius: '8px', minHeight: '80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
          <span style={{ fontSize: '18px', fontWeight: isToday || firstDay+i === 0 || (firstDay+i)%7===0 ? 'bold' : 'normal', color: isToday ? colorHex : ((firstDay+i)%7===0 ? '#ef4444' : '#111827') }}>{i + 1}</span>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: colorHex }} title={translate(celebration?.colour || '')}></div>
        </div>
        {celebration && (
          <div style={{ fontSize: '11.5px', color: '#4b5563', lineHeight: 1.3, marginTop: 'auto', fontWeight: isFeast ? 'bold' : 'normal' }}>
            {translate(celebration.title || dayInfo.season)}
          </div>
        )}
      </div>
    );
  });

  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="calendar-wrapper" style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .calendar-wrapper { padding: 30px; }
        .calendar-scroll-container { overflow-x: auto; padding-bottom: 10px; scrollbar-width: thin; }
        .calendar-grid-header, .calendar-grid-body { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; min-width: 600px; }
        
        @media (max-width: 768px) {
          .calendar-wrapper { padding: 15px; }
          .calendar-btn-nav { padding: 5px 10px !important; font-size: 13px !important; }
          .calendar-month-title { font-size: 18px !important; }
        }
      `}} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className="calendar-btn-nav" onClick={handlePrev} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}>&laquo; Tháng Trước</button>
        <div style={{ textAlign: 'center' }}>
          <h3 className="calendar-month-title" style={{ fontSize: '22px', color: '#0f766e', margin: 0, fontWeight: 'bold' }}>Tháng {month} / {year}</h3>
          <button onClick={handleToday} style={{ border: 'none', background: 'transparent', color: '#6b7280', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline', marginTop: '5px' }}>Về Tháng Hiện Tại</button>
        </div>
        <button className="calendar-btn-nav" onClick={handleNext} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', cursor: 'pointer' }}>Tháng Sau &raquo;</button>
      </div>

      <div className="calendar-scroll-container">
        <div className="calendar-grid-header" style={{ marginBottom: '10px' }}>
          {weekDays.map(d => (
            <div key={d} style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '15px', color: d === 'CN' ? '#ef4444' : '#4b5563' }}>{d}</div>
          ))}
        </div>
        
        {loading ? (
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', minWidth: '600px' }}>
            <i className="bi bi-arrow-repeat" style={{ fontSize: '30px', animation: 'spin 1s linear infinite' }}></i>
            <style dangerouslySetInnerHTML={{__html: `@keyframes spin { 100% { transform: rotate(360deg); } }`}} />
          </div>
        ) : (
          <div className="calendar-grid-body">
            {blanks}
            {calendarDays}
          </div>
        )}
      </div>
    </div>
  );
}
