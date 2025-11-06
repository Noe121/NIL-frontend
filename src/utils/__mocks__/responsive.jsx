// eslint-disable-next-line no-console
console.log('MOCKED responsive.jsx (from __mocks__)');

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export const useScreenSize = vi.fn().mockReturnValue({
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  width: 1200,
  height: 800,
  breakpoint: 'desktop',
  isPortrait: false,
  isLandscape: true,
  orientation: 'landscape'
});

export const useBreakpoint = vi.fn();
export const getResponsiveStyles = vi.fn();
export const useTouchGestures = vi.fn();

export const MobileDrawer = ({ children, isOpen, onClose, position = 'left', className = '', backdropClassName = '' }) => (
  isOpen ? (
    <>
      <div
        data-testid="mobile-drawer-backdrop"
        className={`mock-backdrop ${backdropClassName}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        data-testid="mobile-drawer"
        className={`mock-drawer ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </>
  ) : null
);