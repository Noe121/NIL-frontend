import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext.jsx';
import { useScreenSize } from '../utils/responsive.jsx';
import { getAccessibilityProps } from '../utils/accessibility.jsx';
import Button from './Button.jsx';
import Tooltip from './Tooltip.jsx';
import Dropdown, { DropdownItem } from './Dropdown.jsx';

const SocialShare = ({
  url = window.location.href,
  title = 'Check out my NIL deal on NILbx!',
  description = 'Discover amazing NIL opportunities for student athletes.',
  image,
  hashtags = ['NIL', 'NILbx', 'StudentAthlete'],
  showCopyLink = true,
  showQRCode = false,
  className = '',
  size = 'medium',
  variant = 'default', // 'default', 'minimal', 'buttons'
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);
  const { recordShare } = useGamification();
  const { isMobile } = useScreenSize();

  // Social platform configurations
  const platforms = {
    twitter: {
      name: 'Twitter',
      icon: '🐦',
      color: 'bg-blue-500',
      getUrl: () => {
        const text = `${title} ${hashtags.map(tag => `#${tag}`).join(' ')}`;
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
      }
    },
    facebook: {
      name: 'Facebook',
      icon: '📘',
      color: 'bg-blue-600',
      getUrl: () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    instagram: {
      name: 'Instagram',
      icon: '📷',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      getUrl: () => {
        // Instagram doesn't have a direct share URL, so we copy the content
        return null;
      }
    },
    linkedin: {
      name: 'LinkedIn',
      icon: '💼',
      color: 'bg-blue-700',
      getUrl: () => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    tiktok: {
      name: 'TikTok',
      icon: '🎵',
      color: 'bg-black',
      getUrl: () => {
        // TikTok doesn't have a direct share URL
        return null;
      }
    },
    snapchat: {
      name: 'Snapchat',
      icon: '👻',
      color: 'bg-yellow-400',
      getUrl: () => `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: '💬',
      color: 'bg-green-500',
      getUrl: () => `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`
    },
    telegram: {
      name: 'Telegram',
      icon: '✈️',
      color: 'bg-blue-500',
      getUrl: () => `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    reddit: {
      name: 'Reddit',
      icon: '🤖',
      color: 'bg-orange-500',
      getUrl: () => `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    },
    pinterest: {
      name: 'Pinterest',
      icon: '📌',
      color: 'bg-red-600',
      getUrl: () => `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(description)}${image ? `&media=${encodeURIComponent(image)}` : ''}`
    }
  };

  // Handle sharing to platform
  const handleShare = async (platformKey) => {
    const platform = platforms[platformKey];
    if (!platform) return;

    try {
      // Check if Web Share API is available (mobile)
      if (navigator.share && isMobile && platformKey === 'native') {
        await navigator.share({
          title,
          text: description,
          url
        });
      } else {
        const shareUrl = platform.getUrl();
        
        if (shareUrl) {
          // Open in new window
          const width = 600;
          const height = 400;
          const left = (window.innerWidth - width) / 2;
          const top = (window.innerHeight - height) / 2;
          
          window.open(
            shareUrl,
            `share-${platformKey}`,
            `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
          );
        } else {
          // Copy to clipboard for platforms without direct sharing
          await copyToClipboard(`${title} ${url}`);
          alert(`Content copied to clipboard! Paste it in ${platform.name}.`);
        }
      }

      // Record share for gamification
      recordShare();
      setShareCount(prev => prev + 1);

    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async (text = url) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    }
  };

  // Generate QR Code (placeholder - would need QR library)
  const generateQRCode = () => {
    // This would typically use a QR code library like qrcode.js
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
    return qrUrl;
  };

  // Render based on variant
  const renderMinimal = () => (
    <Dropdown
      trigger={
        <Button
          variant="ghost"
          size={size}
          icon="📤"
          className="text-gray-600 hover:text-blue-600"
          {...getAccessibilityProps({ ariaLabel: 'Share' })}
        >
          {!isMobile && 'Share'}
        </Button>
      }
      className={className}
    >
      {Object.entries(platforms).map(([key, platform]) => (
        <DropdownItem
          key={key}
          icon={platform.icon}
          onClick={() => handleShare(key)}
        >
          Share on {platform.name}
        </DropdownItem>
      ))}
      
      {showCopyLink && (
        <>
          <DropdownItem
            icon="🔗"
            onClick={() => copyToClipboard()}
          >
            {copied ? 'Copied!' : 'Copy Link'}
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );

  const renderButtons = () => (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {Object.entries(platforms).slice(0, isMobile ? 4 : 6).map(([key, platform]) => (
        <Tooltip key={key} content={`Share on ${platform.name}`}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleShare(key)}
            className={`
              w-10 h-10 rounded-full text-white text-lg flex items-center justify-center
              transition-all duration-200 hover:shadow-lg
              ${platform.color}
            `}
            {...getAccessibilityProps({ ariaLabel: `Share on ${platform.name}` })}
          >
            {platform.icon}
          </motion.button>
        </Tooltip>
      ))}
      
      {showCopyLink && (
        <Tooltip content={copied ? 'Copied!' : 'Copy link'}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => copyToClipboard()}
            className="w-10 h-10 rounded-full bg-gray-600 text-white text-lg flex items-center justify-center transition-all duration-200 hover:shadow-lg"
            {...getAccessibilityProps({ ariaLabel: 'Copy link' })}
          >
            {copied ? '✅' : '🔗'}
          </motion.button>
        </Tooltip>
      )}
    </div>
  );

  const renderDefault = () => (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Share this</h3>
        {shareCount > 0 && (
          <span className="text-sm text-gray-500">{shareCount} shares</span>
        )}
      </div>

      {/* Primary platforms */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {Object.entries(platforms).slice(0, 4).map(([key, platform]) => (
          <motion.button
            key={key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleShare(key)}
            className={`
              p-3 rounded-lg text-white font-medium text-sm
              transition-all duration-200 hover:shadow-lg
              flex items-center justify-center space-x-2
              ${platform.color}
            `}
            {...getAccessibilityProps({ ariaLabel: `Share on ${platform.name}` })}
          >
            <span className="text-lg">{platform.icon}</span>
            <span className="hidden sm:inline">{platform.name}</span>
          </motion.button>
        ))}
      </div>

      {/* More platforms dropdown */}
      {Object.keys(platforms).length > 4 && (
        <div className="mb-4">
          <Dropdown
            trigger={
              <Button variant="outline" fullWidth icon="➕">
                More platforms
              </Button>
            }
          >
            {Object.entries(platforms).slice(4).map(([key, platform]) => (
              <DropdownItem
                key={key}
                icon={platform.icon}
                onClick={() => handleShare(key)}
              >
                Share on {platform.name}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      )}

      {/* Copy link section */}
      {showCopyLink && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={url}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <Button
              variant={copied ? 'primary' : 'outline'}
              size="small"
              onClick={() => copyToClipboard()}
              icon={copied ? '✅' : '📋'}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      )}

      {/* QR Code */}
      {showQRCode && (
        <div className="mt-4 pt-4 border-t text-center">
          <p className="text-sm text-gray-600 mb-2">Scan QR Code</p>
          <img
            src={generateQRCode()}
            alt="QR Code"
            className="mx-auto w-32 h-32 border rounded-lg"
          />
        </div>
      )}
    </div>
  );

  // Render based on variant
  switch (variant) {
    case 'minimal':
      return renderMinimal();
    case 'buttons':
      return renderButtons();
    default:
      return renderDefault();
  }
};

export default SocialShare;