import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      border: '1px solid #10b981',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      border: '1px solid #ef4444',
    },
  });
};

export const showLoading = (message) => {
  return toast.loading(message);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const showInfo = (message) => {
  toast(message, {
    icon: 'ℹ️',
    style: {
      border: '1px solid #3b82f6',
    },
  });
};