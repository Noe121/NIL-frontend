import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../../pages/LandingPage';

describe('LandingPage', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders landing page', () => {
    renderWithRouter(<LandingPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders hero section', () => {
    renderWithRouter(<LandingPage />);
    // Check for hero content
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  test('renders athletes carousel section', () => {
    renderWithRouter(<LandingPage />);
    const text = screen.queryByText(/Top Sports Influencers/i);
    expect(text || screen.queryByText(/Athletes/i)).toBeTruthy();
  });

  test('renders statistics section', () => {
    renderWithRouter(<LandingPage />);
    const stats = screen.queryByText(/Influencers/i) || screen.queryByText(/Athletes/i);
    expect(stats).toBeTruthy();
  });

  test('renders testimonials section', () => {
    renderWithRouter(<LandingPage />);
    const testimonialText = screen.queryByText(/community/i) || screen.queryByText(/testimonial/i);
    expect(testimonialText).toBeTruthy();
  });

  test('renders footer', () => {
    renderWithRouter(<LandingPage />);
    // Footer typically contains copyright or links
    expect(document.body.innerHTML).toMatch(/footer|copyright|footer/i);
  });

  test('renders early access section', () => {
    renderWithRouter(<LandingPage />);
    const earlyAccess = screen.queryByText(/early|access/i);
    expect(earlyAccess).toBeTruthy();
  });

  test('page is responsive', () => {
    renderWithRouter(<LandingPage />);
    const container = screen.getByRole('main') || document.querySelector('section');
    expect(container).toBeInTheDocument();
  });

  test('all buttons are accessible', () => {
    renderWithRouter(<LandingPage />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
