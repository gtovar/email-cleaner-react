import React from 'react';
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../src/pages/HomePage.jsx';

describe('HomePage', () => {
  test('uses direct Google CTA copy and real footer destinations', () => {
    render(<HomePage onStart={vi.fn()} />);

    expect(
      screen.getByRole('heading', { name: /Review important email before anything happens/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /Built to surface the signal, not hide the decision/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Google sign-in opens directly\./i).length).toBeGreaterThan(0);
    expect(
      screen.queryByRole('heading', { name: /A clearer way to review email/i })
    ).not.toBeInTheDocument();

    expect(screen.getAllByRole('button', { name: /Continue with Google/i })).toHaveLength(3);
    expect(screen.getByRole('link', { name: /Why it's different/i })).toHaveAttribute(
      'href',
      '#trust-principles'
    );
    expect(screen.getByRole('link', { name: /How it works/i })).toHaveAttribute(
      'href',
      '#how-it-works'
    );
    expect(screen.getByRole('link', { name: /^Sign in$/i })).toHaveAttribute('href', '/login');
  });
});
