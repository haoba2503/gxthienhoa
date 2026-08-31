"use client";
import { useEffect, useState } from "react";

export default function Navigation({ title }: { title: string }) {
  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "loi-chua", "announcements", "services", "priests", "gallery", "about", "calendar", "news", "contact"];
      
      let current = "home";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = section;
          }
        }
      }
      setActiveSection(current);
      
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop - 70,
        behavior: "smooth"
      });
      setActiveSection(id);
      setMenuOpen(false); // Đóng menu mobile khi click
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: "home", label: "Trang Chủ" },
    { id: "loi-chua", label: "Lời Chúa" },
    { id: "announcements", label: "Thông Báo" },
    { id: "services", label: "Giờ Lễ" },
    { id: "priests", label: "Linh Mục" },
    { id: "gallery", label: "Thư Viện" },
    { id: "about", label: "Lịch Sử" },
    { id: "calendar", label: "Lịch Phụng Vụ" },
    { id: "news", label: "Bản Tin" },
    { id: "contact", label: "Liên Hệ" }
  ];

  return (
    <>
      <nav className="navbar">
        <div className="nav-container">
          <a href="#home" className="logo" onClick={(e) => handleClick(e, 'home')}>
            <i className="bi bi-cross" style={{ fontSize: '24px', marginRight: '8px' }}></i>
            <span className="logo-text">{title || 'GIÁO XỨ THIÊN HOA'}</span>
          </a>
          <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
            {navItems.map(item => (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`} 
                  className={activeSection === item.id ? "active-nav" : ""}
                  onClick={(e) => handleClick(e, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button className="mobile-menu-btn" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Nút Cuộn Lên Đầu Trang */}
      <button 
        className={`scroll-to-top ${showTopBtn ? 'show' : ''}`} 
        onClick={scrollToTop}
        aria-label="Cuộn lên đầu trang"
      >
        <i className="bi bi-arrow-up-short"></i>
      </button>

      <style dangerouslySetInnerHTML={{__html: `
        .logo {
          white-space: nowrap;
          flex-shrink: 0;
        }
        .nav-links {
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 15px;
        }
        @media (max-width: 1024px) {
          .nav-links {
            justify-content: center;
          }
          .nav-links li {
            font-size: 14px;
          }
        }
        .nav-links.active {
          display: flex !important;
          flex-direction: column;
          position: absolute;
          top: 70px;
          left: 0;
          right: 0;
          background: white;
          padding: 20px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .nav-links a {
          white-space: nowrap;
        }
        .nav-links a.active-nav {
          color: #f59e0b !important;
          font-weight: 700;
          border-bottom: 2px solid #f59e0b;
          padding-bottom: 5px;
        }
        .mobile-menu-btn {
          display: none;
          flex-direction: column;
          justify-content: space-around;
          width: 30px;
          height: 25px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 10;
        }
        .mobile-menu-btn span {
          width: 100%;
          height: 3px;
          background-color: #0f766e;
          border-radius: 10px;
          transition: all 0.3s linear;
          position: relative;
          transform-origin: 1px;
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex;
          }
          .nav-container {
            justify-content: space-between;
          }
        }
        .scroll-to-top {
          position: fixed;
          bottom: 30px;
          right: 30px;
          background-color: #0f766e;
          color: white;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 999;
        }
        .scroll-to-top.show {
          opacity: 1;
          visibility: visible;
        }
        .scroll-to-top:hover {
          background-color: #115e59;
          transform: translateY(-3px);
        }
        @media (max-width: 768px) {
          .scroll-to-top {
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
        }
      `}} />
    </>
  );
}
