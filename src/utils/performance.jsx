// Performance optimization utilities and components

import React, { Suspense, lazy, memo, useMemo, useCallback } from 'react';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

// Lazy loading utilities
export const createLazyComponent = (importFn, fallback = <LoadingSpinner />) => {
  const LazyComponent = lazy(importFn);
  
  return memo((props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  ));
};

// Route-based code splitting helper
export const createLazyRoute = (importFn) => {
  return createLazyComponent(
    importFn,
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="large" />
    </div>
  );
};

// Component memoization helpers
export const createMemoComponent = (Component, areEqual) => {
  return memo(Component, areEqual);
};

// Optimized image component with lazy loading and WebP support
export const OptimizedImage = memo(({
  src,
  alt,
  width,
  height,
  className = '',
  placeholder = 'blur',
  quality = 75,
  loading = 'lazy',
  sizes,
  priority = false,
  onLoad,
  onError,
  fallback,
  ...props
}) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState('');
  
  // Generate WebP and fallback sources
  const generateSources = useCallback((originalSrc) => {
    if (!originalSrc) return { webp: '', fallback: originalSrc };
    
    // Simple WebP conversion (in real app, this would be handled by a service)
    const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    return {
      webp: webpSrc,
      fallback: originalSrc
    };
  }, []);

  const { webp, fallback: fallbackSrc } = useMemo(
    () => generateSources(src),
    [src, generateSources]
  );

  // Placeholder while loading
  const PlaceholderComponent = useMemo(() => {
    if (placeholder === 'blur') {
      return (
        <div 
          className={`bg-gray-200 animate-pulse ${className}`}
          style={{ width, height }}
          aria-hidden="true"
        />
      );
    }
    
    if (placeholder === 'skeleton') {
      return (
        <div 
          className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${className}`}
          style={{ width, height }}
          aria-hidden="true"
        >
          <div className="animate-shimmer bg-gradient-to-r from-transparent via-white to-transparent" />
        </div>
      );
    }
    
    return null;
  }, [placeholder, className, width, height]);

  const handleLoad = useCallback((e) => {
    setImageLoaded(true);
    onLoad?.(e);
  }, [onLoad]);

  const handleError = useCallback((e) => {
    setImageError(true);
    setImageSrc(fallbackSrc);
    onError?.(e);
  }, [fallbackSrc, onError]);

  // Intersection Observer for lazy loading
  const imgRef = React.useRef(null);
  const [inView, setInView] = React.useState(priority);

  React.useEffect(() => {
    if (priority || loading !== 'lazy') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, loading]);

  // Set image source when in view
  React.useEffect(() => {
    if (inView && !imageSrc) {
      setImageSrc(src);
    }
  }, [inView, src, imageSrc]);

  if (imageError && fallback) {
    return fallback;
  }

  return (
    <div ref={imgRef} className="relative">
      {/* Placeholder */}
      {!imageLoaded && PlaceholderComponent}
      
      {/* Actual image */}
      {inView && (
        <picture>
          {/* WebP source for supported browsers */}
          <source srcSet={webp} type="image/webp" sizes={sizes} />
          
          {/* Fallback source */}
          <img
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            className={`
              transition-opacity duration-300
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              ${className}
            `}
            style={{
              ...(imageLoaded ? {} : { position: 'absolute', top: 0, left: 0 })
            }}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        </picture>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Virtual scrolling component for large lists
export const VirtualList = memo(({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  ...props
}) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollElementRef = React.useRef(null);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
      {...props}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, startIndex + index)
          )}
        </div>
      </div>
    </div>
  );
});

VirtualList.displayName = 'VirtualList';

// API response caching utility
class ApiCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  set(key, data) {
    // Remove oldest item if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl
    });
  }

  delete(key) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  has(key) {
    const item = this.cache.get(key);
    return item && Date.now() <= item.expiry;
  }
}

// Create global cache instance
export const apiCache = new ApiCache();

// HTTP client with caching
export const cachedFetch = async (url, options = {}) => {
  const { cache = true, cacheKey, ...fetchOptions } = options;
  
  if (!cache) {
    return fetch(url, fetchOptions);
  }

  const key = cacheKey || `${url}:${JSON.stringify(fetchOptions)}`;
  
  // Check cache first
  const cached = apiCache.get(key);
  if (cached) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(cached),
      text: () => Promise.resolve(JSON.stringify(cached))
    });
  }

  // Fetch and cache
  try {
    const response = await fetch(url, fetchOptions);
    
    if (response.ok) {
      const data = await response.clone().json();
      apiCache.set(key, data);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};

// React hook for cached API calls
export const useCachedApi = (url, options = {}) => {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cachedFetch(url, options);
      
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError(new Error(`HTTP ${response.status}: ${response.statusText}`));
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Debounced callback hook
export const useDebounce = (callback, delay) => {
  const timeoutRef = React.useRef(null);

  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

// Throttled callback hook
export const useThrottle = (callback, delay) => {
  const lastRunRef = React.useRef(0);

  return useCallback((...args) => {
    const now = Date.now();
    
    if (now - lastRunRef.current >= delay) {
      callback(...args);
      lastRunRef.current = now;
    }
  }, [callback, delay]);
};

// Bundle size analyzer helper
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle Analysis:');
    console.log('- Total JS:', document.querySelectorAll('script[src]').length, 'files');
    console.log('- Total CSS:', document.querySelectorAll('link[rel="stylesheet"]').length, 'files');
    
    // Estimate total size (rough approximation)
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const totalScripts = scripts.length;
    console.log('- Estimated JS bundle size: ~', totalScripts * 50, 'KB');
  }
};

export default {
  createLazyComponent,
  createLazyRoute,
  createMemoComponent,
  OptimizedImage,
  VirtualList,
  apiCache,
  cachedFetch,
  useCachedApi,
  useDebounce,
  useThrottle,
  analyzeBundleSize
};