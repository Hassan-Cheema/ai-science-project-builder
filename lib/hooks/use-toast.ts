// Utility hook for consistent toast notifications using Sonner
import { toast } from 'sonner';

export const useToast = () => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const showInfo = (message: string) => {
    toast.info(message);
  };

  const copyToClipboard = async (text: string, successMessage = 'Copied to clipboard!') => {
    try {
      await navigator.clipboard.writeText(text);
      showSuccess(successMessage);
      return true;
    } catch {
      showError('Failed to copy to clipboard');
      return false;
    }
  };

  return {
    showSuccess,
    showError,
    showLoading,
    showInfo,
    copyToClipboard,
  };
};
