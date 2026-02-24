import { execSync } from 'child_process';
const result = execSync('tsc --noEmit 2>&1', { encoding: 'utf8', stdio: 'pipe' });
const lines = result.split('\n');
const ourFiles = ['button.tsx', 'input.tsx', 'badge.tsx', 'separator.tsx', 'icon-button.tsx'];
const filtered = lines.filter(l => ourFiles.some(f => l.includes(f)));
console.log(filtered.length === 0 ? '✅ Nossos componentes: OK' : filtered.join('\n'));
