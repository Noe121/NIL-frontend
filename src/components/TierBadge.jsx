import React from 'react';

const TierBadge = ({ tier, followerCount, showFollowers = true }) => {
  const getTierColor = (tierName) => {
    const tierColors = {
      starter: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-800', icon: '⭐' },
      standard: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-800', icon: '✨' },
      professional: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800', icon: '🔥' },
      elite: { bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-800', icon: '💎' },
      mega: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', icon: '👑' }
    };
    return tierColors[tierName] || tierColors.starter;
  };

  const getTierLabel = (tierName) => {
    const labels = {
      starter: 'Starter',
      standard: 'Standard',
      professional: 'Professional',
      elite: 'Elite',
      mega: 'Mega'
    };
    return labels[tierName] || 'Starter';
  };

  const tierStyle = getTierColor(tier);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${tierStyle.bg} ${tierStyle.border} ${tierStyle.text} text-sm font-semibold`}>
      <span>{tierStyle.icon}</span>
      <span>{getTierLabel(tier)}</span>
      {showFollowers && followerCount && (
        <span className="ml-1 text-xs opacity-75">
          {followerCount.toLocaleString()} followers
        </span>
      )}
    </div>
  );
};

export default TierBadge;
