const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('/Users/haobui/.gemini/antigravity-ide/brain/e72f74e6-d11e-4fb5-8143-266769515cb9/.system_generated/steps/1745/content.md', 'utf8');
const $ = cheerio.load(html);
$('section.section--evidence').each((_, el) => {
  const headerText = $(el).find('.section__head h2').text().trim().toLowerCase();
  console.log('Found section:', headerText);
  $(el).find('.section__content p').each((_, p) => {
    console.log('Paragraph:', $(p).text().trim());
  });
});
