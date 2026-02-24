import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = new Hono();

// CORS aberto para o chassi (dev e prod) fazer requisições de módulo
app.use('*', cors({ origin: '*' }));

// Expõe manifest.json — descoberto pelo chassi no devModulesSync
app.get('/manifest.json', (c) => {
  const manifestPath = path.join(__dirname, '../../manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  return c.json(manifest);
});

// Rotas específicas do módulo — acessadas via /api/modules/boilerplate/*
app.get('/hello', (c) => {
  return c.json({ message: 'Olá do módulo boilerplate!' });
});

const PORT = Number(process.env.PORT) || 5001;

serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Boilerplate server rodando na porta ${PORT}`);
});
