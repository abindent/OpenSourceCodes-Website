'use client';

import { useEffect, useState } from 'react';

export function usePreloader() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Wait for everything to be fully loaded
    const handleLoad = () => {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setLoading(false);
      }, 500);
    };
    
    // Check if the document is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      
      // Fallback in case load event doesn't fire
      setTimeout(() => {
        setLoading(false);
      }, 3000);
      
      return () => {
        window.removeEventListener('load', handleLoad);
      };
    }
  }, []);
  
  return loading;
}