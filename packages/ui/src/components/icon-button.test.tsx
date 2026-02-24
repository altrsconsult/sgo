/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IconButton } from './icon-button';

// Mock icon para testes
const MockIcon = () => <svg data-testid="mock-icon" />;

describe('IconButton', () => {
  // Testes básicos de renderização
  it('renderiza o botão com ícone', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Ação" />
    );
    const button = screen.getByRole('button', { name: /ação/i });
    expect(button).toBeInTheDocument();
  });

  it('renderiza o ícone dentro do botão', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" />
    );
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();
  });

  // Testes de ARIA label
  it('aplica ariaLabel como aria-label', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Deletar" />
    );
    const button = screen.getByRole('button', { name: /deletar/i });
    expect(button).toHaveAttribute('aria-label', 'Deletar');
  });

  it('aplica ariaLabel como title (tooltip)', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Configurações" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('title', 'Configurações');
  });

  // Testes de variantes
  it('renderiza com variant default', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" variant="default" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('renderiza com variant secondary', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" variant="secondary" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-secondary');
  });

  it('renderiza com variant ghost', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" variant="ghost" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-accent');
  });

  it('renderiza com variant minimal', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" variant="minimal" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('text-foreground');
  });

  it('renderiza com variant destructive', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" variant="destructive" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  // Testes de tamanho
  it('renderiza com size sm', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" size="sm" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-8');
    expect(button).toHaveClass('w-8');
  });

  it('renderiza com size md (padrão)', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-10');
    expect(button).toHaveClass('w-10');
  });

  it('renderiza com size lg', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" size="lg" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12');
    expect(button).toHaveClass('w-12');
  });

  // Testes de estado
  it('desabilita o botão quando disabled=true', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" disabled />
    );
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  // Testes de interação
  it('dispara onClick quando clicado', () => {
    const onClick = jest.fn();
    render(
      <IconButton
        icon={<MockIcon />}
        ariaLabel="Teste"
        onClick={onClick}
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('não dispara onClick quando disabled', () => {
    const onClick = jest.fn();
    render(
      <IconButton
        icon={<MockIcon />}
        ariaLabel="Teste"
        onClick={onClick}
        disabled
      />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  // Testes de acessibilidade
  it('tem foco acessível', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" />
    );
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });

  it('tem ring focus-visible para teclado', () => {
    render(
      <IconButton icon={<MockIcon />} ariaLabel="Teste" />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus-visible:ring-2');
  });
});
