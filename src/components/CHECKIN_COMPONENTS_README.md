# Check-in Service Frontend Components

This directory contains the frontend components for the NIL check-in service, which enables athletes to check in at deal hotspots and complete social verification to trigger payouts.

## Components Overview

### CheckinFlow
The main component that orchestrates the complete check-in process from geo-location check-in to social verification.

**Usage:**
```jsx
import CheckinFlow from './components/CheckinFlow.jsx';

function DealPage({ dealId, athleteId }) {
  const handleCheckinComplete = (result) => {
    console.log('Check-in completed:', result);
    // Handle successful check-in (payout triggered)
  };

  const handleCheckinError = (error) => {
    console.log('Check-in error:', error);
    // Handle check-in errors
  };

  return (
    <CheckinFlow
      dealId={dealId}
      athleteId={athleteId}
      onCheckinComplete={handleCheckinComplete}
      onCheckinError={handleCheckinError}
    />
  );
}
```

**Props:**
- `dealId` (number): The ID of the deal being checked into
- `athleteId` (number): The ID of the athlete performing the check-in
- `onCheckinComplete` (function): Callback when check-in and verification are successful
- `onCheckinError` (function): Callback when check-in fails
- `className` (string, optional): Additional CSS classes

### CheckinButton
Standalone component for geo-location check-in. Use this when you only need the check-in step without social verification.

**Usage:**
```jsx
import CheckinButton from './components/CheckinButton.jsx';

function DealCard({ dealId, athleteId }) {
  const handleCheckinSuccess = (result) => {
    console.log('Check-in successful:', result);
    // Proceed to social verification or other steps
  };

  return (
    <CheckinButton
      dealId={dealId}
      athleteId={athleteId}
      onCheckinSuccess={handleCheckinSuccess}
      onCheckinError={(error) => console.error(error)}
    />
  );
}
```

### SocialVerification
Component for social media post verification. Use this after a successful geo-check-in.

**Usage:**
```jsx
import SocialVerification from './components/SocialVerification.jsx';

function VerificationStep({ checkinId }) {
  const handleVerificationSuccess = (result) => {
    console.log('Verification successful:', result);
    // Payout triggered
  };

  return (
    <SocialVerification
      checkinId={checkinId}
      onVerificationSuccess={handleVerificationSuccess}
      onVerificationError={(error) => console.error(error)}
    />
  );
}
```

## Service Integration

### checkinService
The service layer that handles API communication with the check-in backend.

**Key Methods:**
- `checkin(dealId, athleteId)`: Perform geo-location check-in
- `verifySocialPost(checkinId, socialUrl)`: Verify social media post
- `getGeoFences(dealId)`: Get geo-fence data for a deal
- `getFeatureFlags()`: Check if features are enabled
- `getCurrentPosition()`: Get user's current location
- `calculateDistance()`: Calculate distance between coordinates
- `formatDistance()`: Format distance for display

## Environment Variables

Add these to your `.env` file:

```env
VITE_CHECKIN_SERVICE_URL=http://localhost:8006
VITE_FEATURE_FLAG_URL=http://localhost:8004
```

## Feature Flags

The components respect feature flags from the feature flag service:

- `enable_geo_checkins`: Enable/disable geo-location check-ins
- `enable_social_verification`: Enable/disable social verification step
- `enable_auto_payout`: Enable/disable automatic payout triggering

## User Flow

1. **Geo Check-in**: User clicks "Check In" button
2. **Location Verification**: Browser requests geolocation permission
3. **Distance Check**: Backend verifies user is within hotspot radius
4. **Social Verification**: User posts on social media with @nilbx tag
5. **URL Submission**: User pastes social media URL for verification
6. **Payout Trigger**: Successful verification triggers automatic payout

## Error Handling

Components handle various error scenarios:

- **Geolocation Denied**: User denied location permission
- **Outside Hotspot**: User not within required distance
- **Invalid Social URL**: Social post doesn't meet requirements
- **Network Errors**: API communication failures
- **Feature Disabled**: Check-in features temporarily disabled

## Styling

Components use Tailwind CSS classes and Framer Motion for animations. The design follows the existing NIL application theme with:

- Blue color scheme for primary actions
- Green for success states
- Red for error states
- Smooth transitions and loading states

## Testing

Run tests with:
```bash
npm test CheckinComponents.test.js
```

Tests cover:
- Component rendering
- User interactions
- API integration
- Error states
- Feature flag handling

## Integration Examples

### In ClaimDeal.jsx
```jsx
// Add to existing ClaimDeal component
import CheckinFlow from '../components/CheckinFlow.jsx';

// In the component render
{deal.requires_checkin && (
  <div className="mt-6">
    <CheckinFlow
      dealId={deal.id}
      athleteId={currentUser.id}
      onCheckinComplete={() => {
        // Update deal status, show success message
        setDealClaimed(true);
      }}
      onCheckinError={(error) => {
        // Show error message
        setError(error.message);
      }}
    />
  </div>
)}
```

### In DealCard.jsx
```jsx
// For quick check-in access
import CheckinButton from '../components/CheckinButton.jsx';

// In card actions
<CheckinButton
  dealId={deal.id}
  athleteId={user.id}
  onCheckinSuccess={(result) => {
    // Navigate to full check-in flow or show success
    navigate(`/deals/${deal.id}/checkin/${result.checkin_id}`);
  }}
  onCheckinError={(error) => {
    toast.error(`Check-in failed: ${error.message}`);
  }}
/>
```

## Browser Support

- Modern browsers with Geolocation API support
- HTTPS required for geolocation in production
- Progressive enhancement: Falls back gracefully when features unavailable

## Performance Considerations

- Geolocation requests cached for 60 seconds
- Lazy loading of check-in components
- Minimal re-renders with proper state management
- Efficient API calls with proper error boundaries