import { render, screen } from '@testing-library/react';
import { stripe } from '../../services/stripe';
import { mocked } from 'ts-jest/utils';
import Home, { getStaticProps } from '../../pages';

jest.mock('next/router');
jest.mock('next-auth/client', () => ({
  useSession: () => [null, false],
}));

jest.mock('../../services/stripe');

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ value: '$10.00' }} />);

    expect(screen.getByText('for $10.00 month')).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const stripePricesRetrieveMock = mocked(stripe.prices.retrieve);

    stripePricesRetrieveMock.mockResolvedValueOnce({
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            value: '$10.00',
          },
        },
      }),
    );
  });
});
