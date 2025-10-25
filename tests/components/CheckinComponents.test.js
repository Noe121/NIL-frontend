import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CheckinFlow from '../../src/components/CheckinFlow.jsx';
import CheckinButton from '../../src/components/CheckinButton.jsx';
import SocialVerification from '../../src/components/SocialVerification.jsx';
import { checkinService } from '../../src/services/checkinService.js';

// Mock the checkin service
jest.mock('../services/checkinService.js');

describe('Check-in Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CheckinFlow', () => {
    const mockProps = {
      dealId: 1,
      athleteId: 123,
      onCheckinComplete: jest.fn(),
      onCheckinError: jest.fn()
    };

    it('renders loading state initially', () => {
      checkinService.getFeatureFlags.mockResolvedValue({
        enable_geo_checkins: true,
        enable_social_verification: true,
        enable_auto_payout: true
      });

      render(<CheckinFlow {...mockProps} />);
      expect(screen.getByText('Loading check-in features...')).toBeInTheDocument();
    });

    it('renders check-in step when features are loaded', async () => {
      checkinService.getFeatureFlags.mockResolvedValue({
        enable_geo_checkins: true,
        enable_social_verification: true,
        enable_auto_payout: true
      });

      render(<CheckinFlow {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('📍 Check In at Hotspot')).toBeInTheDocument();
      });
    });

    it('shows disabled state when geo check-ins are disabled', async () => {
      checkinService.getFeatureFlags.mockResolvedValue({
        enable_geo_checkins: false,
        enable_social_verification: true,
        enable_auto_payout: true
      });

      render(<CheckinFlow {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('Check-in features are currently disabled.')).toBeInTheDocument();
      });
    });

    it('transitions to social verification after successful check-in', async () => {
      checkinService.getFeatureFlags.mockResolvedValue({
        enable_geo_checkins: true,
        enable_social_verification: true,
        enable_auto_payout: true
      });

      const mockCheckinResult = {
        checkin_id: 456,
        status: 'pending_social_verification',
        distance: 45
      };

      checkinService.checkin.mockResolvedValue(mockCheckinResult);

      render(<CheckinFlow {...mockProps} />);

      await waitFor(() => {
        expect(screen.getByText('📍 Check In at Hotspot')).toBeInTheDocument();
      });

      // Mock geolocation
      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          success({
            coords: { latitude: 40.7128, longitude: -74.0060 }
          })
        )
      };
      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true
      });

      const checkinButton = screen.getByRole('button', { name: /check in/i });
      fireEvent.click(checkinButton);

      await waitFor(() => {
        expect(screen.getByText('📱 Complete Social Verification')).toBeInTheDocument();
      });
    });
  });

  describe('CheckinButton', () => {
    const mockProps = {
      dealId: 1,
      athleteId: 123,
      onCheckinSuccess: jest.fn(),
      onCheckinError: jest.fn(),
      featureFlags: {
        enable_geo_checkins: true,
        enable_social_verification: true,
        enable_auto_payout: true
      }
    };

    it('renders check-in button', () => {
      render(<CheckinButton {...mockProps} />);
      expect(screen.getByRole('button', { name: /check in/i })).toBeInTheDocument();
    });

    it('shows loading state during check-in', async () => {
      checkinService.checkin.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<CheckinButton {...mockProps} />);

      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          success({
            coords: { latitude: 40.7128, longitude: -74.0060 }
          })
        )
      };
      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true
      });

      const checkinButton = screen.getByRole('button', { name: /check in/i });
      fireEvent.click(checkinButton);

      await waitFor(() => {
        expect(screen.getByText('Checking in...')).toBeInTheDocument();
      });
    });

    it('calls onCheckinSuccess on successful check-in', async () => {
      const mockCheckinResult = {
        checkin_id: 456,
        status: 'pending_social_verification',
        distance: 45
      };

      checkinService.checkin.mockResolvedValue(mockCheckinResult);

      render(<CheckinButton {...mockProps} />);

      const mockGeolocation = {
        getCurrentPosition: jest.fn().mockImplementation((success) =>
          success({
            coords: { latitude: 40.7128, longitude: -74.0060 }
          })
        )
      };
      Object.defineProperty(navigator, 'geolocation', {
        value: mockGeolocation,
        writable: true
      });

      const checkinButton = screen.getByRole('button', { name: /check in/i });
      fireEvent.click(checkinButton);

      await waitFor(() => {
        expect(mockProps.onCheckinSuccess).toHaveBeenCalledWith(mockCheckinResult);
      });
    });

    it('shows error when geolocation is not supported', async () => {
      Object.defineProperty(navigator, 'geolocation', {
        value: undefined,
        writable: true
      });

      render(<CheckinButton {...mockProps} />);

      const checkinButton = screen.getByRole('button', { name: /check in/i });
      fireEvent.click(checkinButton);

      await waitFor(() => {
        expect(mockProps.onCheckinError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Geolocation is not supported by this browser'
          })
        );
      });
    });
  });

  describe('SocialVerification', () => {
    const mockProps = {
      checkinId: 456,
      onVerificationSuccess: jest.fn(),
      onVerificationError: jest.fn()
    };

    it('renders social verification form', () => {
      render(<SocialVerification {...mockProps} />);
      expect(screen.getByText('📱 Complete Your Check-in')).toBeInTheDocument();
      expect(screen.getByLabelText('Social Media Post URL')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /verify social post/i })).toBeInTheDocument();
    });

    it('shows error when URL is empty', async () => {
      render(<SocialVerification {...mockProps} />);

      const verifyButton = screen.getByRole('button', { name: /verify social post/i });
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(screen.getByText('Please enter a social media URL')).toBeInTheDocument();
      });
    });

    it('calls onVerificationSuccess on successful verification', async () => {
      const mockVerificationResult = {
        verified: true,
        status: 'verified',
        auto_payout_triggered: true
      };

      checkinService.verifySocialPost.mockResolvedValue(mockVerificationResult);

      render(<SocialVerification {...mockProps} />);

      const urlInput = screen.getByLabelText('Social Media Post URL');
      fireEvent.change(urlInput, {
        target: { value: 'https://twitter.com/user/status/123' }
      });

      const verifyButton = screen.getByRole('button', { name: /verify social post/i });
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockProps.onVerificationSuccess).toHaveBeenCalledWith(mockVerificationResult);
      });
    });

    it('shows success state after verification', async () => {
      const mockVerificationResult = {
        verified: true,
        status: 'verified',
        auto_payout_triggered: true
      };

      checkinService.verifySocialPost.mockResolvedValue(mockVerificationResult);

      render(<SocialVerification {...mockProps} />);

      const urlInput = screen.getByLabelText('Social Media Post URL');
      fireEvent.change(urlInput, {
        target: { value: 'https://twitter.com/user/status/123' }
      });

      const verifyButton = screen.getByRole('button', { name: /verify social post/i });
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(screen.getByText('Verification Complete!')).toBeInTheDocument();
      });
    });

    it('calls onVerificationError on verification failure', async () => {
      const mockError = new Error('Social verification failed');
      checkinService.verifySocialPost.mockRejectedValue(mockError);

      render(<SocialVerification {...mockProps} />);

      const urlInput = screen.getByLabelText('Social Media Post URL');
      fireEvent.change(urlInput, {
        target: { value: 'https://invalid-url.com' }
      });

      const verifyButton = screen.getByRole('button', { name: /verify social post/i });
      fireEvent.click(verifyButton);

      await waitFor(() => {
        expect(mockProps.onVerificationError).toHaveBeenCalledWith(mockError);
      });
    });
  });
});