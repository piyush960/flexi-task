import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NavLink } from '../NavLink';
import { createRef } from 'react';

describe('NavLink', () => {
  it('renders a navigation link', () => {
    render(
      <MemoryRouter>
        <NavLink to="/about">About</NavLink>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/about');
  });

  it('applies className prop', () => {
    render(
      <MemoryRouter>
        <NavLink to="/about" className="custom-class">
          About
        </NavLink>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /about/i });
    expect(link).toHaveClass('custom-class');
  });

  it('applies activeClassName when link is active', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <nav>
          <NavLink to="/" className="nav-link" activeClassName="active">
            Home
          </NavLink>
        </nav>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /home/i });
    expect(link).toHaveClass('nav-link');
    expect(link).toHaveClass('active');
  });

  it('forwards ref correctly', () => {
    const ref = createRef<HTMLAnchorElement>();
    
    render(
      <MemoryRouter>
        <NavLink to="/about" ref={ref}>
          About
        </NavLink>
      </MemoryRouter>
    );

    expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
  });

  it('passes through additional props', () => {
    render(
      <MemoryRouter>
        <NavLink to="/about" data-testid="custom-link" aria-label="Navigation to About">
          About
        </NavLink>
      </MemoryRouter>
    );

    const link = screen.getByTestId('custom-link');
    expect(link).toHaveAttribute('aria-label', 'Navigation to About');
  });

  it('handles multiple className combinations', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <nav>
          <NavLink to="/" className="base-class" activeClassName="active-class" pendingClassName="pending-class">
            Home
          </NavLink>
        </nav>
      </MemoryRouter>
    );

    const link = screen.getByRole('link', { name: /home/i });
    expect(link).toHaveClass('base-class');
    expect(link).toHaveClass('active-class');
  });

  it('has correct display name', () => {
    expect(NavLink.displayName).toBe('NavLink');
  });
});

