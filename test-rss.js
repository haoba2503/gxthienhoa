const cheerio = require('cheerio');
async function run() {
  const res = await fetch("https://www.vaticannews.va/vi.rss.xml");
  const xml = await res.text();
  const $ = cheerio.load(xml, { xmlMode: true });
  const items = [];
  $('item').slice(0, 6).each((_, el) => {
    const title = $(el).find('title').text().trim().replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    const link = $(el).find('link').text().trim();
    
    // Extract first paragraph from description
    const descHtml = $(el).find('description').text().trim().replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    const $desc = cheerio.load(descHtml);
    const excerpt = $desc('p').first().text().trim();
    
    // Extract image if available
    let image = '';
    const enclosure = $(el).find('enclosure');
    if (enclosure.length > 0) {
      image = enclosure.attr('url');
    }

    items.push({
      title,
      excerpt,
      url: link,
      image,
      source: 'Vatican News'
    });
  });
  console.log(items);
}
run();
