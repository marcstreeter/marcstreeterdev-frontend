import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '../ThemeProvider';
import { Card } from './Card';

import '../test-setup';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Card', () => {
  it('renders with title', () => {
    renderWithTheme(<Card title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    renderWithTheme(<Card subtitle="Test Subtitle" />);
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders with children', () => {
    renderWithTheme(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders with actions', () => {
    renderWithTheme(
      <Card actions={<button>Action Button</button>} />
    );
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    renderWithTheme(<Card ref={ref} title="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
}); 