import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const url = 'https://www.vaticannews.va/vi.html';
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error('Failed to fetch Vatican News');
    const html = await res.text();
    const $ = cheerio.load(html);

    const items: any[] = [];

    // Lấy 6 bài viết mới nhất
    $('.teaser').slice(0, 6).each((i, el) => {
      const title = $(el).find('.teaser__title').text().trim();
      const excerpt = $(el).find('.teaser__text').text().trim();
      const link = 'https://www.vaticannews.va' + $(el).find('a').attr('href');
      let image = $(el).find('source').first().attr('data-original-set');
      if (!image) image = $(el).find('img').attr('data-original');
      if (image) {
        image = 'https://www.vaticannews.va' + image.split(' ')[0];
      }

      if (title) {
        items.push({
          title,
          excerpt,
          link,
          image,
          source: 'Vatican News Tiếng Việt'
        });
      }
    });

    const newsData = { items, lastUpdated: new Date().toISOString() };
    
    const publicDir = path.join(process.cwd(), 'public');
    fs.writeFileSync(path.join(publicDir, 'news.json'), JSON.stringify(newsData, null, 2), 'utf8');

    return NextResponse.json({ success: true, count: items.length, data: newsData });
  } catch (error: any) {
    console.error("Cron fetch news error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
