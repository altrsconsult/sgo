import { db } from './index.js';
import { users, systemSettings } from './schema.js';
import { insertIgnore } from './helpers.js';
import bcrypt from 'bcryptjs';

// Seed padrão para desenvolvimento (admin + user de exemplo)
export async function seedDevData() {
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    10
  );
  const userPassword = await bcrypt.hash('usuario123', 10);

  // Cria admin padrão de desenvolvimento
  await insertIgnore(users, {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: adminPassword,
    name: 'Administrador',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    role: 'admin',
  });

  // Cria usuário de exemplo
  await insertIgnore(users, {
    username: 'usuario',
    password: userPassword,
    name: 'Usuário Exemplo',
    email: 'usuario@example.com',
    role: 'user',
  });

  // Configurações padrão de whitelabel
  const defaultSettings = [
    { key: 'app.name', value: 'SGO', category: 'whitelabel', description: 'Nome da aplicação' },
    { key: 'app.logo_url', value: null, category: 'whitelabel', description: 'URL do logo (modo claro)' },
    { key: 'app.logo_dark_url', value: null, category: 'whitelabel', description: 'URL do logo (modo escuro)' },
    { key: 'app.primary_color', value: '#6366f1', category: 'whitelabel', description: 'Cor primária hex' },
    { key: 'app.favicon_url', value: null, category: 'whitelabel', description: 'URL do favicon' },
    { key: 'app.custom_css', value: null, category: 'whitelabel', description: 'CSS customizado injetado' },
  ];

  for (const setting of defaultSettings) {
    await insertIgnore(systemSettings, setting);
  }

  console.log('Seed de desenvolvimento concluído.');
}
