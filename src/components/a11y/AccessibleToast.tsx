/**
 * Accessible Toast Component
 * Screen reader friendly toast notifications with proper ARIA attributes
 */

import { useEffect } from "react";
import { toast as sonnerToast, Toaster } from "sonner";

interface AccessibleToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

/**
 * Show accessible toast notification
 * Announces to screen readers without stealing focus
 */
export function showAccessibleToast({ message, type = 'info', duration = 4000 }: AccessibleToastProps) {
  const toastFn = {
    success: sonnerToast.success,
    error: sonnerToast.error,
    info: sonnerToast.info,
    warning: sonnerToast.warning,
  }[type];

  toastFn(message, {
    duration,
    // Add ARIA attributes via custom component
    className: "accessible-toast",
  });
}

/**
 * Accessible Toaster Wrapper
 * Configures sonner with proper ARIA attributes
 */
export function AccessibleToaster() {
  useEffect(() => {
    // Add aria-live to toast container after mount
    const toastContainer = document.querySelector('[data-sonner-toaster]');
    if (toastContainer) {
      toastContainer.setAttribute('role', 'status');
      toastContainer.setAttribute('aria-live', 'polite');
      toastContainer.setAttribute('aria-atomic', 'true');
    }
  }, []);

  return <Toaster position="top-center" />;
}
