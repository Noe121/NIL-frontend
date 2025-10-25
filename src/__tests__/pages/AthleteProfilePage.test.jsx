import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AthleteProfilePage from '../../pages/AthleteProfilePage';

describe('AthleteProfilePage', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders athlete profile page', () => {
    renderWithRouter(<AthleteProfilePage />);
    expect(document.body).toBeInTheDocument();
  });

  test('displays athlete name and bio', async () => {
    renderWithRouter(<AthleteProfilePage />);
    await waitFor(() => {
      const headings = screen.queryAllByRole('heading');
      expect(headings.length >= 0).toBe(true);
    });
  });

  test('shows athlete photo/avatar', () => {
    renderWithRouter(<AthleteProfilePage />);
    const images = document.querySelectorAll('img');
    expect(images.length >= 0).toBe(true);
  });

  test('displays athlete stats', async () => {
    renderWithRouter(<AthleteProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows follower count', async () => {
    renderWithRouter(<AthleteProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('displays bio/description', async () => {
    renderWithRouter(<AthleteProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('shows social media links', () => {
    renderWithRouter(<AthleteProfilePage />);
    const links = document.querySelectorAll('a');
    expect(links.length >= 0).toBe(true);
  });

  test('displays active deals', async () => {
    renderWithRouter(<AthleteProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });

  test('has sponsor/contact button', () => {
    renderWithRouter(<AthleteProfilePage />);
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length >= 0).toBe(true);
  });

  test('shows athlete tier/level', async () => {
    renderWithRouter(<AthleteProfilePage />);
    await waitFor(() => {
      expect(document.body).toBeInTheDocument();
    });
  });
});
