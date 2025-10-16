import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Simple component test to verify basic functionality
const SimpleButton = ({ label, onClick }) => (
  <button onClick={onClick}>{label}</button>
);

describe('Basic Test Suite', () => {
  it('renders a simple button', () => {
    render(<SimpleButton label="Test Button" />);
    
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('can check for role attributes', () => {
    render(<button role="button">Click me</button>);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('can check for aria-label attributes', () => {
    render(<button aria-label="Close dialog">×</button>);
    
    expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
  });
});