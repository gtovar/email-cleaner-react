// tests/StatusMessage.test.jsx
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusMessage from '../src/components/StatusMessage.jsx';

describe('StatusMessage', () => {
  test('renders nothing when there is no message', () => {
    const { container } = render(
      <StatusMessage message={null} type={null} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('renders a success message', () => {
    render(<StatusMessage message="All good" type="success" />);

    expect(screen.getByText('All good')).toBeInTheDocument();
  });

  test('renders an error message', () => {
    render(<StatusMessage message="Something failed" type="error" />);

    expect(screen.getByText('Something failed')).toBeInTheDocument();
  });
});

