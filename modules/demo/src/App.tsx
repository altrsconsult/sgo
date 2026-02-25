import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import type { ModuleContext } from '@sgo/sdk';
import { DemoLayout } from './components/DemoLayout';
import { Dashboard } from './pages/Dashboard';
import { Listagem } from './pages/Listagem';
import { Formulario } from './pages/Formulario';
import { Componentes } from './pages/Componentes';
interface AppProps {
  context?: ModuleContext;
}

/**
 * App principal do módulo demo.
 * Usa BrowserRouter com basename vazio para funcionar standalone e em iframe.
 * Cada rota representa uma seção do showcase.
 */
export default function App({ context: _context }: AppProps) {
  return (
    <BrowserRouter>
      <DemoLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/listagem" element={<Listagem />} />
          <Route path="/formulario" element={<Formulario />} />
          <Route path="/componentes" element={<Componentes />} />
        </Routes>
      </DemoLayout>
    </BrowserRouter>
  );
}
