/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from './input';

describe('Input', () => {
  // Testes básicos de renderização
  it('renderiza o input field', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renderiza com placeholder', () => {
    render(<Input placeholder="Digite aqui" />);
    const input = screen.getByPlaceholderText(/digite aqui/i);
    expect(input).toBeInTheDocument();
  });

  it('renderiza com type=email', () => {
    render(<Input type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renderiza com type=password', () => {
    render(<Input type="password" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'password');
  });

  // Testes de erro
  it('exibe mensagem de erro quando error prop é passado', () => {
    render(<Input error="Campo obrigatório" />);
    const errorMsg = screen.getByText(/campo obrigatório/i);
    expect(errorMsg).toBeInTheDocument();
  });

  it('aplica classe de erro quando error prop existe', () => {
    render(<Input error="Erro!" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-destructive');
  });

  it('não renderiza mensagem de erro quando error é undefined', () => {
    render(<Input />);
    expect(screen.queryByText(/campo obrigatório/i)).not.toBeInTheDocument();
  });

  // Testes de estado
  it('desabilita o input quando disabled=true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('aplica classe disabled quando disabled=true', () => {
    render(<Input disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('disabled:opacity-50');
  });

  // Testes de interação
  it('atualiza value quando texto é digitado', () => {
    render(<Input />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'novo valor' } });
    expect(input.value).toBe('novo valor');
  });

  it('dispara onChange quando valor muda', () => {
    const onChange = jest.fn();
    render(<Input onChange={onChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(onChange).toHaveBeenCalled();
  });

  // Testes de acessibilidade
  it('tem foco acessível', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    input.focus();
    expect(input).toHaveFocus();
  });

  it('renderiza com classe de ring para focus', () => {
    render(<Input />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('focus-visible:ring-2');
  });
});
