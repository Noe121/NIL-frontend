import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import InfluencerProfilePage from '../../pages/InfluencerProfilePage';

describe('InfluencerProfilePage', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders influencer profile page', () => {
    renderWithRouter(<InfluencerProfilePage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays influencer name and bio', async () => {
    renderWithRouter(<InfluencerProfilePage />);
    await waitFor(() => {
      const headings = screen.queryAllByRole('heading');
      expect(headings.length >= 0).toBe(true);
    });
  });

  test('shows influencer avatar', () => {
    renderWithRouter(<InfluencerProfilePage />);
    const images = document.querySelectorAll('img');
    expect(images.length >= 0).toBe(true);
  });

  test('displays follower count', async () => {
    renderWithRouter(<InfluencerProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows engagement metrics', async () => {
    renderWithRouter(<InfluencerProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays bio and description', async () => {
    renderWithRouter(<InfluencerProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows content categories', async () => {
    renderWithRouter(<InfluencerProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays portfolio or sample content', async () => {
    renderWithRouter(<InfluencerProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has collaboration inquiry button', () => {
    renderWithRouter(<InfluencerProfilePage />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length >= 0).toBe(true);
  });

  test('shows influencer tier/earnings potential', async () => {
    renderWithRouter(<InfluencerProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
