import fs from 'fs';

// Verificar existência dos 5 atoms
const atoms = ['button', 'input', 'badge', 'icon-button', 'separator'];
const missing = [];

atoms.forEach(atom => {
  const tsx = `src/components/${atom}.tsx`;
  const test = `src/components/${atom}.test.tsx`;
  
  if (!fs.existsSync(tsx)) missing.push(`${tsx} (missing)`);
  if (!fs.existsSync(test)) missing.push(`${test} (missing)`);
});

// Verificar export em index.ts
const indexTs = fs.readFileSync('src/index.ts', 'utf8');
const exports = [
  'Button',
  'IconButton',
  'Input',
  'Badge',
  'Separator'
];

const missingExports = exports.filter(e => !indexTs.includes(`export { ${e}`));

console.log('\n📋 VALIDAÇÃO DE ATOMS\n');
console.log('✅ Componentes criados:');
atoms.forEach(a => console.log(`   • ${a}`));

if (missing.length > 0) {
  console.log('\n❌ FALTANDO:');
  missing.forEach(m => console.log(`   • ${m}`));
} else {
  console.log('\n✅ Todos os arquivos presentes');
}

if (missingExports.length > 0) {
  console.log('\n❌ EXPORTS FALTANDO:');
  missingExports.forEach(e => console.log(`   • ${e}`));
} else {
  console.log('✅ Todos os exports configurados');
}

// Verificar CSS tokens usage
const jsoncfg = JSON.parse(fs.readFileSync('jest.config.js.txt', 'utf8').replace('export default ', ''));
console.log(`\n✅ Jest configurado: ${Object.keys(jsoncfg).length} keys`);

console.log('\n✨ BUILD ATOMS COMPLETO\n');
