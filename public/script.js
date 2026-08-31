
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    // Close mobile menu if open
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            });
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Feast days data
        const feastDays = [
            { date: '24/12', title: 'Thánh Lễ Vọng Giáng Sinh', description: 'Đêm Diễn Nguyện Giáng Sinh và Thánh Lễ Đêm Mừng Chúa Giáng Sinh' },
            { date: '25/12', title: 'Thánh Lễ Giáng Sinh', description: 'Thánh Lễ Trọng Mừng Chúa Giáng Sinh' },
            { date: '01/01', title: 'Lễ Đức Mẹ Maria Mẹ Thiên Chúa', description: 'Thánh Lễ Trọng Mừng Đức Mẹ Maria Mẹ Thiên Chúa' },
            { date: '06/01', title: 'Lễ Hiển Linh', description: 'Mừng Chúa Giêsu Hiển Linh Cho Muôn Dân' },
            { date: '14/02', title: 'Tro', description: 'Ngày Tro - Bắt Đầu Mùa Chay' },
            { date: '19/03', title: 'Lễ Thánh Giuse', description: 'Mừng Bổn Mạng Thánh Giuse Bạn Trăm Năm Đức Maria' },
            { date: '25/03', title: 'Lễ Truyền Tin', description: 'Mừng Đức Mẹ Nhận Lời Thiên Thần Truyền Tin' },
            { date: '01/04', title: 'Chúa Nhật Lá', description: 'Tuần Thánh - Chúa Nhật Lễ Lá' },
            { date: '06/04', title: 'Thứ Sáu Tuần Thánh', description: 'Tưởng Niệm Cuộc Thương Khó Của Chúa Giêsu' },
            { date: '08/04', title: 'Chủ Nhật Phục Sinh', description: 'Thánh Lễ Vọng Phục Sinh và Thánh Lễ Chúa Phục Sinh' },
            { date: '17/05', title: 'Lễ Chúa Thăng Thiên', description: 'Mừng Chúa Giêsu Lên Trời' },
            { date: '27/05', title: 'Lễ Chúa Thánh Thần Hiện Xuống', description: 'Mừng Chúa Thánh Thần Hiện Xuống Cùng Các Tông Đồ' },
            { date: '07/10', title: 'Đức Mẹ Mân Côi', description: 'Mừng Bổn Mạng Giáo Xứ - Đức Mẹ Mân Côi' },
            { date: '01/11', title: 'Lễ Các Thánh Nam Nữ', description: 'Mừng Lễ Các Thánh Nam Nữ' },
            { date: '02/11', title: 'Lễ Các Đẳng Linh Hồn', description: 'Cầu Cho Các Linh Hồn Tín Hữu Qua Đời' },
            { date: '08/12', title: 'Lễ Đức Mẹ Vô Nhiễm Nguyên Tội', description: 'Mừng Đức Mẹ Vô Nhiễm Nguyên Tội' }
        ];

        // Load feast days
        function loadFeastDays() {
            const feastDaysContainer = document.getElementById('feast-days-list');
            feastDaysContainer.innerHTML = '';

            feastDays.forEach(feast => {
                const feastCard = document.createElement('div');
                feastCard.className = 'feast-day-card';

                feastCard.innerHTML = `
                    <div class="feast-date">
                        <i class="bi bi-calendar-heart"></i>
                        <span>${feast.date}</span>
                    </div>
                    <div class="feast-content">
                        <h3>${feast.title}</h3>
                        <p>${feast.description}</p>
                    </div>
                `;

                feastDaysContainer.appendChild(feastCard);
            });
        }

        // Load feast days when page loads
        window.addEventListener('DOMContentLoaded', loadFeastDays);

        // ============================================
        // Daily Catholic News (đọc từ news.json)
        // news.json được cập nhật tự động mỗi ngày qua GitHub Actions.
        // ============================================
        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str == null ? '' : String(str);
            return div.innerHTML;
        }

        function formatNewsDate(iso) {
            const d = new Date(iso);
            if (isNaN(d.getTime())) return '';
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            return `${dd}/${mm}/${d.getFullYear()}`;
        }

        function loadNews() {
            const list = document.getElementById('news-list');
            const updated = document.getElementById('news-updated');
            if (!list) return;

            // Cache-bust so visitors get the freshest file after each deploy.
            fetch('news.json?t=' + Date.now(), { cache: 'no-store' })
                .then(res => {
                    if (!res.ok) throw new Error('HTTP ' + res.status);
                    return res.json();
                })
                .then(data => {
                    const items = (data && data.items) || [];
                    if (!items.length) {
                        list.innerHTML = '<p class="news-status">Hiện chưa có tin tức để hiển thị.</p>';
                        return;
                    }

                    list.innerHTML = '';
                    items.forEach(item => {
                        const card = document.createElement('a');
                        card.className = 'news-card';
                        card.href = item.link;
                        card.target = '_blank';
                        card.rel = 'noopener noreferrer';

                        const dateStr = formatNewsDate(item.date);
                        const excerpt = item.excerpt
                            ? `<p class="news-excerpt">${escapeHtml(item.excerpt)}</p>`
                            : '';

                        card.innerHTML = `
                            <div class="news-card-top">
                                <span class="news-source">${escapeHtml(item.source || 'Tin Công Giáo')}</span>
                                ${dateStr ? `<span class="news-date"><i class="bi bi-calendar3"></i> ${dateStr}</span>` : ''}
                            </div>
                            <h3 class="news-title">${escapeHtml(item.title)}</h3>
                            ${excerpt}
                            <span class="news-readmore">Đọc thêm <i class="bi bi-arrow-right"></i></span>
                        `;
                        list.appendChild(card);
                    });

                    if (updated && data.updated) {
                        const u = formatNewsDate(data.updated);
                        if (u) updated.textContent = 'Cập nhật lần cuối: ' + u;
                    }
                })
                .catch(() => {
                    list.innerHTML = '<p class="news-status">Không tải được tin tức lúc này. Vui lòng thử lại sau.</p>';
                });
        }

        // Load news when page loads
        window.addEventListener('DOMContentLoaded', loadNews);

        // ============================================
        // Lời Chúa Hôm Nay (đọc từ liturgy.json)
        // ============================================
        function loadLiturgy() {
            var dayEl = document.getElementById('liturgy-day');
            var box = document.getElementById('liturgy-content');
            if (!box) return;
            fetch('liturgy.json?t=' + Date.now(), { cache: 'no-store' })
                .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                .then(function (data) {
                    var readings = (data && data.readings) || [];
                    if (!readings.length) {
                        box.innerHTML = '<p class="liturgy-status">Chưa có Lời Chúa để hiển thị.</p>';
                        return;
                    }
                    if (data.seasonColor) box.style.setProperty('--liturgy-accent', data.seasonColor);
                    if (dayEl) {
                        var dd = formatNewsDate(data.date);
                        dayEl.textContent = (data.liturgicalDay || '') + (dd ? ' · ' + dd : '');
                    }
                    var html = '';
                    readings.forEach(function (rdg) {
                        var open = /Tin M/i.test(rdg.label) ? ' open' : '';
                        html += '<details class="reading"' + open + '>' +
                            '<summary><span class="reading-label">' + escapeHtml(rdg.label) + '</span>' +
                            (rdg.ref ? ' <span class="reading-ref">' + escapeHtml(rdg.ref) + '</span>' : '') +
                            '</summary>' +
                            '<div class="reading-text">' + escapeHtml(rdg.text) + '</div>' +
                            '</details>';
                    });
                    if (data.audioUrl) {
                        html += '<div class="liturgy-audio">' +
                            '<span class="liturgy-audio-label"><i class="bi bi-volume-up"></i> Nghe Lời Chúa hôm nay</span>' +
                            '<audio controls preload="none" src="' + data.audioUrl + '"></audio>' +
                            '</div>';
                    }
                    if (data.fullUrl) {
                        html += '<a class="liturgy-full" href="' + data.fullUrl + '" target="_blank" rel="noopener noreferrer">' +
                            '<i class="bi bi-box-arrow-up-right"></i> Đọc toàn bộ tại Vatican News</a>';
                    }
                    box.innerHTML = html;
                })
                .catch(function () {
                    box.innerHTML = '<p class="liturgy-status">Không tải được Lời Chúa lúc này.</p>';
                });
        }
        window.addEventListener('DOMContentLoaded', loadLiturgy);

        // ============================================
        // Thông Báo Giáo Xứ (đọc từ announcements.json — Google Sheet)
        // Ẩn cả mục và link menu khi chưa có thông báo.
        // ============================================
        function loadAnnouncements() {
            var sec = document.getElementById('thong-bao');
            var list = document.getElementById('announce-list');
            var nav = document.getElementById('nav-thongbao');
            if (!sec || !list) return;
            fetch('announcements.json?t=' + Date.now(), { cache: 'no-store' })
                .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
                .then(function (data) {
                    var items = (data && data.items) || [];
                    if (!items.length) return; // keep hidden
                    list.innerHTML = '';
                    items.forEach(function (it) {
                        var card = document.createElement('div');
                        card.className = 'announce-card' + (it.pinned ? ' pinned' : '');
                        var dateStr = it.date ? formatNewsDate(it.date) : '';
                        card.innerHTML =
                            (it.pinned ? '<span class="announce-pin"><i class="bi bi-pin-angle-fill"></i> Ghim</span>' : '') +
                            '<div class="announce-head">' +
                                '<h3 class="announce-title">' + escapeHtml(it.title) + '</h3>' +
                                (dateStr ? '<span class="announce-date">' + dateStr + '</span>' : '') +
                            '</div>' +
                            '<p class="announce-content">' + escapeHtml(it.content).replace(/\n/g, '<br>') + '</p>';
                        list.appendChild(card);
                    });
                    sec.hidden = false;
                    if (nav) nav.hidden = false;
                })
                .catch(function () { /* stay hidden on error */ });
        }
        window.addEventListener('DOMContentLoaded', loadAnnouncements);

        // ============================================
        // Hero background video (YouTube IFrame API)
        // - Autoplays on load, muted (âm thanh tắt mặc định)
        // - Sound on/off toggle button
        // - Rotates between videos by day of the month
        // ============================================
        (function () {
            var VIDEOS = [
                { id: 'Je9lyNJcjQg', start: 0 },
                { id: '59kCnuT1m1M', start: 67 }
            ];
            var pick = VIDEOS[new Date().getDate() % VIDEOS.length];
            var heroPlayer = null;
            var btn = document.getElementById('hero-sound-toggle');
            var hero = document.querySelector('.hero');
            var loopTimer = null;
            var apiReady = false;

            // Inline-SVG icons: the control is never blank if the icon CDN is
            // blocked, and never wiped on toggle (we always rewrite to a full SVG).
            var SVG_MUTED = '<svg class="hst-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">' +
                '<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3z"></path>' +
                '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 8l5 8M21 8l-5 8"></path>' +
                '</svg><span class="sr-only">Bật/Tắt âm thanh</span>';
            var SVG_ON = '<svg class="hst-icon" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">' +
                '<path fill="currentColor" d="M3 9v6h4l5 5V4L7 9H3z"></path>' +
                '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M16 8.5a4.5 4.5 0 0 1 0 7M18.5 5.5a8.5 8.5 0 0 1 0 13"></path>' +
                '</svg><span class="sr-only">Bật/Tắt âm thanh</span>';

            function revealToggle() {
                if (!btn) return;
                btn.hidden = false;
                btn.classList.remove('is-loading');
            }

            // Respect reduced-motion and data-saver / 2g only. 3g is intentionally
            // NOT suppressed — many usable rural VN connections report '3g'.
            var reduceMotion = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            var conn = navigator.connection || navigator.webkitConnection;
            var saveData = !!(conn && (conn.saveData || /(^|\b)(2g|slow-2g)\b/.test(conn.effectiveType || '')));
            if (reduceMotion || saveData) return;   // keep gradient; toggle stays hidden (no audio to control)

            // Show the button immediately but inert until the player is usable.
            if (btn) { btn.hidden = false; btn.classList.add('is-loading'); }

            // Auto-hide the title/buttons a few seconds after the video starts
            // (clean view of the video); any interaction brings them back.
            var videoPlaying = false;
            var dimTimer = null;
            function scheduleDim() {
                if (!hero) return;
                hero.classList.remove('hero-dimmed');
                clearTimeout(dimTimer);
                if (videoPlaying) dimTimer = setTimeout(function () { hero.classList.add('hero-dimmed'); }, 6000);
            }
            ['mousemove', 'touchstart', 'keydown', 'scroll'].forEach(function (ev) {
                window.addEventListener(ev, scheduleDim, { passive: true });
            });

            // Load the IFrame Player API; reveal the toggle as soon as the script
            // loads (covers slow networks where onReady is late).
            var tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            tag.onload = function () { revealToggle(); };
            var firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode.insertBefore(tag, firstScript);

            // If the API never initialises (blocked in VN), keep the gradient and
            // hide the dead control after 8s — ONLY if the player never built.
            setTimeout(function () {
                if (!apiReady && btn) { btn.hidden = true; }
            }, 8000);

            // Pre-empt YouTube end-screens / related-card flashes: re-seek BEFORE
            // the natural end so the loop restarts (and resumes at 67s) cleanly.
            function startLoopWatch(p) {
                if (loopTimer) clearInterval(loopTimer);
                loopTimer = setInterval(function () {
                    if (!p || typeof p.getCurrentTime !== 'function') return;
                    var dur = p.getDuration ? p.getDuration() : 0;
                    if (dur && p.getCurrentTime() >= dur - 1.0) {
                        p.seekTo(pick.start, true);
                    }
                }, 500);
            }

            window.onYouTubeIframeAPIReady = function () {
                apiReady = true;
                heroPlayer = new YT.Player('hero-player', {
                    width: '100%', height: '100%', videoId: pick.id,
                    playerVars: {
                        autoplay: 1, mute: 1, controls: 0, start: pick.start,
                        playsinline: 1, modestbranding: 1, rel: 0, disablekb: 1,
                        fs: 0, iv_load_policy: 3, cc_load_policy: 0,
                        playlist: pick.id, loop: 1
                    },
                    events: {
                        onReady: function (e) {
                            e.target.mute();          // muted autoplay is universally allowed
                            e.target.playVideo();
                            revealToggle();           // enable the button here, not on PLAYING
                        },
                        onStateChange: function (e) {
                            if (e.data === YT.PlayerState.PLAYING) {
                                if (hero) hero.classList.add('video-ready'); // fade video in
                                revealToggle();
                                startLoopWatch(e.target);
                                videoPlaying = true;
                                scheduleDim(); // begin the auto-hide countdown
                            } else if (e.data === YT.PlayerState.ENDED) {
                                e.target.seekTo(pick.start, true);
                                e.target.playVideo();
                            }
                        },
                        onError: function () { if (btn) btn.hidden = true; }
                    }
                });
            };

            // Sound toggle. unMute() runs only inside this click (user gesture).
            if (btn) {
                btn.addEventListener('click', function () {
                    if (!heroPlayer || typeof heroPlayer.isMuted !== 'function') return;
                    if (heroPlayer.isMuted()) {
                        heroPlayer.unMute();
                        heroPlayer.setVolume(55);
                        btn.classList.add('active');
                        btn.setAttribute('aria-pressed', 'true');
                        btn.setAttribute('aria-label', 'Tắt âm thanh video');
                        btn.innerHTML = SVG_ON;
                    } else {
                        heroPlayer.mute();
                        btn.classList.remove('active');
                        btn.setAttribute('aria-pressed', 'false');
                        btn.setAttribute('aria-label', 'Bật âm thanh video');
                        btn.innerHTML = SVG_MUTED;
                    }
                });
            }
        })();

        // ============================================
        // Bài Viết Nổi Bật: render from featured.json — updated weekly by
        // .github/workflows/weekly-featured.yml + fetch-featured.js from the
        // diocese's site, or hand-written and "pinned" for a parish event.
        // The HTML carries a baked-in article as fallback; when featured.json
        // loads, the section (and the popup teaser) is rebuilt from it. The
        // JSON is treated as DATA: every value lands via textContent /
        // validated URL properties, never as HTML.
        //
        // Optional fields beyond title/url/image/source/paras:
        //   fit: "contain"  — poster-style hero, shown whole instead of cropped
        //   thumb: "images/…" — landscape image for the popup teaser only
        //   subtitle: string — date/time line right under the title
        //   leads: number    — how many paragraphs stay visible (default 2)
        //   audio: {id, title}            — background hymn (no visible
        //          player); starts when the reader arrives via the popup
        //   video: {id, title, caption}   — YouTube embed after the leads
        //   video2: {id, title, caption}  — YouTube embed at the end of "Đọc tiếp"
        //   video3: {id, title, caption}  — YouTube embed closing "Đọc tiếp"
        //   image2: {src, alt, caption}   — figure at the top of "Đọc tiếp"
        //   image3: {src, alt, caption}   — figure at the end of "Đọc tiếp"
        // ============================================
        (function () {
            var art = document.querySelector('#bai-viet .featured-article');
            if (!art || !window.fetch) return;
            /* an image is either an https URL or a file shipped in images/ */
            function okSrc(s) {
                s = String(s || '');
                return /^https:\/\//.test(s) || /^images\/[A-Za-z0-9._-]+$/.test(s);
            }
            fetch('featured.json', { cache: 'no-cache' })
                .then(function (r) { if (!r.ok) throw 0; return r.json(); })
                .then(function (d) {
                    if (!d || typeof d.title !== 'string' || !d.title.trim() ||
                        !Array.isArray(d.paras) || d.paras.length < 2 ||
                        !/^https:\/\//.test(String(d.url || ''))) return;
                    var paras = d.paras.filter(function (p) { return typeof p === 'string' && p.trim(); });
                    if (paras.length < 2) return;

                    var body = art.querySelector('.featured-body');
                    var title = art.querySelector('.featured-title');
                    var img = art.querySelector('.featured-figure img');
                    var det = art.querySelector('.featured-more');
                    var srcLink = art.querySelector('.featured-source');
                    if (!body || !title || !det || !srcLink) return;

                    title.textContent = d.title.toLocaleUpperCase('vi');
                    var sub = art.querySelector('.featured-subtitle');
                    if (sub) {
                        if (typeof d.subtitle === 'string' && d.subtitle.trim()) {
                            sub.textContent = d.subtitle;
                            sub.style.display = '';
                        } else {
                            sub.style.display = 'none';
                        }
                    }
                    /* background hymn: retarget (or disable) the hidden
                       holder; the iframe itself is only created on the
                       popup click */
                    var hymn = document.getElementById('hymn-player');
                    if (hymn) {
                        var aud = d.audio;
                        if (aud && /^[A-Za-z0-9_-]{6,20}$/.test(String(aud.id || ''))) {
                            hymn.dataset.vid = String(aud.id);
                            if (aud.title) hymn.dataset.title = String(aud.title);
                        } else {
                            delete hymn.dataset.vid;
                        }
                    }
                    if (img && okSrc(d.image)) {
                        img.src = d.image;
                        img.alt = d.title;
                        var fig = img.closest('.featured-figure');
                        if (fig) {
                            fig.style.display = '';
                            fig.classList.toggle('is-contain', d.fit === 'contain');
                        }
                    }
                    /* clear the baked paragraphs (leads + details body) and any
                       baked media, so a different article can't inherit them */
                    body.querySelectorAll(':scope > p:not(.featured-subtitle)')
                        .forEach(function (p) { p.remove(); });
                    det.querySelectorAll('p').forEach(function (p) { p.remove(); });
                    art.querySelectorAll('.featured-video, .featured-inline-figure')
                        .forEach(function (n) { n.remove(); });
                    /* the leads stay visible, the rest goes behind "Đọc tiếp" */
                    var nLead = Math.min(Math.max(parseInt(d.leads, 10) || 2, 1), 4);
                    paras.slice(0, nLead).forEach(function (t) {
                        var p = document.createElement('p');
                        p.textContent = t;
                        body.insertBefore(p, det);
                    });
                    function videoFig(vid) {
                        if (!vid || !/^[A-Za-z0-9_-]{6,20}$/.test(String(vid.id || ''))) return null;
                        var vFig = document.createElement('figure');
                        vFig.className = 'featured-video';
                        var vBox = document.createElement('div');
                        vBox.className = 'featured-video-frame';
                        var ifr = document.createElement('iframe');
                        ifr.src = 'https://www.youtube-nocookie.com/embed/' + vid.id;
                        ifr.title = String(vid.title || d.title);
                        ifr.loading = 'lazy';
                        ifr.allowFullscreen = true;
                        ifr.referrerPolicy = 'strict-origin-when-cross-origin';
                        ifr.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
                        vBox.appendChild(ifr);
                        vFig.appendChild(vBox);
                        if (vid.caption) {
                            var vCap = document.createElement('figcaption');
                            vCap.textContent = vid.caption;
                            vFig.appendChild(vCap);
                        }
                        return vFig;
                    }
                    /* optional video, between the leads and "Đọc tiếp" */
                    var vMain = videoFig(d.video);
                    if (vMain) body.insertBefore(vMain, det);
                    var rest = paras.slice(nLead);
                    var im2 = d.image2 && okSrc(d.image2.src) ? d.image2 : null;
                    var im3 = d.image3 && okSrc(d.image3.src) ? d.image3 : null;
                    var v2 = videoFig(d.video2);
                    var v3 = videoFig(d.video3);
                    det.style.display = (rest.length || im2 || im3 || v2 || v3) ? '' : 'none';
                    det.open = false;
                    function inlineFig(im) {
                        var iFig = document.createElement('figure');
                        iFig.className = 'featured-inline-figure';
                        var iImg = document.createElement('img');
                        iImg.src = im.src;
                        iImg.alt = String(im.alt || d.title);
                        iImg.loading = 'lazy';
                        iImg.onerror = function () { iFig.style.display = 'none'; };
                        iFig.appendChild(iImg);
                        if (im.caption) {
                            var iCap = document.createElement('figcaption');
                            iCap.textContent = im.caption;
                            iFig.appendChild(iCap);
                        }
                        return iFig;
                    }
                    /* optional second photo, first thing inside "Đọc tiếp" */
                    if (im2) det.appendChild(inlineFig(im2));
                    rest.forEach(function (t) {
                        var p = document.createElement('p');
                        p.textContent = t;
                        det.appendChild(p);
                    });
                    /* second video, third photo, third video — closing "Đọc tiếp" */
                    if (v2) det.appendChild(v2);
                    if (im3) det.appendChild(inlineFig(im3));
                    if (v3) det.appendChild(v3);
                    var signoff = document.createElement('p');
                    signoff.className = 'featured-signoff';
                    var em = document.createElement('em');
                    em.textContent = d.source || 'Nguồn';
                    signoff.appendChild(em);
                    det.appendChild(signoff);
                    /* source link */
                    srcLink.href = d.url;
                    srcLink.textContent = '';
                    var ico = document.createElement('i');
                    ico.className = 'bi bi-globe2';
                    srcLink.appendChild(ico);
                    var host = '';
                    try { host = ' (' + new URL(d.url).hostname.replace(/^www\./, '') + ')'; } catch (e) {}
                    srcLink.appendChild(document.createTextNode(' Nguồn: ' + (d.source || '') + host));
                    /* popup teaser follows the article */
                    var tTitle = document.querySelector('.feature-teaser-title');
                    var tThumb = document.querySelector('.feature-teaser-thumb');
                    if (tTitle) tTitle.textContent = d.title;
                    /* the hero is often a tall poster; "thumb" lets an article give
                       the popup a landscape crop instead, so faces don't get cut */
                    var thumbSrc = okSrc(d.thumb) ? d.thumb : (okSrc(d.image) ? d.image : '');
                    if (tThumb && thumbSrc) tThumb.src = thumbSrc;
                }).catch(function () {});
        })();

        // ============================================
        // Các bài viết trước: render from featured-archive.json. The HTML
        // carries a baked-in list as fallback; the JSON (maintained by
        // fetch-featured.js on each weekly swap, or by hand for parish
        // articles) replaces it when it loads. Values land via textContent /
        // validated URLs only.
        // ============================================
        (function () {
            var box = document.getElementById('featured-archive');
            var list = document.getElementById('featured-archive-list');
            if (!box || !list || !window.fetch) return;
            fetch('featured-archive.json', { cache: 'no-cache' })
                .then(function (r) { if (!r.ok) throw 0; return r.json(); })
                .then(function (d) {
                    var items = (d && Array.isArray(d.items) ? d.items : [])
                        .filter(function (it) {
                            return it && typeof it.title === 'string' && it.title.trim() &&
                                /^https:\/\//.test(String(it.url || ''));
                        })
                        .slice(0, 20);
                    if (!items.length) return;
                    list.textContent = '';
                    items.forEach(function (it) {
                        var li = document.createElement('li');
                        var a = document.createElement('a');
                        a.href = it.url;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        a.textContent = it.title;
                        li.appendChild(a);
                        var meta = [];
                        var dt = new Date(String(it.date || ''));
                        if (!isNaN(dt)) meta.push(dt.toLocaleDateString('vi-VN'));
                        if (it.source) meta.push(String(it.source));
                        if (meta.length) {
                            var sp = document.createElement('span');
                            sp.className = 'featured-archive-meta';
                            sp.textContent = meta.join(' — ');
                            li.appendChild(sp);
                        }
                        list.appendChild(li);
                    });
                }).catch(function () {});
        })();

        // ============================================
        // Background hymn: offscreen YouTube player plus a small floating
        // speaker button (bottom-right) that only shows while the hymn is
        // playing. Stopping removes the iframe; starting again rebuilds it —
        // both happen inside a click, so sound is always allowed. The
        // enablejsapi handshake lets us hide the button when the hymn ends.
        // ============================================
        var hymnCtl = (function () {
            var holder = document.getElementById('hymn-player');
            var btn = document.getElementById('hymn-toggle');
            if (!holder || !btn) return { play: function () {} };
            var icon = btn.querySelector('i');
            var YT_ORIGIN = 'https://www.youtube-nocookie.com';
            function setBtn(playing) {
                btn.hidden = false;
                btn.setAttribute('aria-label', playing ? 'Tắt nhạc' : 'Mở nhạc');
                if (icon) icon.className = playing ? 'bi bi-volume-up-fill' : 'bi bi-volume-mute-fill';
                btn.classList.toggle('is-muted', !playing);
            }
            function stop() {
                var ifr = holder.querySelector('iframe');
                if (ifr) ifr.remove();
                setBtn(false);
            }
            function play() {
                var vid = holder.dataset.vid;
                if (!vid || !/^[A-Za-z0-9_-]{6,20}$/.test(vid)) return;
                if (holder.querySelector('iframe')) { setBtn(true); return; }
                var ifr = document.createElement('iframe');
                ifr.src = YT_ORIGIN + '/embed/' + vid + '?autoplay=1&enablejsapi=1';
                ifr.title = holder.dataset.title || 'Thánh ca';
                ifr.allow = 'autoplay; encrypted-media';
                ifr.referrerPolicy = 'strict-origin-when-cross-origin';
                ifr.tabIndex = -1;
                ifr.addEventListener('load', function () {
                    try {
                        ifr.contentWindow.postMessage(
                            JSON.stringify({ event: 'listening', id: 'hymn' }), YT_ORIGIN);
                    } catch (e) {}
                });
                holder.appendChild(ifr);
                setBtn(true);
            }
            btn.addEventListener('click', function () {
                if (holder.querySelector('iframe')) stop(); else play();
            });
            /* the hymn finished: remove the player and tidy the button away */
            window.addEventListener('message', function (e) {
                if (e.origin !== YT_ORIGIN) return;
                var data;
                try { data = JSON.parse(e.data); } catch (err) { return; }
                if (data && data.info && data.info.playerState === 0) {
                    var ifr = holder.querySelector('iframe');
                    if (ifr) ifr.remove();
                    btn.hidden = true;
                }
            });
            return { play: play };
        })();

        // ============================================
        // Featured-article popup teaser (bottom-left)
        // ============================================
        (function () {
            var popup = document.getElementById('feature-teaser');
            if (!popup) return;
            /* seen-key derives from the article title, so a new weekly
               article re-shows the teaser; computed at show/dismiss time,
               after featured.json has (usually) been applied */
            function seenKey() {
                var t = document.querySelector('#bai-viet .featured-title');
                return 'featureTeaserSeen:' + (t ? t.textContent.trim().slice(0, 64) : '');
            }
            var closeBtn = popup.querySelector('.feature-teaser-close');
            var link = popup.querySelector('.feature-teaser-link');
            function dismiss() {
                popup.classList.remove('show');
                try { sessionStorage.setItem(seenKey(), '1'); } catch (e) {}
            }
            setTimeout(function () {
                try { if (sessionStorage.getItem(seenKey()) === '1') return; } catch (e) {}
                popup.hidden = false;
                setTimeout(function () { popup.classList.add('show'); }, 30);
                setTimeout(dismiss, 14000); /* auto-dismiss: never squats on content */
            }, 2500);
            if (closeBtn) closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                dismiss();
            });
            if (link) link.addEventListener('click', function () {
                var det = document.querySelector('#bai-viet .featured-more');
                if (det) det.open = true; // expand the full article
                /* the click is a user gesture, so the hymn may start with
                   sound (see hymnCtl above) */
                hymnCtl.play();
                dismiss();
            });
        })();

        // ============================================
        // Thư viện ảnh: horizontal film strip from the parish album.
        // Baked list renders instantly; /api/photos refreshes live, so adding
        // photos to the Google Photos album updates the site automatically.
        // ============================================
        (function () {
            var GALLERY_PHOTOS = ["https://lh3.googleusercontent.com/pw/AP1GczM67v1NUsmtslOczqXqgeYymXZOdP7IiebHFrBEzMV-DxLpU0Z487jmlp7KljqgiegLMFbGA1tuaGUHF2OTGxnIQVs9zznVJ1vZPCOL4OojGHjSu_mLeQ","https://lh3.googleusercontent.com/pw/AP1GczMCoGEXXe6hVS0giqKStPodBINncOORecm8J3y9zWmIaDMrnwYBh8vbFIrpCQGeDfuh6_CwAuUgzKtT_owgsY55qtV61TV3pB3iVlKSn6V4J1jUhEzRQA","https://lh3.googleusercontent.com/pw/AP1GczMCz8UhXXor8VGagSYAoydXRV4DbI5MoQbEXGzj6pR94PA17scy74UHS9fVFvQIwuYskUm7XE1Vr5ojk0BYZdnDEY_1EKGpV26uWmx5JDHJNmpG-5i3hQ","https://lh3.googleusercontent.com/pw/AP1GczMgda_2HZCw1zgGLItGwKg-hqoOKVKsEg8bD6Fw-c_dPfPmwJ1M1YafRS5hgTr0-z1LWXItneHsOYESn6Aj9fJnM572PnkXcZblakUnHmgkZkNLHMKTnA","https://lh3.googleusercontent.com/pw/AP1GczMhbrEfBG_lfHxjmc2aE1U8AXhfXSWMwMys4NFX93wY1WsgmBFd2SScWUezs9350VOUFwzJPC-xx9V9PyXeXesRN34_BQ6YUjIJke3oURgNmwd85mpevA","https://lh3.googleusercontent.com/pw/AP1GczMJ_pQ3NQgS6q9qWc8KI76jPsNl9FzWaGL9iGE2BQQhNZnyboJHpKhEhV1Csp8msoncVUlFdu3SVTfaL_t8nVbxFOshcCTKfE-XxHbJy-vwudRFW3oyRg","https://lh3.googleusercontent.com/pw/AP1GczMN2sYHgw1F9qfKolcS3k1_xiaVXmLVpXGcko03_DBm4tl9M1dDqV3NQoMcK5C-KBWmUPQ0c207lBEQTewlBHCmudr8mbCufcoLfXKQA9vnT0-vJWJZ4g","https://lh3.googleusercontent.com/pw/AP1GczMOG2zJkStHNgxODpxDhJXnTTalyvY4We6PFy8O_yCDpw_nskuLNBF5hRPiE2HGYyvXCb5HgMRXDNu4JEf82XxRofDHYqlNeU4w3Zse8xlXnwPD5gjefA","https://lh3.googleusercontent.com/pw/AP1GczMPzlcPRwCZ2U9jc5ujuuSBRcVkBJqTCUWF3T2C6i56Uap-gdnUi0xDsSX8f36TfjZkCNwEKG4nTHcC3EB5DnQjYC5JicOMVXwpslUnDp_RzfOv4hh5WQ","https://lh3.googleusercontent.com/pw/AP1GczMQNRIFx-tpv_kpCsuUukjTWQfjh0TBfbXh9WePQnPWNDnePNTAHwg2lOxGwyWa_IrUIGZzwPlIHMcgeAL4rnZD6sM7akLbHX7sC435YZ_Kt3EWQEbNnw","https://lh3.googleusercontent.com/pw/AP1GczMwXJ6qXnkImtdRGFBJ84RjTeKZPlbDRNme2uZsV2SkahZxfnHbXkG2dE_7Za2UoaQs9K20pCkgXrHRaTGVuzbsa8EUepXfDhkmgzWrrq7XXuhuk4EOrw","https://lh3.googleusercontent.com/pw/AP1GczN0k87cT4P4M-GzQXx96S3idLVrhnUTVjn6U3SsrV3dMRPKCtvnPROzsiYfDJbvXdgK4i3LS1gg7GqMLK9hHdVyex5LxlNHbSOTCbAKUbuD608bN52kLw","https://lh3.googleusercontent.com/pw/AP1GczNavUhuxqyFABPOFlNnT7PtFOEaU0yXIYGlN7yXsxpU_iV1Z2FSXMHNFnOdKSgslUPCG61t_w-4Bq8-OzolHKR5RI-v3501SK3dqt8ZmfJl7b832HeaHA","https://lh3.googleusercontent.com/pw/AP1GczNGnfFXA5h2E_3ItGxP8byKLC_GYOk2ZvL6zFe7V91GD9i9fF8DEHipk283yn1WMbTZOcWwOtuWsha0HoOJJZole1fLXPr0apmaxJc77JUwugnrZXa7uA","https://lh3.googleusercontent.com/pw/AP1GczNnClFZHwwmHv69X7nyXodorbSbKX9hY0DjM1vfxMknUE84ot182eBHM-v_V0EMg3aD_8W3kS9Q0NYYnv1u3LyWTl7DF3piIvfNLy-2LMMQqS5nTrZwdw","https://lh3.googleusercontent.com/pw/AP1GczNnSnNTsSb_DkKecoHEzQlnZ4iFL7jV6zP-aomLwdYjbCDvrVg1xAMTDx5DHJonWn8lk7qR3QKYSAlXnl7KEDm5sqfBIa2UfTlhC1z6YrDtUp8OOuY7Tg","https://lh3.googleusercontent.com/pw/AP1GczNrj8i4PFTAvWebelop0duEDdO2gEM1f8rPkb55xhNX9ryXMYPYmNYEB1S7uHhlcmK3etjzektFMybLF7x5wKPtOzY0wI94figoVO1WWmo2SlH9yiCKOQ","https://lh3.googleusercontent.com/pw/AP1GczNVi1K7mZLHDC_87UcxWAG6HYQrMMhFHrSvRdBUAa-QpMAxfHv1xzLHDdTcpWP7ojmsro2Q9E1Fi1-XDzOq3vgFA178D1gXWpQuxMd4VnmZSujI2jasjA","https://lh3.googleusercontent.com/pw/AP1GczNWq2LQNT8Tg9XRROAg_moKsw6QDYiQShrGKrc20BLodRTtoDSCY-_OKrI0eeMMIIr04JDI9AKtZICD_w5SFpC6gfXvlgsG7U5grykla3SBWLnUYUvedQ","https://lh3.googleusercontent.com/pw/AP1GczNwwJQrOlKn5lvVJ-V813J0hiq1Bfi7Q_os-QnDBazwFf7vmFRGpa5E6ffGB_Kx8TSodMR50Hvcbj8p-6Ij01e3RDxT4kfTfZng2YyHsZRQa9ArMN5Rpg","https://lh3.googleusercontent.com/pw/AP1GczNX9v4ejknKhNNO6UNHmXKzZ0uNnKIA73o2P4k5bKndgHJftaSet6eOB8JMkn4bTQ7waSo5fcF1NZhdC8Zjn_i-BZAkLu7a1c7GWPwl3ljYQH6FLwZOCA","https://lh3.googleusercontent.com/pw/AP1GczNYaaV2Xokgf8iIzwGWEutfGwt3lPKBn-jQFKLbs8B0cLk2m_amdEMT9zt1sj9Egq53uHZZBM3X9pVs1WhnGCaSxFYJZpBdIH9pFFZOuNqXFaI3eU0vbQ","https://lh3.googleusercontent.com/pw/AP1GczO0kZIXnlv-gUhnZPOIIJTvQxgQTn5WCHTDbNFeI3DzTIjsFr1slgiN9sgzOR2S6z6Id3FLaVLN-v3pEho4nfldRKEObD6j-8C3H8zCBlDCMVGJgym9FA","https://lh3.googleusercontent.com/pw/AP1GczO2vZJUsd-3Q0PGO-GgEzBgToVYX0cd1sFq0MwBwuFcBG7txCNcvDhYvTzSH1apuxu67_lb6JR50gzhLaVel8Re4Z96tzkZ4LEUmcWgds7cQkeRe6m4Aw","https://lh3.googleusercontent.com/pw/AP1GczO5nMajMQjFUkZE8zq_3TRQlYKR44XN8WaNTUORI4MEzAB_EJN9n5c50jMkFBriMas3ewvWlOQ7z7Ljyh5BU80gxDImQQnDA-mJWMlYmAavdsg-HjkR9Q","https://lh3.googleusercontent.com/pw/AP1GczOcYfpxmYSqIT_nt4VQGPsUM_ld2mSnxSXuOLlJXEcCyA-0zSsufeoU2x2rQqjsVCfwnqniWI67sAz528r4N3Mclm5m1WIyLfApra40vo9gK2uxlPNklA","https://lh3.googleusercontent.com/pw/AP1GczOEKNZpkQELK_j0jBcpRS6KKa0_TQmEi5m_4T5UCZ8WzDJAH0aZv3fbOwaQuoJILjLNu88CZ9goJ0lBbaYOPMWclgKgjHahs4xv-QhCCx3iteiviI2qWw","https://lh3.googleusercontent.com/pw/AP1GczOIUUFKueli-RBzYimDiHa-AMX-f9Gq-2CvAmcug3oQHuxrorXqUkqWudNT2zxgVlUBSOuE85bWl2w3zq3XkULDjJBYIi8sXKv5SazObZ5wcKpMHjwi_A","https://lh3.googleusercontent.com/pw/AP1GczOSyzBMk3tQFCVxWWNMRZ5o_sOjVlDBwrRVpf1fav48PuFYhCsx-l_iz6QzNdZdYHyEF6-_HAFQzV_pY1lhXFWCQl5TONOPFURrkd9xoYsmWUSk1BZ6wQ","https://lh3.googleusercontent.com/pw/AP1GczOxv1F6rNLerXhlCDZaRem29fl-eQA1zaeS0qE6OXF9Xip7a9OkC_7iBqazZxwYmip6JwwKVNkJFDSvO3AzXhcvHiK7aVD1HQkv1IeMTphfnbGoWZkjJw","https://lh3.googleusercontent.com/pw/AP1GczP7mypyrzTMc9f79wmPzhYVO5lcWipzxJJnYCzodcpcPuOTkGQ7Qdy8fsd1wOB5a72563icmFZaMI2qXf19wnMoXT-rt657ZIkStVTysI5J5qLlYshS6Q","https://lh3.googleusercontent.com/pw/AP1GczPB38oi3XwRcoBaj3pdM5mjdhRJ7BGD0ne3VmXFzGMzoskm2hEjF7LqArvGHpi21qDfIypnOgbThR8DhUNXdNrSIMrXCY75E86ITnS3h8-65VUpweFXFg","https://lh3.googleusercontent.com/pw/AP1GczPCiEgavjdaJx94GuI_HfzGHQex9aCNQgQv15SkptP4p8Az3Y9P4g5cyVwKKJbwlMEd48vcAc1Atz1KHbPO-Fegy7g7UxJQTVruEJdItiyQ9VwYhZlJOQ","https://lh3.googleusercontent.com/pw/AP1GczPFWL5meqliPItWLFBSI6cEuqlUpL_av7V1dmhO6nO1ipSTqXRv5aSUPaQtkhEF9fhyQRzx1_1D3F1hjszjhbVu8h-d6qzzMxiMJUiQns3FOr2sfGwiSg","https://lh3.googleusercontent.com/pw/AP1GczPH2sm8WrQgeiHAthdsuFaQjZFDPVwctKr8u13soBk5afQ5JBVk_SfyXWYlvCQ6zjgeFYdTOhW-ZHnAwAVjhM7dRp6RlemNQibVAfNTtkFCgbW7ujhZEw","https://lh3.googleusercontent.com/pw/AP1GczPjsPs_J5KlJfDvDLbn8i3jpztjq_vXwfbtzYNvU4ILnRu72LfazkmQW69IN-FxUGpiJ8iTW2JcoPQNAECr_QXk2Hv6kHIuEOAaP_U2CcAGtLa2zUUVZg","https://lh3.googleusercontent.com/pw/AP1GczPkAHsAs32Mvvp3lBuYM-NCZJkWYubr1WYAnSpvdW2SwIkP6Yyd6jNb1LFSsZxr1I27T4y2nQ69ON99P40uhqt3ox8ztKJg3VK99Y_cShRrCtKQdDAREA","https://lh3.googleusercontent.com/pw/AP1GczPyj_rsAvAuzlr5wVHlmYZfSEg53mzWmZSQi3jXxN91H4H6dBerUBR64BIqF7NzcVW3HiYofkPlixj7PXMArSmW0uEDW9vqZxDoFBG2WnZsnPpeo_99HQ","https://lh3.googleusercontent.com/pw/AP1GczPz_vJnAj5_OdzNcD0BBkGNc_CU1xCP4Cgxj2suZdoQcMk_cR9kVoeBuXSuLBzQG4vzqpvbuw4RnxDV3uejBPj5Xp7NZgU-Fi7LtS4jHFOOV_lqVc_oew"];
            var strip = document.getElementById('galxStrip');
            var mqTrack = document.getElementById('galxMqTrack');
            var prog = document.getElementById('galxProg');
            var total = document.getElementById('galxTotal');
            var prevB = document.getElementById('galxPrev');
            var nextB = document.getElementById('galxNext');
            if (!strip) return;
            var REDUCED = document.documentElement.classList.contains('reduced');
            function shuffle(a) {
                for (var i = a.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var t = a[i]; a[i] = a[j]; a[j] = t;
                }
                return a;
            }
            function pad2(n) { return n < 10 ? '0' + n : '' + n; }
            function fmtDur(s) { return Math.floor(s / 60) + ':' + pad2(Math.round(s % 60)); }
            var URL_OK = /^https:\/\/lh3\.googleusercontent\.com\/pw\/[A-Za-z0-9_-]+$/;
            /* media items: {u, v?, d?} — v:1 is a real video from the album,
               played through /api/video (the Google video CDN can't be
               hotlinked). The baked list renders instantly as photos;
               /api/photos upgrades it and brings the video markers. */
            var ITEMS = GALLERY_PHOTOS.map(function (u) { return { u: u }; });
            var LIST = shuffle(ITEMS.slice());
            function photoUrls() {
                var out = [];
                for (var i = 0; i < ITEMS.length; i++) if (!ITEMS[i].v) out.push(ITEMS[i].u);
                return out;
            }
            function announce() {
                window.__gxPhotos = photoUrls();
                try { document.dispatchEvent(new CustomEvent('gx:photos', { detail: window.__gxPhotos })); } catch (_) {}
            }
            announce();
            function build() {
                var html = '';
                var nVid = 0;
                for (var i = 0; i < LIST.length; i++) {
                    var it = LIST[i];
                    var isV = !!it.v;
                    if (isV) nVid++;
                    html += '<figure class="galx-fr' + (isV ? ' galx-vid' : '') + '">' +
                        '<button class="galx-btn" type="button" ' +
                        (isV
                            ? 'data-video="' + it.u.slice(it.u.lastIndexOf('/') + 1) + '" data-poster="' + it.u + '=w1600"'
                            : 'data-full="' + it.u + '=w1600"') +
                        ' aria-label="Xem ' + (isV ? 'video' : 'ảnh') + ' ' + (i + 1) + ' trong ' + LIST.length + '">' +
                        '<span class="galx-im"><img src="' + it.u + '=w900" alt="' + (isV ? 'Video' : 'Hình ảnh') + ' sinh hoạt Giáo Xứ Đại Hải" loading="lazy" decoding="async">' +
                        (isV
                            ? '<span class="galx-play" aria-hidden="true"><svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg></span>' +
                              (it.d ? '<span class="galx-dur">' + fmtDur(it.d) + '</span>' : '')
                            : '') +
                        '</span></button>' +
                        '<figcaption class="galx-mono"><span class="galx-k">GX·' + pad2(i + 1) + '</span><span>' + (isV ? 'PHIM · ĐẠI HẢI' : 'ĐẠI HẢI') + '</span></figcaption>' +
                        '</figure>';
                }
                strip.innerHTML = html;
                if (total) total.textContent = (LIST.length - nVid) + ' ảnh' + (nVid ? ' · ' + nVid + ' video' : '');
                if (prog) prog.textContent = '01 / ' + pad2(LIST.length);
                var m = Math.min(LIST.length, 12), mh = '';
                for (var k = 0; k < m; k++) mh += '<span class="galx-mq-it"><img src="' + LIST[k].u + '=w400" alt="" loading="lazy" decoding="async"></span>';
                if (mqTrack) mqTrack.innerHTML = '<div class="galx-mq-half">' + mh + '</div><div class="galx-mq-half">' + mh + '</div>';
                arm();
            }
            /* clip-path reveal as frames enter */
            function arm() {
                if (REDUCED || !('IntersectionObserver' in window)) {
                    strip.querySelectorAll('.galx-fr').forEach(function (f) { f.classList.add('in'); });
                    return;
                }
                var io = new IntersectionObserver(function (es) {
                    es.forEach(function (e) {
                        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
                    });
                }, { root: strip, threshold: 0.15 });
                strip.querySelectorAll('.galx-fr').forEach(function (f) { io.observe(f); });
            }
            build();
            /* progress counter + arrows */
            var pT;
            strip.addEventListener('scroll', function () {
                if (pT) return;
                pT = setTimeout(function () {
                    pT = null;
                    var max = strip.scrollWidth - strip.clientWidth;
                    var p = max > 0 ? strip.scrollLeft / max : 0;
                    var cur = 1 + Math.round(p * (LIST.length - 1));
                    if (prog) prog.textContent = pad2(cur) + ' / ' + pad2(LIST.length);
                }, 80);
            }, { passive: true });
            function page(dir) {
                strip.scrollBy({ left: dir * strip.clientWidth * 0.8, behavior: REDUCED ? 'auto' : 'smooth' });
            }
            if (prevB) prevB.addEventListener('click', function () { page(-1); });
            if (nextB) nextB.addEventListener('click', function () { page(1); });
            /* live refresh from the album (items carries video markers;
               photos is the legacy string list) */
            fetch('/api/photos').then(function (r) { if (!r.ok) throw 0; return r.json(); })
                .then(function (j) {
                    if (!j || j.source === 'fallback') return;
                    var next = null;
                    if (j.items && j.items.length > 2) {
                        next = j.items.filter(function (p) { return p && URL_OK.test(p.u); });
                    } else if (j.photos && j.photos.length > 2) {
                        next = j.photos.filter(function (u) { return URL_OK.test(u); })
                            .map(function (u) { return { u: u }; });
                    }
                    if (!next || next.length < 3) return;
                    var sig = function (a) { return a.map(function (p) { return p.u + (p.v ? '!v' : ''); }).join('|'); };
                    if (sig(next) === sig(ITEMS)) return;
                    ITEMS = next;
                    LIST = shuffle(ITEMS.slice());
                    build();
                    announce();
                }).catch(function () {});
            /* lightbox: photos in <img>, videos in <video> via /api/video */
            var lb = document.createElement('div');
            lb.className = 'glb';
            lb.setAttribute('role', 'dialog');
            lb.setAttribute('aria-label', 'Trình xem ảnh và video');
            lb.innerHTML = '<img alt="Hình ảnh Giáo Xứ Đại Hải"><video controls playsinline preload="metadata" style="display:none"></video><button class="glb-x" aria-label="Đóng">&#10005;</button>';
            document.body.appendChild(lb);
            var lbImg = lb.querySelector('img');
            var lbVid = lb.querySelector('video');
            function stopVideo() {
                if (!lbVid.getAttribute('src')) return;
                lbVid.pause();
                lbVid.removeAttribute('src');
                lbVid.load();
            }
            function close() {
                stopVideo();
                lb.classList.remove('open');
                lbImg.src = '';
            }
            /* if the stream fails, at least show the still frame */
            lbVid.addEventListener('error', function () {
                if (!lbVid.getAttribute('src')) return;
                var poster = lbVid.poster;
                stopVideo();
                lbVid.style.display = 'none';
                lbImg.style.display = '';
                if (poster) lbImg.src = poster;
            });
            document.addEventListener('click', function (e) {
                var t = e.target.closest ? e.target.closest('.galx-btn') : null;
                if (t) {
                    var vid = t.getAttribute('data-video');
                    if (vid) {
                        lbImg.style.display = 'none';
                        lbImg.src = '';
                        lbVid.style.display = '';
                        lbVid.poster = t.getAttribute('data-poster') || '';
                        lbVid.src = '/api/video?id=' + vid;
                        lb.classList.add('open');
                        lbVid.play().catch(function () {});
                    } else {
                        stopVideo();
                        lbVid.style.display = 'none';
                        lbImg.style.display = '';
                        lbImg.src = t.getAttribute('data-full');
                        lb.classList.add('open');
                    }
                    return;
                }
                if (e.target === lb || e.target.closest('.glb-x')) close();
            });
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
        })();

        // ============================================
        // Hoạt Động: dress the activity cards with real album photos
        // (deterministic spread over the same auto-updating album list)
        // ============================================
        (function () {
            function dress(list) {
                var imgs = document.querySelectorAll('.activity-image');
                if (!imgs.length || !list || list.length < 6) return;
                var step = Math.max(1, Math.floor(list.length / imgs.length));
                imgs.forEach(function (el, i) {
                    var u = list[(2 + i * step) % list.length];
                    el.style.backgroundImage = "url('" + u + "=w800')";
                    el.classList.add('has-photo');
                });
            }
            if (window.__gxPhotos) dress(window.__gxPhotos);
            document.addEventListener('gx:photos', function (e) { dress(e.detail); });
        })();

        // ============================================
        // Gentle reveal-on-scroll for cards and section headers
        // ============================================
        (function () {
            if (!('IntersectionObserver' in window)) return;
            var sels = '.section-header, .service-card, .news-card, .about-card, .activity-card, .gallery-item, .video-card, .priest-card, .event-card, .contact-card, .announce-card, .liturgy-accordion';
            var els = document.querySelectorAll(sels);
            var perParent = new Map();
            els.forEach(function (el) {
                var n = perParent.get(el.parentNode) || 0;
                perParent.set(el.parentNode, n + 1);
                el.classList.add('rv-auto');
                el.style.setProperty('--rvi', Math.min(n, 5));
            });
            var io = new IntersectionObserver(function (es) {
                es.forEach(function (e) {
                    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
                });
            }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
            els.forEach(function (el) { io.observe(el); });
        })();

        // ============================================
        // Lazy-load the Facebook page widget ONLY when scrolled near it, so the
        // FB iframe can't steal focus and scroll the page down on load.
        // ============================================
        (function () {
            var sec = document.getElementById('fb-cantho');
            if (!sec) return;
            var loaded = false;
            function loadFB() {
                if (loaded) return;
                loaded = true;
                var s = document.createElement('script');
                s.async = true;
                s.defer = true;
                s.crossOrigin = 'anonymous';
                s.src = 'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v21.0';
                document.body.appendChild(s);
            }
            if ('IntersectionObserver' in window) {
                var io = new IntersectionObserver(function (entries) {
                    if (entries.some(function (e) { return e.isIntersecting; })) {
                        loadFB();
                        io.disconnect();
                    }
                }, { rootMargin: '400px 0px' });
                io.observe(sec);
            } else {
                window.addEventListener('scroll', function once() {
                    loadFB();
                    window.removeEventListener('scroll', once);
                }, { passive: true });
            }
        })();
    