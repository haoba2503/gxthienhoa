import fs from 'fs';

const contentMdPath = '/Users/haobui/.gemini/antigravity-ide/brain/e72f74e6-d11e-4fb5-8143-266769515cb9/.system_generated/steps/284/content.md';
const content = fs.readFileSync(contentMdPath, 'utf8');

const scriptMatch = content.match(/<script>(.*?)<\/script>/s);
if (scriptMatch) {
  fs.writeFileSync('public/script.js', scriptMatch[1]);
  console.log('Script extracted!');
} else {
  console.log('No script found');
}
