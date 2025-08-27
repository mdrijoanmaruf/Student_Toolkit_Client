import { useLoading } from '../Contexts/LoadingContext.jsx';

const useWebsiteLoading = () => {
  const { isLoading, showLoading, hideLoading } = useLoading();

  // Function to show loading during async operations
  const withLoading = async (asyncFunction) => {
    try {
      showLoading();
      const result = await asyncFunction();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setTimeout(() => {
        hideLoading();
      }, 500); // Small delay for better UX
    }
  };

  // Function to show loading for navigation
  const showNavigationLoading = () => {
    showLoading();
    // Auto-hide after a short delay if not manually hidden
    setTimeout(() => {
      hideLoading();
    }, 1500);
  };

  // Function to show loading during page refresh
  const handlePageReload = () => {
    showLoading();
    window.location.reload();
  };

  return {
    isLoading,
    showLoading,
    hideLoading,
    withLoading,
    showNavigationLoading,
    handlePageReload
  };
};

export default useWebsiteLoading;
