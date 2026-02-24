/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge } from './badge';

describe('Badge', () => {
  // Testes básicos de renderização
  it('renderiza o badge com texto', () => {
    render(<Badge>Novo</Badge>);
    const badge = screen.getByText(/novo/i);
    expect(badge).toBeInTheDocument();
  });

  it('renderiza com variant default', () => {
    render(<Badge variant="default">Padrão</Badge>);
    const badge = screen.getByText(/padrão/i);
    expect(badge).toHaveClass('bg-primary');
  });

  it('renderiza com variant success', () => {
    render(<Badge variant="success">Ativo</Badge>);
    const badge = screen.getByText(/ativo/i);
    expect(badge).toHaveClass('bg-green-500');
  });

  it('renderiza com variant warning', () => {
    render(<Badge variant="warning">Atenção</Badge>);
    const badge = screen.getByText(/atenção/i);
    expect(badge).toHaveClass('bg-yellow-500');
  });

  it('renderiza com variant destructive', () => {
    render(<Badge variant="destructive">Erro</Badge>);
    const badge = screen.getByText(/erro/i);
    expect(badge).toHaveClass('bg-destructive');
  });

  it('renderiza com variant secondary', () => {
    render(<Badge variant="secondary">Secundário</Badge>);
    const badge = screen.getByText(/secundário/i);
    expect(badge).toHaveClass('bg-secondary');
  });

  it('renderiza com variant outline', () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText(/outline/i);
    expect(badge).toHaveClass('text-foreground');
  });

  // Testes de estilos
  it('aplica classes base (padding, border-radius)', () => {
    render(<Badge>Badge</Badge>);
    const badge = screen.getByText(/badge/i);
    expect(badge).toHaveClass('rounded-full');
    expect(badge).toHaveClass('px-2.5');
  });

  // Testes de className customizado
  it('aceita className adicional', () => {
    render(<Badge className="custom-class">Custom</Badge>);
    const badge = screen.getByText(/custom/i);
    expect(badge).toHaveClass('custom-class');
  });

  // Testes de semântica
  it('renderiza como div', () => {
    const { container } = render(<Badge>Badge</Badge>);
    const badge = container.firstChild;
    expect(badge?.nodeName).toBe('DIV');
  });
});
