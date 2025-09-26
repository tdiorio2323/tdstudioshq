import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  fallback?: string;
  lazy?: boolean;
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({
    src,
    alt,
    width,
    height,
    priority = false,
    quality = 75,
    fallback = '/placeholder-image.jpg',
    lazy = true,
    className,
    onLoad,
    onError,
    ...props
  }, ref) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(!lazy || priority);
    const imgRef = useRef<HTMLImageElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (!lazy || priority || isInView) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        {
          rootMargin: '50px',
        }
      );

      const currentRef = imgRef.current;
      if (currentRef) {
        observer.observe(currentRef);
      }

      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, [lazy, priority, isInView]);

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setHasError(false);
      onLoad?.(e);
    };

    const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
      setIsLoading(false);
      setHasError(true);
      // Try to load fallback image
      const img = e.currentTarget;
      if (img.src !== fallback) {
        img.src = fallback;
      }
      onError?.(e);
    };

    // Generate optimized src with query parameters for CDNs
    const getOptimizedSrc = (originalSrc: string) => {
      if (originalSrc.startsWith('http') && (width || height || quality !== 75)) {
        const url = new URL(originalSrc);
        if (width) url.searchParams.set('w', width.toString());
        if (height) url.searchParams.set('h', height.toString());
        if (quality !== 75) url.searchParams.set('q', quality.toString());
        return url.toString();
      }
      return originalSrc;
    };

    const shouldShowImage = isInView || priority;
    const optimizedSrc = shouldShowImage ? getOptimizedSrc(src) : '';

    return (
      <div
        ref={imgRef}
        className={cn(
          'relative overflow-hidden',
          isLoading && 'animate-pulse bg-muted',
          className
        )}
        style={{ width, height }}
      >
        {shouldShowImage && (
          <img
            ref={ref}
            src={optimizedSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'transition-opacity duration-300',
              isLoading ? 'opacity-0' : 'opacity-100',
              hasError && 'opacity-50'
            )}
            {...props}
          />
        )}

        {/* Loading skeleton */}
        {isLoading && shouldShowImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* Placeholder for lazy loading */}
        {!shouldShowImage && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Loading...</div>
          </div>
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';