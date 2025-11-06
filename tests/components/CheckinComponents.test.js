
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi, describe, it } from 'vitest';
import CheckinFlow from '../../src/components/CheckinFlow.jsx';
import CheckinButton from '../../src/components/CheckinButton.jsx';
import SocialVerification from '../../src/components/SocialVerification.jsx';

vi.mock('../../src/services/checkinService.js', () => ({
  checkinService: {
    getFeatureFlags: vi.fn().mockResolvedValue({
      enable_geo_checkins: true,
      enable_social_verification: true,
      enable_auto_payout: true
    }),
    checkin: vi.fn().mockResolvedValue({
      geo_verified: true,
      checkin_id: 1
    }),
    verifySocialPost: vi.fn().mockResolvedValue({
      verified: true,
      status: 'success',
      auto_payout_triggered: true
    })
  }
}));

describe('Check-in Components', () => {
  it('CheckinFlow renders loading state initially', async () => {
    const mockProps = {
      dealId: 1,
      athleteId: 123,
      onCheckinComplete: vi.fn(),
      onCheckinError: vi.fn()
    };
    render(<CheckinFlow {...mockProps} />);
    expect(screen.getByText(/loading check-in features/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText(/loading check-in features/i)).not.toBeInTheDocument());
  });

  it('CheckinButton calls onCheckinSuccess when check-in is successful', async () => {
    const onCheckinSuccess = vi.fn();
    render(
      <CheckinButton dealId={1} athleteId={123} onCheckinSuccess={onCheckinSuccess} />
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    await waitFor(() => expect(onCheckinSuccess).toHaveBeenCalled());
  });

  it('SocialVerification shows error if no URL is entered', async () => {
    const onVerificationError = vi.fn();
    render(
      <SocialVerification checkinId={1} onVerificationError={onVerificationError} />
    );
    const verifyButton = screen.getByRole('button');
    fireEvent.click(verifyButton);
    await waitFor(() => expect(screen.getByText(/please enter a social media url/i)).toBeInTheDocument());
  });
});
