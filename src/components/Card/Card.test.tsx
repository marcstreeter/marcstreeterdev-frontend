import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '../ThemeProvider';
import { Card } from './Card';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Card', () => {
  it('renders with children', () => {
    renderWithTheme(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with title', () => {
    renderWithTheme(<Card title="Test Title">Card content</Card>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    renderWithTheme(<Card className="custom-class">Card content</Card>);
    const card = screen.getByText('Card content').closest('div');
    expect(card).toHaveClass('custom-class');
  });
}); 