import React, { useState, useEffect } from 'react';
import WebsiteLoading from '../Loading/WebsiteLoading';
import { useLoading } from '../Contexts/LoadingContext.jsx';

const LoadingWrapper = ({ children }) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const { isLoading } = useLoading();

  useEffect(() => {
    // Simulate initial loading time
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000); // Show loading for 2 seconds on initial load

    return () => clearTimeout(timer);
  }, []);

  // Show loading animation during initial load or when manually triggered
  if (initialLoading || isLoading) {
    return <WebsiteLoading />;
  }

  return children;
};

export default LoadingWrapper;
