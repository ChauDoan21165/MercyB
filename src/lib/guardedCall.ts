import { toast } from 'sonner';

/**
 * ⚠️ CRITICAL DEV NOTE ⚠️
 * 
 * All admin Supabase calls MUST use guardedCall to prevent "fake success after error".
 * 
 * This is a non-negotiable architectural requirement. Any admin operation that:
 * - Mutates data (INSERT, UPDATE, DELETE)
 * - Calls edge functions
 * - Shows success messages to users
 * 
 * MUST be wrapped in guardedCall to ensure errors are properly surfaced
 * and success messages are NEVER shown after failures.
 */

/**
 * Guarded Call Wrapper
 * 
 * This utility ensures we NEVER claim success after an error.
 * All critical operations should be wrapped with this function.
 */

export interface GuardedCallResult<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

/**
 * Wraps an async operation with structured logging and error handling
 * 
 * Rules:
 * 1. If the operation throws or returns an error, log it and show error toast
 * 2. NEVER show success toast after an error
 * 3. Return null on error, actual result on success
 * 
 * @param label - Human-readable label for the operation (e.g., "Sync rooms from JSON")
 * @param fn - The async function to execute
 * @param options - Configuration options
 * @returns The result or null if error occurred
 */
export async function guardedCall<T>(
  label: string,
  fn: () => Promise<T>,
  options: {
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
  } = {}
): Promise<GuardedCallResult<T>> {
  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = `${label} completed successfully`
  } = options;

  console.log(`🔄 [${label}] Starting...`);

  try {
    const result = await fn();

    // Check if result is an object with error property (common Supabase pattern)
    if (result && typeof result === 'object' && 'error' in result && (result as any).error) {
      const error = (result as any).error;
      const errorMessage = error.message || error.toString() || 'Unknown error';
      
      console.error(`❌ [${label}] Failed:`, errorMessage);
      
      if (showErrorToast) {
        toast.error(`${label} failed: ${errorMessage}`);
      }

      return {
        success: false,
        data: null,
        error: errorMessage
      };
    }

    // Success case
    console.log(`✅ [${label}] Completed successfully`);
    
    if (showSuccessToast) {
      toast.success(successMessage);
    }

    return {
      success: true,
      data: result,
      error: null
    };
  } catch (error: any) {
    const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
    
    console.error(`❌ [${label}] Error:`, {
      label,
      error: errorMessage,
      stack: error?.stack
    });

    if (showErrorToast) {
      toast.error(`${label} failed: ${errorMessage}`);
    }

    return {
      success: false,
      data: null,
      error: errorMessage
    };
  }
}

/**
 * Example usage:
 * 
 * // Before:
 * const { data, error } = await supabase.from('rooms').insert(...);
 * if (error) console.error(error);
 * toast.success("Registered!"); // ❌ Shows even if error occurred!
 * 
 * // After:
 * const result = await guardedCall(
 *   'Register VIP4 rooms',
 *   async () => supabase.from('rooms').insert(...),
 *   { showSuccessToast: true, successMessage: 'Rooms registered successfully' }
 * );
 * 
 * if (result.success) {
 *   // Only runs if truly successful
 *   updateUI(result.data);
 * }
 */
