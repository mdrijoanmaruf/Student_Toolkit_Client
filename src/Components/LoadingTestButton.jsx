import React from 'react';
import useWebsiteLoading from '../Hook/useWebsiteLoading';

const LoadingTestButton = () => {
  const { showLoading, hideLoading, withLoading, handlePageReload } = useWebsiteLoading();

  // Example: Manual loading control
  const handleManualLoading = () => {
    showLoading();
    // Simulate some work
    setTimeout(() => {
      hideLoading();
    }, 1000);
  };

  // Example: Using withLoading for async operations
  const handleAsyncOperation = async () => {
    try {
      await withLoading(async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Async operation completed');
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-gray-800 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-4">Loading Controls</h3>
      
      <button
        onClick={handleManualLoading}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors mr-2"
      >
        Show Loading (3s)
      </button>

      <button
        onClick={handleAsyncOperation}
        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors mr-2"
      >
        Async Operation
      </button>

      <button
        onClick={handlePageReload}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Reload Page
      </button>

      <div className="mt-4 p-4 bg-gray-700 rounded text-gray-300 text-sm">
        <p><strong>Usage Examples:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Manual Loading: Shows loading animation for 3 seconds</li>
          <li>Async Operation: Shows loading during async operation</li>
          <li>Reload Page: Shows loading animation during page reload</li>
        </ul>
      </div>
    </div>
  );
};

export default LoadingTestButton;
