# Contract System Quick Start Guide
**Date:** October 26, 2025

## 🚀 Quick Start

### 1. Use Traditional Contract Modal

```jsx
import CreateDealModal from './components/Contracts/CreateDealModal';

function SponsorButton({ athlete }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Sponsor @{athlete.username}
      </button>

      {showModal && (
        <CreateDealModal
          targetUser={athlete}
          onClose={() => setShowModal(false)}
          onSuccess={(deal) => alert(`Deal #${deal.id} created!`)}
        />
      )}
    </>
  );
}
```

### 2. Use Web3 Contract Modal (Premium)

```jsx
import CreateDealWeb3Modal from './components/Contracts/CreateDealWeb3Modal';
import { useFeatureFlags } from './hooks/useFeatureFlags';

function Web3SponsorButton({ athlete }) {
  const { isEnabled } = useFeatureFlags();

  // Only show if Web3 is enabled
  if (!isEnabled('enable_web3_sponsorship')) {
    return null;
  }

  return (
    <CreateDealWeb3Modal
      targetUser={athlete}
      onClose={() => setShowWeb3Modal(false)}
    />
  );
}
```

### 3. Accept Deals (Athlete/Influencer)

```jsx
import DealAcceptanceCard from './components/Contracts/DealAcceptanceCard';

function MyPendingDeals({ deals }) {
  const handleAccept = async (dealId) => {
    await fetch(`/api/v1/deals/${dealId}/accept`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        athlete_id: user.id,
        accept_terms: true
      })
    });
  };

  return deals.map(deal => (
    <DealAcceptanceCard
      deal={deal}
      onAccept={handleAccept}
      onReject={handleReject}
    />
  ));
}
```

## 🔧 Custom Hooks

### Calculate Payouts

```javascript
import { usePaymentCalculation } from './hooks/usePaymentCalculation';

const { payout, platformFee, loading } = usePaymentCalculation({
  amount: 1000,
  userId: athlete.id,
  tierMultiplier: athlete.tier_multiplier
});

// payout: $3,883.70
// platformFee: $200
```

### Check Feature Flags

```javascript
import { useFeatureFlags } from './hooks/useFeatureFlags';

const { flags, isEnabled } = useFeatureFlags();

if (isEnabled('enable_web3_sponsorship')) {
  // Show Web3 option
}
```

## 📍 Routes

- `/deals` - View and manage deals (athletes/influencers)
- `/create-deal` - Create new deal (sponsors)
- `/marketplace` - Browse athletes/influencers

## 🎨 Components Reference

| Component | Purpose | When to Use |
|-----------|---------|-------------|
| `CreateDealModal` | Traditional contracts | Default for all sponsors |
| `CreateDealWeb3Modal` | Web3 contracts | Only if flag enabled |
| `DealAcceptanceCard` | Accept/reject deals | Athlete/influencer dashboard |
| `UserProfileCard` | Profile with sponsor button | Marketplace listing |
| `PayoutBreakdown` | Show payout calculation | Inside deal modals |
| `NCAAComplianceWarning` | NCAA warning | Athletes only |
| `InstantPayoutBadge` | Quick payout badge | Influencers only |

## 🔐 Feature Flags

**Important:** Web3 features are **disabled by default** and controlled by `enable_web3_sponsorship` flag.

To enable Web3 in production:
1. Set flag in backend: `UPDATE feature_flags SET enabled = true WHERE key = 'enable_web3_sponsorship'`
2. Frontend picks up automatically (5-min cache)

## 🐛 Common Issues

**Issue:** Web3 modal doesn't show
- **Fix:** Check `enable_web3_sponsorship` flag is `true`

**Issue:** Payout calculation shows $0
- **Fix:** Ensure `amount > 0` and `tierMultiplier > 0`

**Issue:** "Feature flags not loading"
- **Fix:** Feature flag service must be running on port 8004

## 📚 Full Documentation

See [FRONTEND_CONTRACT_IMPLEMENTATION_2025-10-26.md](../FRONTEND_CONTRACT_IMPLEMENTATION_2025-10-26.md) for complete details.
