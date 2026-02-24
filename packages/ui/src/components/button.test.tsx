/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './button';

describe('Button', () => {
  // Testes básicos de renderização
  it('renderiza o botão com texto padrão', () => {
    render(<Button>Clique aqui</Button>);
    const button = screen.getByRole('button', { name: /clique aqui/i });
    expect(button).toBeInTheDocument();
  });

  it('renderiza com variant default', () => {
    render(<Button variant="default">Padrão</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-primary');
  });

  it('renderiza com variant destructive', () => {
    render(<Button variant="destructive">Deletar</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-destructive');
  });

  it('renderiza com variant ghost', () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-accent');
  });

  // Testes de tamanho
  it('renderiza com size sm', () => {
    render(<Button size="sm">Pequeno</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9');
  });

  it('renderiza com size lg', () => {
    render(<Button size="lg">Grande</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-11');
  });

  // Testes de estado
  it('desabilita o botão quando disabled=true', () => {
    render(<Button disabled>Desabilitado</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('renderiza spinner quando isLoading=true', () => {
    render(<Button isLoading>Carregando...</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
  });

  // Testes de interação
  it('dispara onClick quando clicado', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Clicável</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('não dispara onClick quando disabled', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} disabled>Desabilitado</Button>);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  // Testes de acessibilidade
  it('tem foco acessível via teclado', () => {
    render(<Button>Focável</Button>);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });

  it('renderiza com tipo button padrão', () => {
    render(<Button>Botão</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
