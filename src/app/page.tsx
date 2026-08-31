import { getSettings, getPosts, getServices, getActivities, getPriests, getVideos, getZones, getOrganizations, getGalleryItems, getCouncilMembers } from "./actions";
import InteractiveClient from "./InteractiveClient";
import Announcements from "@/components/Announcements";
import CatholicCalendar from "@/components/CatholicCalendar";
import GallerySlider from "@/components/GallerySlider";
import Navigation from "@/components/Navigation";
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

// Helper to format dates
function formatNewsDate(iso: string) {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

async function getDailyLiturgy() {
  const publicDir = path.join(process.cwd(), 'public');
  let fallback = null;
  try {
    fallback = JSON.parse(fs.readFileSync(path.join(publicDir, 'liturgy.json'), 'utf8'));
  } catch(e) {}

  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const fullUrl = `https://www.vaticannews.va/vi/loi-chua-hang-ngay/${yyyy}/${mm}/${dd}.html`;
  
  try {
    const res = await fetch(fullUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return fallback;
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const liturgicalDay = $('h1').first().text().trim() || `Lời Chúa ngày ${dd}/${mm}/${yyyy}`;
    
    let bd1Text = '';
    let bd2Text = '';
    let tmText = '';
    let isBd2 = false;

    $('section.section--evidence').each((_, el) => {
      const headerText = $(el).find('.section__head h2').text().trim().toLowerCase();
      
      if (headerText.includes('bài đọc')) {
        $(el).find('.section__content p').each((_, p) => {
          const text = $(p).text().trim();
          if (!text) return;
          const lowerText = text.toLowerCase();
          
          // Kiểm tra xem có bắt đầu phần Bài Đọc 2 không
          if (lowerText.includes('bài đọc 2') || lowerText.includes('bài đọc ii') || lowerText.startsWith('bài đọc 2') || lowerText === 'bài đọc 2') {
            isBd2 = true;
          }
          
          if (isBd2) {
            bd2Text += text + '\n\n';
          } else {
            bd1Text += text + '\n\n';
          }
        });
      } else if (headerText.includes('tin mừng') || headerText.includes('phúc âm')) {
        $(el).find('.section__content p').each((_, p) => {
          const text = $(p).text().trim();
          if (text) {
            tmText += text + '\n\n';
          }
        });
      }
    });

    const readings: { label: string; ref: string; text: string }[] = [];
    if (bd1Text) readings.push({ label: 'Bài Đọc 1', ref: '', text: bd1Text.trim() });
    if (bd2Text) readings.push({ label: 'Bài Đọc 2', ref: '', text: bd2Text.trim() });
    if (tmText) readings.push({ label: 'Tin Mừng', ref: '', text: tmText.trim() });


    if (readings.length === 0) {
      return fallback;
    }
    
    return { liturgicalDay, date: `${yyyy}-${mm}-${dd}`, readings, fullUrl, seasonColor: '#166534' };
  } catch (e) {
    console.error("Scrape error:", e);
    return fallback;
  }
}

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await getSettings();
  const posts = await getPosts();
  const services = await getServices();
  const activities = await getActivities();
  const priests = await getPriests();
  const videos = await getVideos();
  const zones = await getZones();
  const organizations = await getOrganizations();
  const galleryItems = await getGalleryItems();
  const councilMembers = await getCouncilMembers();

  const announcements = posts.filter(p => p.type === 'ANNOUNCEMENT');

  const publicDir = path.join(process.cwd(), 'public');
  let newsData: any = null;
  try {
    newsData = JSON.parse(fs.readFileSync(path.join(publicDir, 'news.json'), 'utf8'));
  } catch (e) {}

  const liturgy = await getDailyLiturgy();

  return (
    <>
      <InteractiveClient />
      <style dangerouslySetInnerHTML={{__html: `
        /* Additional styling for new features */
        .liturgy-tabs-header { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center; }
        .liturgy-tab-btn { background: #e5e7eb; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; color: #374151; transition: 0.2s; }
        .liturgy-tab-btn.active { background: #0f766e; color: white; }
        .liturgy-tab-content { display: none; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); text-align: left; }
        .liturgy-tab-content.active { display: block; }
        .liturgy-tab-content p { white-space: pre-line; line-height: 1.8; color: #1f2937; }
        
        .activities-slider { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 20px; padding-bottom: 20px; scrollbar-width: none; }
        .activities-slider::-webkit-scrollbar { display: none; }
        .activities-slider > * { scroll-snap-align: start; min-width: 300px; max-width: 350px; flex-shrink: 0; }
        
        .priest-full { width: 100%; max-width: 250px; height: 400px; border-radius: 16px; object-fit: cover; margin: 0 auto 15px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .past-priests { display: none; margin-top: 30px; }
        .past-priests.active { display: grid; }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-map { height: 300px !important; }
          .priest-current-card { flex-direction: column !important; }
          .priest-current-img-wrap { flex: none !important; width: 100%; }
          .priest-current-img { height: 300px !important; }
        }
      `}} />

      <Navigation title={settings.hero_title} />

      <main>
        {/* 1. Hero */}
        <section id="home" className="hero">
          <style dangerouslySetInnerHTML={{__html: `
            .hero{position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;text-align:center;height:100vh;height:100svh;min-height:600px;background-color:#0f766e;}
            .hero-bg { position:absolute; top:0; left:0; right:0; bottom:0; background-size:cover; background-position:center; opacity:0; transition:opacity 2s ease-in-out, transform 6s ease-out; transform: scale(1.05); }
            .hero-bg.active { opacity:1; transform: scale(1); }
            .hero-overlay{position:absolute;top:0;right:0;bottom:0;left:0;z-index:1;transition:opacity .8s ease;background:linear-gradient(to bottom,rgba(0,0,0,.38) 0%,rgba(0,0,0,0) 22%),radial-gradient(ellipse 80% 55% at 50% 52%,rgba(0,0,0,.5),rgba(0,0,0,0) 68%),linear-gradient(to bottom,rgba(15,118,110,.22) 0%,rgba(13,148,136,.16) 45%,rgba(15,118,110,.45) 100%);}
            .hero-content{position:relative;z-index:2;max-width:800px;padding:0 20px;color:#fff;transition:opacity .8s ease,visibility .8s ease;}
            .hero.hero-dimmed .hero-content{opacity:0;visibility:hidden;}
            .hero.hero-dimmed .hero-overlay{opacity:.4;}
          `}} />
          <div className="hero-bg bg-slide active" style={{backgroundImage: 'url(/images/home1.jpeg)'}}></div>
          <div className="hero-bg bg-slide" style={{backgroundImage: 'url(/images/home2.jpeg)'}}></div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <p className="hero-eyebrow">{settings.hero_subtitle || 'Giáo Phận Buôn Ma Thuột'}</p>
            <h1>{settings.hero_title || 'GIÁO XỨ THIÊN HOA'}</h1>
            <p className="hero-verse">{settings.hero_verse || '"Trên đá này, Thầy sẽ xây Hội Thánh của Thầy" - Mt 16:18'}</p>
            <div className="hero-buttons">
              <a href="#services" className="btn btn-primary">Tham Dự Thánh Lễ</a>
              <a href="#about" className="btn btn-secondary">Tìm Hiểu Thêm</a>
            </div>
          </div>
        </section>

        {/* 2. Lời Chúa */}
        <section id="loi-chua" className="liturgy-section" style={{ background: '#f0fdfa' }}>
          <div className="container">
            <div className="section-header">
              <h2>Lời Chúa Hôm Nay</h2>
              <p id="liturgy-day" style={{ color: '#0f766e', fontWeight: 600 }}>{liturgy?.liturgicalDay} &middot; {formatNewsDate(liturgy?.date || new Date().toISOString())}</p>
            </div>
            
            <div className="liturgy-tabs-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              {liturgy && liturgy.readings && liturgy.readings.length > 0 ? (
                <>
                  <div className="liturgy-tabs-header">
                    {liturgy.readings.map((rdg: any, idx: number) => (
                      <button key={idx} className={`liturgy-tab-btn ${idx === 0 ? 'active' : ''}`}>{rdg.label}</button>
                    ))}
                  </div>
                  <div className="liturgy-tabs-body">
                    {liturgy.readings.map((rdg: any, idx: number) => (
                      <div key={idx} className={`liturgy-tab-content ${idx === 0 ? 'active' : ''}`}>
                        <h3 style={{ marginBottom: '15px', color: '#0f766e', borderBottom: '2px solid #ccfbf1', paddingBottom: '10px' }}>{rdg.label}</h3>
                        <p>{rdg.text}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="liturgy-status" style={{ textAlign: 'center' }}>Không tải được Lời Chúa lúc này.</p>
              )}
            </div>
          </div>
        </section>

        {/* 2.5 Thông Báo Quan Trọng */}
        <section id="announcements" className="urgent-announcements" style={{ padding: '40px 0', background: '#fffbeb', borderTop: '4px solid #f59e0b', borderBottom: '1px solid #fef3c7' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <i className="bi bi-bell-fill" style={{ fontSize: '24px', color: '#d97706', animation: 'ring 2s infinite' }}></i>
              <h2 style={{ fontSize: '24px', color: '#b45309', margin: 0 }}>Thông Báo Quan Trọng</h2>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes ring { 0% { transform: rotate(0deg); } 10% { transform: rotate(15deg); } 20% { transform: rotate(-10deg); } 30% { transform: rotate(5deg); } 40% { transform: rotate(-5deg); } 50% { transform: rotate(0deg); } 100% { transform: rotate(0deg); } }
              .announce-item { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; margin-bottom: 15px; }
            `}} />
            <Announcements items={announcements} />
          </div>
        </section>

        {/* 3. Giờ Thánh Lễ */}
        <section id="services" className="services-section" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1544819777-62283e30f143?q=80&w=2000&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.05, zIndex: 0 }}></div>
          <div className="container" style={{ position: 'relative', zIndex: 1, padding: '40px 0' }}>
            <div className="section-header" style={{ marginBottom: '30px' }}>
              <h2 style={{ color: '#111827', fontSize: '28px', fontWeight: 800 }}>Giờ Thánh Lễ</h2>
              <p style={{ color: '#4b5563', fontSize: '15px' }}>Cùng nhau thờ phượng và hiệp thông</p>
            </div>
            <div className="services-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {services.map(service => (
                <div key={service.id} className="service-card" style={{ background: 'white', padding: '20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #f3f4f6' }}>
                  <div className="service-icon" style={{ fontSize: '30px', color: '#0f766e', marginBottom: '10px' }}>
                    <i className={`bi ${service.icon || 'bi-sun'}`}></i>
                  </div>
                  <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '5px' }}>{service.day}</h3>
                  <p className="time" style={{ fontSize: '20px', fontWeight: 700, color: '#0f766e', marginBottom: '10px' }}>{service.time}</p>
                  <p style={{ color: '#6b7280', fontSize: '13px', lineHeight: 1.5 }}>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Linh mục quản xứ */}
        <section id="priests" className="priests-section" style={{ background: '#f9fafb', padding: '80px 0' }}>
          <div className="container" style={{ position: 'relative' }}>
            <div className="section-header">
              <h2>Linh mục quản xứ</h2>
              <p>Các mục tử dẫn dắt đoàn chiên Thiên Hoa</p>
            </div>
            
            {/* Nút Xem Quý Cha Đời Trước Nhỏ Gọn */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <style dangerouslySetInnerHTML={{__html: `
                .btn-past-priests { background: transparent; color: #6b7280; padding: 8px 15px; border-radius: 20px; border: 1px solid #d1d5db; cursor: pointer; font-size: 13px; display: flex; align-items: center; gap: 5px; transition: 0.2s; }
                .btn-past-priests:hover { color: #0f766e; border-color: #0f766e; }
                .past-priests-list { display: none; padding-bottom: 20px; }
                .past-priests-list.active { display: flex; }
              `}} />
              <button id="toggle-past-priests" className="btn-past-priests">
                Linh mục tiền nhiệm <i className="bi bi-clock-history"></i>
              </button>
            </div>
            
            {/* Hiển thị nổi bật Quản xứ và Phó xứ */}
            <div className="priests-current" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {priests.filter(p => p.isCurrent).map((priest, idx) => (
                <div key={priest.id} className="priest-current-card" style={{ display: 'flex', flexDirection: idx % 2 === 0 ? 'row' : 'row-reverse', alignItems: 'center', gap: '30px', background: 'white', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                  <div className="priest-current-img-wrap" style={{ flex: '0 0 350px' }}>
                    {priest.imageUrl ? (
                      <img src={priest.imageUrl} alt={priest.name} className="priest-current-img" style={{ width: '100%', height: '450px', objectFit: 'cover', borderRadius: '16px' }} />
                    ) : (
                      <div className="priest-current-img" style={{ width: '100%', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: '16px', fontSize: '80px', color: '#9ca3af' }}>
                        <i className="bi bi-person-badge"></i>
                      </div>
                    )}
                  </div>
                  <div style={{ flex: 1, padding: '20px' }}>
                    <span style={{ display: 'inline-block', background: '#ccfbf1', color: '#0f766e', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 700, marginBottom: '15px' }}>Đương nhiệm</span>
                    <h3 style={{ fontSize: '32px', color: '#111827', marginBottom: '10px' }}>{priest.name}</h3>
                    <p style={{ color: '#0f766e', fontWeight: 600, fontSize: '18px', marginBottom: '20px' }}>{priest.role}</p>
                    <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: 1.8, marginBottom: '15px', whiteSpace: 'pre-line' }}>{priest.description}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f9fafb', padding: '10px 20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                      <i className="bi bi-clock-history" style={{ color: '#0f766e' }}></i>
                      <span style={{ fontWeight: 600, color: '#374151' }}>Nhiệm kỳ: {priest.period}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div id="past-priests-list" className="past-priests-list activities-slider">
              {priests.filter(p => !p.isCurrent).map(priest => (
                <div key={priest.id} className="priest-card past" style={{ minWidth: '350px', maxWidth: '400px', textAlign: 'left', padding: '25px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', flexShrink: 0 }}>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#0f766e', flexShrink: 0 }}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#111827', margin: 0 }}>{priest.name}</h3>
                      <p style={{ color: '#0f766e', fontSize: '14px', margin: '5px 0 0' }}>{priest.role}</p>
                    </div>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '13px', fontWeight: 600, borderBottom: '1px solid #f3f4f6', paddingBottom: '10px', marginBottom: '10px' }}>
                    Nhiệm kỳ: {priest.period}
                  </p>
                  <div style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6, maxHeight: '80px', overflow: 'hidden', position: 'relative' }}>
                    {priest.description || 'Chưa có thông tin lịch sử chi tiết về ngài.'}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', background: 'linear-gradient(transparent, white)' }}></div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: '#0f766e', fontSize: '13px', fontWeight: 600, padding: '10px 0 0', cursor: 'pointer' }}>Xem thêm <i className="bi bi-arrow-right"></i></button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Giáo Khu */}
        {zones.length > 0 && (
          <section id="zones" className="activities-section" style={{ background: 'white' }}>
            <div className="container">
              <div className="section-header">
                <h2>Các Giáo Khu</h2>
                <p>Cộng đoàn dân Chúa Giáo xứ Thiên Hoa</p>
              </div>
              <div className="activities-slider">
                {zones.map(zone => (
                  <div key={zone.id} className="activity-card" style={{ padding: '25px', border: '1px solid #e5e7eb', borderRadius: '16px', background: '#f9fafb', position: 'relative', overflow: 'hidden' }}>
                    <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#0f766e' }}>{zone.name}</h3>
                    {zone.patron && <p style={{ fontWeight: 600, fontSize: '14px', marginBottom: '15px' }}>Bổn mạng: {zone.patron}</p>}
                    <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '20px', minHeight: '40px' }}>{zone.description}</p>
                    
                    <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                        <i className="bi bi-people-fill" style={{ color: '#0f766e' }}></i> {zone.membersCount} thành viên
                      </div>
                      {zone.contactInfo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                          <i className="bi bi-telephone-fill" style={{ color: '#0f766e' }}></i> {zone.contactInfo}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. Đoàn Thể */}
        {organizations.length > 0 && (
          <section id="organizations" className="activities-section" style={{ background: '#f9fafb' }}>
            <div className="container">
              <div className="section-header">
                <h2>Các Hội Đoàn</h2>
                <p>Hoạt động tông đồ và phục vụ</p>
              </div>
              <div className="activities-slider">
                {organizations.map(org => (
                  <div key={org.id} className="activity-card" style={{ padding: '0', border: '1px solid #e5e7eb', borderRadius: '16px', background: 'white', position: 'relative', overflow: 'hidden' }}>
                    {org.imageUrl ? (
                      <div style={{ height: '180px', backgroundImage: `url(${org.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    ) : (
                      <div style={{ height: '180px', background: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         <i className="bi bi-flag-fill" style={{ fontSize: '40px', color: '#0f766e' }}></i>
                      </div>
                    )}
                    <div style={{ padding: '25px' }}>
                      <h3 style={{ fontSize: '20px', marginBottom: '10px', color: '#111827' }}>{org.name}</h3>
                      {org.patron && <p style={{ fontWeight: 600, fontSize: '13px', color: '#0f766e', marginBottom: '10px' }}>Bổn mạng: {org.patron}</p>}
                      <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '20px', minHeight: '40px' }}>{org.description}</p>
                      
                      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                          <i className="bi bi-people-fill" style={{ color: '#0f766e' }}></i> {org.membersCount} thành viên
                        </div>
                        {org.contactInfo && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#374151' }}>
                            <i className="bi bi-person-fill" style={{ color: '#0f766e' }}></i> {org.contactInfo}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6.5 Ban Hành Giáo */}
        <section id="council" className="council-section" style={{ padding: '80px 0', background: '#f8fafc' }}>
          <div className="container">
            <div className="section-header">
              <h2>Ban Thường Vụ Hội Đồng Giáo Xứ</h2>
              <p>Nhiệm kỳ 2024 - 2028</p>
            </div>
            
            <div className="activities-slider">
              {councilMembers.map((member: any) => (
                <div key={member.id} style={{ background: 'white', borderRadius: '16px', padding: '25px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                  <img src={member.imageUrl || 'https://via.placeholder.150'} alt={member.name} style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 15px', border: '3px solid #ccfbf1' }} />
                  <h3 style={{ fontSize: '18px', color: '#0f766e', marginBottom: '5px' }}>{member.name}</h3>
                  <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '14px', marginBottom: '10px' }}>{member.role}</p>
                  <p style={{ color: '#4b5563', fontSize: '14px', margin: 0 }}><i className="bi bi-telephone-fill"></i> {member.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Thư Viện Hình Ảnh (GalleryItem) */}
        {galleryItems.length > 0 && (
          <section id="gallery" className="gallery-section" style={{ background: '#111827', color: 'white', padding: '80px 0' }}>
            <div className="container">
              <div className="section-header light">
                <h2>Thư Viện Ảnh & Video</h2>
                <p>Khoảnh khắc đáng nhớ của Giáo xứ</p>
              </div>
              <GallerySlider items={galleryItems} />
            </div>
          </section>
        )}

        {/* 8. Lịch Sử Giáo Xứ (Mốc Lịch Sử) */}
        <section id="about" className="about-section" style={{ padding: '80px 0', background: '#ffffff' }}>
          <div className="container">
            <div className="section-header">
              <h2>Lịch Sử Giáo Xứ</h2>
              <p>Hành trình Đức Tin</p>
            </div>

            {settings.history_text && (
              <div style={{ maxWidth: '800px', margin: '0 auto 40px', color: '#4b5563', lineHeight: 1.8, fontSize: '16px', whiteSpace: 'pre-line', textAlign: 'center' }}>
                {settings.history_text}
              </div>
            )}
            
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', background: '#e5e7eb' }}></div>
              {[
                { year: '1993', event: 'Giáo phu Y Mớt bắt đầu truyền đạo tại vùng đất này.' },
                { year: '25.01.2005', event: 'Tòa Giám Mục Buôn Ma Thuột chính thức thành lập Giáo xứ Thiên Hoa.' },
                { year: '2007', event: 'Khởi công xây dựng và hoàn thành Nhà thờ Giáo xứ Thiên Hoa.' },
                { year: '2012', event: 'Cha Giuse Trần Văn Roãn kế nhiệm làm linh mục quản xứ.' },
                { year: '2024', event: 'Đón Cha Phêrô Vũ Hồng Ân làm linh mục quản xứ mới.' }
              ].map((item, idx) => (
                <div key={idx} style={{ position: 'relative', paddingLeft: '50px', marginBottom: '30px' }}>
                  <div style={{ position: 'absolute', left: '14px', top: '5px', width: '14px', height: '14px', borderRadius: '50%', background: '#0f766e', border: '3px solid white', boxShadow: '0 0 0 2px #ccfbf1' }}></div>
                  <h4 style={{ color: '#0f766e', fontSize: '18px', marginBottom: '5px', fontWeight: 700 }}>{item.year}</h4>
                  <p style={{ color: '#4b5563', fontSize: '15px', lineHeight: 1.6, margin: 0 }}>{item.event}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Khối Ngày Lễ & Mốc Son Đáng Nhớ (Calendar) */}
        <section id="calendar" style={{ padding: '80px 0', background: '#f9fafb' }}>
          <div className="container">
            <div className="section-header">
              <h2>Lịch Công Giáo</h2>
              <p>Phụng vụ và các ngày lễ trong tháng</p>
            </div>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <CatholicCalendar />
            </div>
          </div>
        </section>
        
        {/* Khối Bản Tin Công Giáo */}
        {newsData && newsData.items && newsData.items.length > 0 && (
        <section id="news" style={{ padding: '80px 0', background: '#ffffff' }}>
          <div className="container">
            <div className="section-header">
              <h2>Bản Tin Công Giáo</h2>
              <p>Tin tức Giáo hội Hoàn vũ và Giáo phận</p>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              .news-card { display: flex; flex-direction: column; background: white; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.2s; }
              .news-card:hover { transform: translateY(-5px); }
            `}} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
              {newsData.items.slice(0, 6).map((ann: any, idx: number) => (
                <a href={ann.link} target="_blank" rel="noopener noreferrer" key={idx} className="news-card" style={{ textDecoration: 'none' }}>
                   <div style={{ height: '180px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #e5e7eb', overflow: 'hidden' }}>
                     {ann.image ? 
                        <img src={ann.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={ann.title} /> : 
                        (ann.source.includes('Vatican') ? 
                          <img src="https://www.vaticannews.va/etc/designs/vatican-news/release/library/main/images/vatican-news-seo-logo.png" style={{ height: '80px', objectFit: 'contain' }} alt="Vatican News" /> : 
                          <i className="bi bi-globe" style={{ fontSize: '50px', color: '#0f766e' }}></i>
                        )
                     }
                   </div>
                  <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <span style={{ fontSize: '12px', color: '#0f766e', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>{ann.source}</span>
                    <h4 style={{ fontSize: '16px', color: '#111827', marginBottom: '15px', lineHeight: 1.4 }}>{ann.title}</h4>
                    <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6, flexGrow: 1, maxHeight: '65px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ann.excerpt || 'Đọc tiếp chi tiết trên trang web gốc...'}</p>
                    <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}><i className="bi bi-calendar3"></i> {formatNewsDate(ann.date)}</span>
                      <span style={{ color: '#0f766e', fontWeight: 600, fontSize: '12px' }}>Đọc tiếp <i className="bi bi-arrow-right"></i></span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* 9. Liên Hệ & Bản Đồ */}
        <section id="contact" className="contact-section" style={{ background: '#f9fafb', padding: '80px 0' }}>
          <div className="container">
            <div className="section-header">
              <h2>Liên Hệ</h2>
              <p>Giáo Xứ Thiên Hoa luôn sẵn sàng đón tiếp bạn</p>
            </div>
            <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px', alignItems: 'start' }}>
              <div className="contact-info" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="contact-item" style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div className="contact-icon" style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ccfbf1', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}><i className="bi bi-geo-alt-fill"></i></div>
                  <div>
                    <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '5px' }}>Địa Chỉ</h3>
                    <p style={{ color: '#4b5563', fontSize: '15px' }}>{settings.contact_address || 'Nhà thờ Thiên Hoa, Thôn 4, Quảng Tín, Đắk R\'Lấp, Đắk Nông'}</p>
                  </div>
                </div>
                <div className="contact-item" style={{ background: 'white', padding: '30px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div className="contact-icon" style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ccfbf1', color: '#0f766e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}><i className="bi bi-telephone-fill"></i></div>
                  <div>
                    <h3 style={{ fontSize: '18px', color: '#111827', marginBottom: '5px' }}>Điện thoại (VP Giáo Xứ)</h3>
                    <p style={{ color: '#4b5563', fontSize: '15px' }}>{settings.contact_phone || '0261.3.123.456 (Giờ hành chính)'}</p>
                  </div>
                </div>
              </div>
              <div className="contact-map" style={{ height: '400px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                {/* Embedded Map cho Giáo xứ Thiên Hoa Đắk Nông */}
                <iframe 
                  src="https://maps.google.com/maps?q=Gi%C3%A1o+X%E1%BB%A9+Thi%C3%AAn+Hoa,+Qu%E1%BA%A3ng+T%C3%ADn,+%C4%90%C4%83k+R'L%E1%BA%A5p&t=&z=16&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{border: 0}} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <i className="bi bi-cross"></i>
              <span>GIÁO XỨ THIÊN HOA</span>
            </div>
            <div className="footer-links">
              <a href="#home">Trang Chủ</a>
              <a href="#about">Giới Thiệu</a>
              <a href="#services">Thánh Lễ</a>
              <a href="#priests">Quý Cha</a>
            </div>
            <div className="footer-social" style={{ display: 'flex', gap: '15px' }}>
              <style dangerouslySetInnerHTML={{__html: `
                .social-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; transition: transform 0.3s; color: white; }
                .social-icon:hover { transform: scale(1.1); }
                .social-icon.fb { background: #1877f2; }
                .social-icon.tt { background: black; }
              `}} />
              <a href="https://www.facebook.com/profile.php?id=61575251618235" target="_blank" rel="noopener noreferrer" aria-label="Facebook Giáo Xứ Thiên Hoa" className="social-icon fb"><i className="bi bi-facebook"></i></a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" aria-label="Tiktok Giáo Xứ Thiên Hoa" className="social-icon tt"><i className="bi bi-tiktok"></i></a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Giáo Xứ Thiên Hoa. Tất cả quyền được bảo lưu.</p>
            <p className="verse">"Vì ở đâu có hai ba người họp lại nhân danh Thầy, thì có Thầy ở đấy, giữa họ." - Mt 18:20</p>
          </div>
        </div>
      </footer>
    </>
  );
}
