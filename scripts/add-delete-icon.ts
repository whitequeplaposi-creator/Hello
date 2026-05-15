import fs from 'fs';
import path from 'path';

const sourceIcon = 'C:/Users/macky/Downloads/delete-svgrepo-com.svg';
const targetIcon = path.join(process.cwd(), 'public', 'delete-icon.svg');

try {
  // Kopiera ikonen till public-mappen
  fs.copyFileSync(sourceIcon, targetIcon);
  console.log('✓ Ikonen har lagts till i public-mappen som delete-icon.svg');
} catch (error) {
  console.error('Fel vid kopiering av ikon:', error);
  process.exit(1);
}
