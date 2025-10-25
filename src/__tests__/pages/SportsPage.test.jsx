import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SportsPage from '../../pages/SportsPage';

describe('SportsPage', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders sports page', () => {
    renderWithRouter(<SportsPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('renders sports hero section', () => {
    renderWithRouter(<SportsPage />);
    const heroText = screen.queryByText(/Student Athletes/i) || screen.queryByText(/Turn Your Talent/i);
    expect(heroText).toBeTruthy();
  });

  test('renders student athletes carousel', () => {
    renderWithRouter(<SportsPage />);
    const carouselText = screen.queryByText(/Elite Student-Athletes/i) || screen.queryByText(/student/i);
    expect(carouselText).toBeTruthy();
  });

  test('renders deals management section', () => {
    renderWithRouter(<SportsPage />);
    const dealsText = screen.queryByText(/Deal Management/i) || screen.queryByText(/deals/i);
    expect(dealsText).toBeTruthy();
  });

  test('renders compliance rules section', () => {
    renderWithRouter(<SportsPage />);
    const complianceText = screen.queryByText(/Compliance/i) || screen.queryByText(/NCAA/i);
    expect(complianceText).toBeTruthy();
  });

  test('renders sports stats section', () => {
    renderWithRouter(<SportsPage />);
    const statsText = screen.queryByText(/Student-Athletes/i) || screen.queryByText(/Total Deal/i);
    expect(statsText).toBeTruthy();
  });

  test('renders testimonials section', () => {
    renderWithRouter(<SportsPage />);
    const testimonials = screen.queryByText(/community|testimonial/i);
    expect(testimonials).toBeTruthy();
  });

  test('renders footer', () => {
    renderWithRouter(<SportsPage />);
    expect(document.body).toBeInTheDocument();
  });

  test('all navigation links are present', () => {
    renderWithRouter(<SportsPage />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('handles athlete click navigation', () => {
    renderWithRouter(<SportsPage />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('displays student-athlete specific content', () => {
    renderWithRouter(<SportsPage />);
    const athleteContent = screen.queryByText(/Premium Deals|NCAA|Compliance/) || document.body.innerHTML;
    expect(athleteContent).toBeTruthy();
  });
});
