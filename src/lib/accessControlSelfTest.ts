/**
 * Access Control Self-Test
 * 
 * Run this in dev mode to verify tier-based access control is working correctly.
 */

import { validateAccessControl } from './accessControl';

export function logAccessControlSelfTest() {
  const result = validateAccessControl();
  
  console.group('🔎 Access Control Self-Test');
  console.log('Passed:', result.passed);
  console.log('Failed:', result.failed);
  
  if (result.failed > 0) {
    console.error('❌ Failures detected:', result.failures);
  } else {
    console.log('✅ All access control tests passed!');
  }
  
  console.groupEnd();
  
  return result;
}

/**
 * Assert access control is working (throws if not)
 */
export function assertAccessControlValid() {
  const result = validateAccessControl();
  
  if (result.failed > 0) {
    throw new Error(
      `Access control validation failed: ${result.failed} test(s) failed. ` +
      `See console for details.`
    );
  }
  
  return result;
}
