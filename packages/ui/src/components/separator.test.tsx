/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Separator } from './separator';

describe('Separator', () => {
  // Testes básicos de renderização
  it('renderiza o separator', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild;
    expect(separator).toBeInTheDocument();
  });

  it('renderiza como div', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild;
    expect(separator?.nodeName).toBe('DIV');
  });

  // Testes de orientação
  it('renderiza com orientação horizontal por padrão', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('h-[1px]');
    expect(separator).toHaveClass('w-full');
  });

  it('renderiza com orientação vertical', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('h-full');
    expect(separator).toHaveClass('w-[1px]');
  });

  it('renderiza com orientação horizontal explícita', () => {
    const { container } = render(<Separator orientation="horizontal" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('h-[1px]');
    expect(separator).toHaveClass('w-full');
  });

  // Testes de acessibilidade
  it('renderiza com role=none quando decorative=true', () => {
    const { container } = render(<Separator decorative />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveAttribute('role', 'none');
  });

  it('renderiza com role=separator quando decorative=false', () => {
    const { container } = render(<Separator decorative={false} />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveAttribute('role', 'separator');
  });

  it('não renderiza aria-orientation quando decorative=true', () => {
    const { container } = render(<Separator decorative />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).not.toHaveAttribute('aria-orientation');
  });

  it('renderiza aria-orientation quando decorative=false', () => {
    const { container } = render(
      <Separator orientation="horizontal" decorative={false} />
    );
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('renderiza aria-orientation vertical corretamente', () => {
    const { container } = render(
      <Separator orientation="vertical" decorative={false} />
    );
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveAttribute('aria-orientation', 'vertical');
  });

  // Testes de estilos
  it('aplica classe de cor (bg-border)', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('bg-border');
  });

  it('aplica classe shrink-0', () => {
    const { container } = render(<Separator />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('shrink-0');
  });

  // Testes de className customizado
  it('aceita className adicional', () => {
    const { container } = render(<Separator className="custom-class" />);
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('custom-class');
  });

  it('combina className com classes padrão', () => {
    const { container } = render(
      <Separator className="custom-class" />
    );
    const separator = container.firstChild as HTMLElement;
    expect(separator).toHaveClass('bg-border');
    expect(separator).toHaveClass('custom-class');
  });

  // Testes de refs
  it('aceita ref forwarding', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
