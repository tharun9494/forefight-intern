import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollManager ensures smooth, predictable scrolling across all routes:
 * 1. Resets scroll position to top (0, 0) upon route transitions without hash.
 * 2. Smoothly scrolls to target element when a hash is present (e.g. /about#contact).
 * 3. Respects user preference for reduced motion.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    if (hash) {
      const elementId = hash.replace('#', '');
      // Slight delay to allow DOM painting if navigating between routes
      const timer = setTimeout(() => {
        const targetElement = document.getElementById(elementId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: scrollBehavior });
        }
      }, 80);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant',
      });
    }
  }, [pathname, hash]);

  return null;
}
