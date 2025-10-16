import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button.jsx';

const Card = ({
  children,
  variant = 'default',
  hover = true,
  padding = 'normal',
  className = '',
  onClick,
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-lg border-0',
    outlined: 'bg-white border-2 border-gray-300',
    filled: 'bg-gray-50 border border-gray-200',
    gradient: 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
  };

  const paddings = {
    none: 'p-0',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };

  const hoverStyles = hover ? 'hover:shadow-md transition-shadow duration-200' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  const cardVariants = {
    hover: { y: hover ? -2 : 0, scale: hover ? 1.02 : 1 },
    tap: { scale: onClick ? 0.98 : 1 }
  };

  const cardClasses = `
    rounded-lg ${variants[variant]} ${paddings[padding]} 
    ${hoverStyles} ${clickableStyles} ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <motion.div
      className={cardClasses}
      onClick={onClick}
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Card Header
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

// Card Title
Card.Title = ({ children, level = 2, className = '', ...props }) => {
  const Component = `h${level}`;
  const levelStyles = {
    1: 'text-2xl font-bold text-gray-900',
    2: 'text-xl font-semibold text-gray-900',
    3: 'text-lg font-medium text-gray-900',
    4: 'text-base font-medium text-gray-900'
  };

  return (
    <Component className={`${levelStyles[level]} ${className}`} {...props}>
      {children}
    </Component>
  );
};

// Card Subtitle
Card.Subtitle = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);

// Card Content
Card.Content = ({ children, className = '', ...props }) => (
  <div className={`text-gray-700 ${className}`} {...props}>
    {children}
  </div>
);

// Card Footer
Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`mt-4 pt-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

// Card Actions
Card.Actions = ({ children, align = 'right', className = '', ...props }) => {
  const alignStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={`flex ${alignStyles[align]} space-x-2 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Profile Card Component
Card.Profile = ({ 
  user, 
  showActions = true, 
  compact = false,
  className = '',
  onView,
  onMessage,
  onConnect,
  ...props 
}) => {
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'athlete': return '🏃‍♂️';
      case 'sponsor': return '🏢';
      case 'fan': return '⭐';
      default: return '👤';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'athlete': return 'bg-blue-100 text-blue-800';
      case 'sponsor': return 'bg-green-100 text-green-800';
      case 'fan': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      variant="elevated" 
      className={`${compact ? 'max-w-sm' : 'max-w-md'} ${className}`} 
      {...props}
    >
      <div className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={`${user.name}'s avatar`}
              className={`rounded-full object-cover ${
                compact ? 'w-12 h-12' : 'w-16 h-16'
              }`}
            />
          ) : (
            <div className={`
              rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium
              ${compact ? 'w-12 h-12 text-sm' : 'w-16 h-16 text-lg'}
            `}>
              {getInitials(user?.name)}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold text-gray-900 truncate ${
              compact ? 'text-sm' : 'text-base'
            }`}>
              {user?.name || 'Unknown User'}
            </h3>
            
            {user?.verified && (
              <svg
                className="w-4 h-4 text-blue-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-label="Verified"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

          {user?.role && (
            <div className="flex items-center space-x-2 mt-1">
              <span className={`
                inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                ${getRoleBadgeColor(user.role)}
              `}>
                <span className="mr-1" role="img" aria-hidden="true">
                  {getRoleIcon(user.role)}
                </span>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          )}

          {user?.title && (
            <p className={`text-gray-600 truncate ${
              compact ? 'text-xs mt-1' : 'text-sm mt-1'
            }`}>
              {user.title}
            </p>
          )}

          {user?.location && (
            <p className={`text-gray-500 truncate ${
              compact ? 'text-xs' : 'text-sm'
            }`}>
              📍 {user.location}
            </p>
          )}

          {/* Stats */}
          {!compact && user?.stats && (
            <div className="flex space-x-4 mt-2">
              {user.stats.followers && (
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.stats.followers.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Followers</p>
                </div>
              )}
              {user.stats.deals && (
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.stats.deals}
                  </p>
                  <p className="text-xs text-gray-500">Deals</p>
                </div>
              )}
              {user.stats.rating && (
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {user.stats.rating}/5
                  </p>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <Card.Footer className="mt-4 pt-4">
          <Card.Actions align="center">
            {onView && (
              <Button
                variant="outline"
                size="small"
                onClick={() => onView(user)}
              >
                View Profile
              </Button>
            )}
            {onMessage && (
              <Button
                variant="primary"
                size="small"
                icon="💬"
                onClick={() => onMessage(user)}
              >
                Message
              </Button>
            )}
            {onConnect && (
              <Button
                variant="secondary"
                size="small"
                icon="🤝"
                onClick={() => onConnect(user)}
              >
                Connect
              </Button>
            )}
          </Card.Actions>
        </Card.Footer>
      )}
    </Card>
  );
};

// Deal Card Component
Card.Deal = ({ 
  deal, 
  showActions = true,
  className = '',
  onView,
  onApply,
  onBookmark,
  ...props 
}) => {
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}K`;
    } else {
      return `$${price}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card variant="elevated" className={`max-w-sm ${className}`} {...props}>
      {/* Deal Image */}
      {deal?.image && (
        <div className="relative -m-6 mb-4">
          <img
            src={deal.image}
            alt={deal.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {deal.featured && (
            <div className="absolute top-2 left-2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded-full">
                ⭐ Featured
              </span>
            </div>
          )}
          {deal.status && (
            <div className="absolute top-2 right-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(deal.status)}`}>
                {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Deal Content */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Card.Title level={3} className="text-lg">
              {deal?.title || 'Untitled Deal'}
            </Card.Title>
            
            {deal?.company && (
              <Card.Subtitle className="mt-1">
                {deal.company}
              </Card.Subtitle>
            )}
          </div>
          
          {deal?.price && (
            <div className="ml-4">
              <span className="text-lg font-bold text-green-600">
                {formatPrice(deal.price)}
              </span>
              {deal.priceType && (
                <span className="text-sm text-gray-500 block text-right">
                  {deal.priceType}
                </span>
              )}
            </div>
          )}
        </div>

        {deal?.description && (
          <Card.Content className="mt-3">
            <p className="text-sm line-clamp-3">
              {deal.description}
            </p>
          </Card.Content>
        )}

        {/* Deal Details */}
        <div className="mt-4 space-y-2">
          {deal?.duration && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">⏱️</span>
              <span>Duration: {deal.duration}</span>
            </div>
          )}
          
          {deal?.location && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">📍</span>
              <span>{deal.location}</span>
            </div>
          )}
          
          {deal?.requirements && deal.requirements.length > 0 && (
            <div className="flex items-start text-sm text-gray-600">
              <span className="mr-2 mt-0.5">📋</span>
              <div>
                <span className="font-medium">Requirements:</span>
                <ul className="mt-1 list-disc list-inside text-xs">
                  {deal.requirements.slice(0, 2).map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                  {deal.requirements.length > 2 && (
                    <li>+{deal.requirements.length - 2} more</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {deal?.tags && deal.tags.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {deal.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {tag}
                </span>
              ))}
              {deal.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{deal.tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        {deal?.deadline && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Application deadline: {new Date(deal.deadline).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <Card.Footer className="mt-4 pt-4">
          <Card.Actions align="between">
            <div>
              {onBookmark && (
                <Button
                  variant="ghost"
                  size="small"
                  icon="🔖"
                  onClick={() => onBookmark(deal)}
                  tooltip="Bookmark this deal"
                />
              )}
            </div>
            
            <div className="flex space-x-2">
              {onView && (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => onView(deal)}
                >
                  View Details
                </Button>
              )}
              {onApply && deal?.status === 'active' && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => onApply(deal)}
                >
                  Apply Now
                </Button>
              )}
            </div>
          </Card.Actions>
        </Card.Footer>
      )}
    </Card>
  );
};

export default Card;