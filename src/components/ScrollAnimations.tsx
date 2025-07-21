import React, { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInUp';
  delay?: number;
  className?: string;
}

export function ScrollAnimation({ 
  children, 
  animation = 'fadeInUp', 
  delay = 0,
  className = '' 
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getAnimationClass = () => {
    const baseClass = 'transition-all duration-1000 ease-out';
    
    if (!isVisible) {
      switch (animation) {
        case 'fadeInUp':
          return `${baseClass} opacity-0 transform translate-y-8`;
        case 'fadeInLeft':
          return `${baseClass} opacity-0 transform -translate-x-8`;
        case 'fadeInRight':
          return `${baseClass} opacity-0 transform translate-x-8`;
        case 'scaleIn':
          return `${baseClass} opacity-0 transform scale-95`;
        case 'slideInUp':
          return `${baseClass} opacity-0 transform translate-y-12`;
        default:
          return `${baseClass} opacity-0`;
      }
    }
    
    return `${baseClass} opacity-100 transform translate-y-0 translate-x-0 scale-100`;
  };

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
}

// Floating elements component
export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating crypto symbols */}
      {['₿', 'Ξ', '₮', 'Ⓑ', '◎'].map((symbol, index) => (
        <div
          key={index}
          className="absolute text-blue-100 text-4xl font-bold animate-float opacity-20"
          style={{
            left: `${10 + index * 20}%`,
            top: `${20 + index * 15}%`,
            animationDelay: `${index * 2}s`,
            animationDuration: `${8 + index * 2}s`
          }}
        >
          {symbol}
        </div>
      ))}
      
      {/* Floating geometric shapes */}
      {[...Array(6)].map((_, index) => (
        <div
          key={`shape-${index}`}
          className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${index * 3}s`,
            animationDuration: `${10 + index * 2}s`
          }}
        />
      ))}
    </div>
  );
}