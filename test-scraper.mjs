import * as cheerio from "cheerio";

async function getDailyLiturgy() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const fullUrl = `https://www.vaticannews.va/vi/loi-chua-hang-ngay/${yyyy}/${mm}/${dd}.html`;
  
  console.log("Fetching: " + fullUrl);
  try {
    const res = await fetch(fullUrl);
    if (!res.ok) {
      console.log("Failed to fetch: " + res.status);
      return;
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const title = $('h1').first().text().trim();
    console.log("Title: " + title);
    
    // Vatican uses standard <div class="section__content"> or <article>
    // Let's dump all h2/h3 and paragraphs
    $('.section__content').each((i, el) => {
       console.log("Section " + i + ": " + $(el).text().substring(0, 100).replace(/\n/g, ' '));
    });
    
    // Vatican News article structure: usually <div class="section--liturgy__reading"> ? Let's check classes of divs
    $('div[class*="reading"]').each((i, el) => {
        console.log("Found reading class: " + $(el).attr('class'));
    });
    
  } catch(e) {
    console.error(e);
  }
}
getDailyLiturgy();
