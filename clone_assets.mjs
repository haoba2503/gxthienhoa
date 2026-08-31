import fs from 'fs';
import path from 'path';

const contentMdPath = '/Users/haobui/.gemini/antigravity-ide/brain/e72f74e6-d11e-4fb5-8143-266769515cb9/.system_generated/steps/284/content.md';
const content = fs.readFileSync(contentMdPath, 'utf8');

const regex = /images\/[^"'\?#\s)]+/g;
const matches = [...new Set(content.match(regex))];

fs.mkdirSync('public/images', { recursive: true });

async function download(urlPath) {
  const url = `https://giaoxudaihai.com/${urlPath}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`Failed to download ${url}`);
    return;
  }
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(`public/${urlPath}`, buffer);
  console.log(`Downloaded ${urlPath}`);
}

Promise.all(matches.map(download)).then(() => console.log('Done'));
