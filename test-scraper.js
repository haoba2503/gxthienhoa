const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function testScrape() {
  const fullUrl = `https://www.vaticannews.va/vi/loi-chua-hang-ngay/2026/08/31.html`;
  
  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
        console.log("Fetch failed", res.status);
        const fallback = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'liturgy.json'), 'utf8'));
        console.log("Fallback:", fallback.readings.map(r => r.label));
        return;
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let bd1 = null;
    let bd2 = null;
    let tm = null;
    
    $('.section__content').each((i, el) => {
      let currentLabel = '';
      let currentText = '';
      $(el).children().each((_, child) => {
        const text = $(child).text().trim();
        const textLower = text.toLowerCase();
        if (child.tagName === 'h2' || child.tagName === 'h3' || textLower.includes('tin mừng') || textLower.includes('bài đọc') || textLower.includes('phúc âm')) {
          if (currentText && currentLabel) {
            if (currentLabel.toLowerCase().includes('tin mừng') || currentLabel.toLowerCase().includes('phúc âm')) tm = { label: 'Tin Mừng', text: currentText.trim() };
            else if (currentLabel.toLowerCase().includes('bài đọc 2') || currentLabel.toLowerCase().includes('bài đọc ii')) bd2 = { label: 'Bài Đọc 2', text: currentText.trim() };
            else if (!bd1) bd1 = { label: 'Bài Đọc 1', text: currentText.trim() };
            currentText = '';
          }
          currentLabel = text.length > 50 ? currentLabel : text;
        } else if (child.tagName === 'p') {
          currentText += text + '\n\n';
        }
      });
      if (currentText && currentLabel) {
         if (currentLabel.toLowerCase().includes('tin mừng') || currentLabel.toLowerCase().includes('phúc âm')) tm = { label: 'Tin Mừng', text: currentText.trim() };
         else if (currentLabel.toLowerCase().includes('bài đọc 2') || currentLabel.toLowerCase().includes('bài đọc ii')) bd2 = { label: 'Bài Đọc 2', text: currentText.trim() };
         else if (!bd1) bd1 = { label: 'Bài Đọc 1', text: currentText.trim() };
      }
    });

    const readings = [];
    if (bd1) readings.push(bd1);
    if (bd2) readings.push(bd2);
    if (tm) readings.push(tm);
    
    console.log("Live parsed:");
    console.log(readings.map(r => r.label));

  } catch (e) {
    console.error("Scrape error:", e);
  }
}
testScrape();
