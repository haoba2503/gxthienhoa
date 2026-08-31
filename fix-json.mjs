import fs from 'fs';
import path from 'path';

const publicDir = './public';
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.json'));

for (const file of files) {
    const filePath = path.join(publicDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/Đại Hải/g, 'Thiên Hoa')
                     .replace(/Cần Thơ/g, 'Buôn Ma Thuột');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
}
