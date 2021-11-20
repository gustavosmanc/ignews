import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { getPrismicClient } from '../../services/prismic';
import { getSession } from 'next-auth/client';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';

jest.mock('next/router', () => ({
  useRouter() {
    return {
      asPath: '/',
    };
  },
}));

jest.mock('next-auth/client');
jest.mock('../../services/prismic');

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updatedAt: 'April 10th',
};

describe('Post page', () => {
  it('renders correctly', () => {
    render(<Post post={post} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMock = mocked(getSession);

    getSessionMock.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      }),
    );
  });

  it('loads initial data', async () => {
    const getSessionMock = mocked(getSession);
    const getPrismicClientMock = mocked(getPrismicClient);

    getSessionMock.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    });

    getPrismicClientMock.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'My New Post' }],
          content: [{ type: 'paragraph', text: 'Post content' }],
        },
        last_publication_date: '04-01-2021',
      }),
    } as any);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My New Post',
            content: '<p>Post content</p>',
            updatedAt: 'April 01, 2021',
          },
        },
      }),
    );
  });
});
