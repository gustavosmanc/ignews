import { render, screen } from '@testing-library/react';
import { ActiveLink } from '.';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      asPath: '/',
    };
  },
}));

describe('ActiveLink component', () => {
  beforeEach(() => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>,
    );
  });

  it('renders correctly', () => {
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('adds active class if the link is currently active', () => {
    expect(screen.getByText('Home')).toHaveClass('active');
  });
});
