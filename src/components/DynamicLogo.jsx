import React from 'react';
import { getSchoolColor, DEFAULT_LOGO_COLOR } from '../config/schoolColors';

/**
 * DynamicLogo Component
 * Renders the NILBˣ logo with dynamic superscript 'x' color based on school affiliation
 *
 * Trademark Specification:
 * Mark: N I L Bˣ
 * - "NILB": Bold, uppercase, sans-serif with increased letter spacing
 * - "x": Superscript, 70% scale, aligned with cap height
 * - Letter spacing: +50 units
 * - No space between "B" and "ˣ"
 */

const DynamicLogo = ({
  schoolKey,
  size = 'md',
  variant = 'full', // 'full', 'icon', 'text'
  showBox = true,
  className = '',
  useSecondaryColor = false
}) => {
  // Get dynamic color for superscript 'x'
  const xColor = getSchoolColor(schoolKey, useSecondaryColor);

  // Size variants
  const sizeClasses = {
    xs: {
      box: 'w-6 h-6',
      boxText: 'text-xs',
      brandText: 'text-sm',
      superscript: 'text-[0.5rem]'
    },
    sm: {
      box: 'w-8 h-8',
      boxText: 'text-xs',
      brandText: 'text-lg',
      superscript: 'text-[0.6rem]'
    },
    md: {
      box: 'w-10 h-10',
      boxText: 'text-sm',
      brandText: 'text-2xl',
      superscript: 'text-sm'
    },
    lg: {
      box: 'w-16 h-16',
      boxText: 'text-2xl',
      brandText: 'text-4xl',
      superscript: 'text-xl'
    },
    xl: {
      box: 'w-24 h-24',
      boxText: 'text-4xl',
      brandText: 'text-6xl',
      superscript: 'text-3xl'
    },
    hero: {
      box: 'w-32 h-32',
      boxText: 'text-5xl',
      brandText: 'text-7xl sm:text-8xl',
      superscript: 'text-4xl sm:text-5xl'
    }
  };

  const sizes = sizeClasses[size] || sizeClasses.md;

  // Icon only (NIL in box)
  if (variant === 'icon') {
    return (
      <div className={`${sizes.box} bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md ${className}`}>
        <span className={`${sizes.boxText} text-white font-black tracking-wider`}>
          NIL
        </span>
      </div>
    );
  }

  // Text only (NILBˣ)
  if (variant === 'text') {
    return (
      <span className={`font-black tracking-wide ${className}`}>
        <span className={`${sizes.brandText} text-blue-600`}>
          NILB
        </span>
        <span
          className={`${sizes.superscript} font-medium relative -left-0.5`}
          style={{
            color: xColor,
            verticalAlign: 'super',
            fontSize: '0.7em',
            lineHeight: 0
          }}
        >
          x
        </span>
      </span>
    );
  }

  // Full logo (icon + text)
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showBox && (
        <div className={`${sizes.box} bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md`}>
          <span className={`${sizes.boxText} text-white font-black tracking-wider`}>
            NIL
          </span>
        </div>
      )}
      <span className="font-black tracking-wide">
        <span className={`${sizes.brandText} text-blue-600`}>
          NILB
        </span>
        <span
          className={`${sizes.superscript} font-medium relative -left-0.5`}
          style={{
            color: xColor,
            verticalAlign: 'super',
            fontSize: '0.7em',
            lineHeight: 0
          }}
        >
          x
        </span>
      </span>
    </div>
  );
};

/**
 * Gradient variant for landing pages with text gradient effect
 */
export const GradientLogo = ({
  schoolKey,
  size = 'hero',
  className = '',
  useSecondaryColor = false
}) => {
  const xColor = getSchoolColor(schoolKey, useSecondaryColor);

  const sizeClasses = {
    lg: 'text-5xl sm:text-6xl',
    xl: 'text-6xl sm:text-7xl',
    hero: 'text-7xl sm:text-8xl md:text-9xl'
  };

  const textSize = sizeClasses[size] || sizeClasses.hero;

  return (
    <h1 className={`font-black tracking-tight ${className}`}>
      <span className={`${textSize} bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 bg-clip-text text-transparent`}>
        NILB
      </span>
      <span
        className={`${textSize} font-medium relative -left-1`}
        style={{
          color: xColor,
          verticalAlign: 'super',
          fontSize: '0.7em',
          lineHeight: 0,
          textShadow: `0 0 30px ${xColor}40`
        }}
      >
        x
      </span>
    </h1>
  );
};

/**
 * Glass variant for hero sections with glassmorphism effect
 */
export const GlassLogo = ({
  schoolKey,
  className = '',
  useSecondaryColor = false
}) => {
  const xColor = getSchoolColor(schoolKey, useSecondaryColor);

  return (
    <div className={`w-32 h-32 glass rounded-full flex items-center justify-center shadow-glow ${className}`}>
      <span className="font-black tracking-wider">
        <span className="text-5xl text-blue-400 drop-shadow-2xl">
          NIL
        </span>
        <span
          className="text-3xl font-medium relative -left-1"
          style={{
            color: xColor,
            verticalAlign: 'super',
            fontSize: '0.7em',
            lineHeight: 0,
            filter: `drop-shadow(0 0 20px ${xColor})`
          }}
        >
          x
        </span>
      </span>
    </div>
  );
};

/**
 * Simple text logo for footer and compact spaces
 */
export const TextLogo = ({
  schoolKey,
  size = 'md',
  lightMode = false,
  className = '',
  useSecondaryColor = false
}) => {
  const xColor = getSchoolColor(schoolKey, useSecondaryColor);

  const sizeClasses = {
    sm: { main: 'text-lg', super: 'text-xs' },
    md: { main: 'text-2xl', super: 'text-sm' },
    lg: { main: 'text-4xl', super: 'text-xl' }
  };

  const sizes = sizeClasses[size] || sizeClasses.md;
  const textColor = lightMode ? 'text-white' : 'text-blue-600';

  return (
    <span className={`font-black tracking-wide ${className}`}>
      <span className={`${sizes.main} ${textColor}`}>
        NILB
      </span>
      <span
        className={`${sizes.super} font-medium relative -left-0.5`}
        style={{
          color: xColor,
          verticalAlign: 'super',
          fontSize: '0.7em',
          lineHeight: 0
        }}
      >
        x
      </span>
    </span>
  );
};

export default DynamicLogo;
