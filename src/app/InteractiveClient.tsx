"use client";

import { useEffect } from "react";

export default function InteractiveClient() {
  useEffect(() => {
    // 1. Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-links a');

    const handleScroll = () => {
      // Add background to navbar
      if (window.scrollY > 50) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }

      // Scroll spy for active menu
      let current = "";
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          current = section.getAttribute('id') || "";
        }
      });
      navLinksList.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href')?.includes(current)) {
          link.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 2. Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    const toggleMenu = () => {
      navLinks?.classList.toggle('active');
      mobileMenuBtn?.classList.toggle('active');
    };
    mobileMenuBtn?.addEventListener('click', toggleMenu);

    // 3. Liturgy Tabs logic
    const tabBtns = document.querySelectorAll('.liturgy-tab-btn');
    const tabContents = document.querySelectorAll('.liturgy-tab-content');

    tabBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        if (tabContents[index]) {
          tabContents[index].classList.add('active');
        }
      });
    });

    // 4. Hero interaction dimming
    const hero = document.querySelector('.hero');
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      hero?.classList.remove('hero-dimmed');
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.scrollY < 50) {
          hero?.classList.add('hero-dimmed');
        }
      }, 3000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('touchstart', resetTimer);
    resetTimer();

    // 5. Toggle Past Priests
    const togglePriestsBtn = document.getElementById('toggle-past-priests');
    const pastPriestsList = document.getElementById('past-priests-list');
    
    if (togglePriestsBtn && pastPriestsList) {
      togglePriestsBtn.addEventListener('click', () => {
        pastPriestsList.classList.toggle('active');
        if (pastPriestsList.classList.contains('active')) {
          togglePriestsBtn.innerHTML = 'Thu Gọn <i class="bi bi-chevron-up"></i>';
        } else {
          togglePriestsBtn.innerHTML = 'Xem Quý Cha Các Đời <i class="bi bi-chevron-down"></i>';
        }
      });
    }

    // 6. Hero Slider
    const slides = document.querySelectorAll('.bg-slide');
    let currentSlide = 0;
    const slideInterval = setInterval(() => {
      if (slides.length > 1) {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mobileMenuBtn?.removeEventListener('click', toggleMenu);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearTimeout(timeout);
      clearInterval(slideInterval);
    };
  }, []);

  return null;
}
