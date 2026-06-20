import { describe, it, expect } from 'vitest';

/**
 * Type B hardening test: Safe artifact path classification and unsafe path rejection.
 *
 * This test verifies that a deterministic path guard function correctly:
 * - Accepts safe artifact paths (e.g., within allowed directories).
 * - Rejects unsafe paths (e.g., directory traversal, absolute paths, symlink-like patterns).
 * - Does not rely on any network, auth, billing, SQL, secrets, or deployment logic.
 */

function isSafeArtifactPath(inputPath) {
  // Reject absolute paths and directory traversal
  if (inputPath.startsWith('/') || inputPath.startsWith('..') || inputPath.includes('../')) {
    return false;
  }
  // Reject paths with suspicious patterns: null bytes, shell metacharacters, or empty components
  const dangerousChars = /[\0;&|`$(){}[\]!#~*?\\\n\r]/;
  if (dangerousChars.test(inputPath)) {
    return false;
  }
  // Reject paths that are empty, only dots, or only whitespace
  if (!inputPath || /^[.\s]*$/.test(inputPath)) {
    return false;
  }
  // Reject paths that attempt to escape via symlink-like constructs or encoded sequences
  if (/\.\.?\//.test(inputPath) || /\/\.\.?\//.test(inputPath)) {
    return false;
  }
  // Reject paths with excessive length (over 255 characters)
  if (inputPath.length > 255) {
    return false;
  }
  // Allow only alphanumeric, dots, hyphens, underscores, and forward slashes
  const allowedPattern = /^[a-zA-Z0-9._/-]+$/;
  if (!allowedPattern.test(inputPath)) {
    return false;
  }
  return true;
}

describe('Path Guard - Type B Hardening', () => {
  it('should accept safe artifact paths', () => {
    const safePaths = [
      'artifacts/build/output.bin',
      'logs/2026/06/20/event.log',
      'data/report-final-v2.tar.gz',
      'cache/abc123.tmp',
      'test-results/junit.xml',
    ];
    for (const p of safePaths) {
      expect(isSafeArtifactPath(p)).toBe(true);
    }
  });

  it('should reject absolute paths', () => {
    const absolutePaths = [
      '/etc/passwd',
      '/usr/bin/evil.sh',
      '/var/log/syslog',
      '/tmp/exploit.exe',
    ];
    for (const p of absolutePaths) {
      expect(isSafeArtifactPath(p)).toBe(false);
    }
  });

  it('should reject directory traversal attempts', () => {
    const traversalPaths = [
      '../secret.key',
      'data/../../etc/passwd',
      'safe/../../../tmp/evil',
      'a/../b/../../c',
      '../../glob/config',
    ];
    for (const p of traversalPaths) {
      expect(isSafeArtifactPath(p)).toBe(false);
    }
  });

  it('should reject paths with dangerous characters', () => {
    const dangerousPaths = [
      'file;rm -rf /',
      'foo&bar',
      'x|y',
      'cmd`ls`',
      '$(cat /etc/hostname)',
      '{malicious}',
      'test[123]',
      'file!important',
      'path~home',
      '*wildcard',
      'question?mark',
      'back\\slash',
      'line\nbreak',
      'carriage\rreturn',
      'null\0byte',
    ];
    for (const p of dangerousPaths) {
      expect(isSafeArtifactPath(p)).toBe(false);
    }
  });

  it('should reject empty, dot-only, or whitespace paths', () => {
    const invalidPaths = ['', '.', '..', ' . ', '\t', '\n', '   '];
    for (const p of invalidPaths) {
      expect(isSafeArtifactPath(p)).toBe(false);
    }
  });

  it('should reject paths over 255 characters', () => {
    const longPath = 'a'.repeat(300) + '/file.txt';
    expect(isSafeArtifactPath(longPath)).toBe(false);
  });

  it('should reject encoded traversal like dot-slash sequences', () => {
    const encodedTraversal = [
      './safe/../secret',
      'safe/./../secret',
      'foo/..\\bar',
    ];
    for (const p of encodedTraversal) {
      expect(isSafeArtifactPath(p)).toBe(false);
    }
  });

  it('should reject paths with disallowed characters', () => {
    const disallowedChars = [
      'file with spaces.txt',
      'file%20name.txt',
      'path<file',
      'path>file',
      'quote\'file',
      'double"quote',
      'comma,file',
    ];
    for (const p of disallowedChars) {
      expect(isSafeArtifactPath(p)).toBe(false);
    }
  });
});
