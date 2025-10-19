export const useScreenSize = vi.fn().mockReturnValue({
  isMobile: false,
  isTablet: false,
  isDesktop: true
});

export const useTouchGestures = vi.fn();

export const MobileDrawer = ({ children, isOpen }) => (
  isOpen ? <div data-testid="mobile-drawer">{children}</div> : null
);