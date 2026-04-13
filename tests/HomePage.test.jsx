import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../src/pages/HomePage.jsx';

describe('HomePage', () => {
  test('presents a product-first review home with anchored guidance', () => {
    render(<HomePage onStart={vi.fn()} />);

    expect(
      screen.getByRole('heading', {
        name: /Make inbox decisions with context, not panic\./i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: /Designed for review, not for blind inbox automation\./i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Review important email before anything happens/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Next decisions, already framed\./i)
    ).toBeInTheDocument();

    /* Three "Continue with Google" CTAs: nav bar, hero, and final CTA */
    expect(screen.getAllByRole('button', { name: /Continue with Google/i })).toHaveLength(3);
    expect(screen.getByRole('button', { name: /See how the review works/i })).toBeInTheDocument();
  });
});
