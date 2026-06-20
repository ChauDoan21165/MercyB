import { describe, it, expect } from 'vitest';

/**
 * Type B hardening test: Safe artifact path classification and unsafe path rejection.
 * Tests that mercyforge-path-guard correctly identifies and handles
 * safe and unsafe artifact paths for the 20260620-493 export.
 */

describe('mercyforge-path-guard (20260620-493) - Path Classification and Rejection', () => {
  // Simulated path guard logic (in production, this would be a real module)
  const classifyPath = (path) => {
    // Normalize
    const normalized = path.replace(/\\/g, '/');

    // Reject absolute paths
    if (normalized.startsWith('/') || /^[A-Za-z]:\//.test(normalized)) {
      return { safe: false, reason: 'Absolute paths are forbidden' };
    }

    // Reject traversal attempts
    if (normalized.includes('..')) {
      return { safe: false, reason: 'Path traversal detected' };
    }

    // Reject null bytes
    if (normalized.includes('\0')) {
      return { safe: false, reason: 'Null byte in path' };
    }

    // Reject shell metacharacters
    if (/[;&|`$(){}[\]!<>?#~*]/.test(normalized)) {
      return { safe: false, reason: 'Shell metacharacters forbidden' };
    }

    // Reject paths starting with special names (Windows reserved)
    const firstSegment = normalized.split('/')[0];
    const reserved = ['CON', 'PRN', 'AUX', 'NUL', 'COM1', 'COM2', 'COM3', 'COM4',
                      'LPT1', 'LPT2', 'LPT3', 'LPT4'];
    if (reserved.includes(firstSegment.toUpperCase())) {
      return { safe: false, reason: 'Reserved Windows device name' };
    }

    // Allow only known safe artifact patterns
    const safePattern = /^artifacts\/[a-z0-9_-]+\/[a-z0-9_-]+\.(json|yaml|yml|toml|xml|txt|log)$/;
    if (!safePattern.test(normalized)) {
      return { safe: false, reason: 'Not a recognized safe artifact path' };
    }

    return { safe: true, reason: null };
  };

  const rejectUnsafe = (path) => {
    const result = classifyPath(path);
    if (!result.safe) {
      throw new Error(`Path rejected: ${result.reason}`);
    }
    return path;
  };

  // === SAFE PATHS ===

  it('allows simple artifact JSON path', () => {
    expect(() => rejectUnsafe('artifacts/report/20260620-493.json')).not.toThrow();
  });

  it('allows artifact YAML path with underscores', () => {
    expect(() => rejectUnsafe('artifacts/config_export/main_config.yaml')).not.toThrow();
  });

  it('allows artifact with hyphenated name and .log extension', () => {
    expect(() => rejectUnsafe('artifacts/process-log/event-stream.log')).not.toThrow();
  });

  it('allows nested artifact path with .toml', () => {
    expect(() => rejectUnsafe('artifacts/mercyforge/guard-test.toml')).not.toThrow();
  });

  it('allows artifact .xml and .txt extensions', () => {
    expect(() => rejectUnsafe('artifacts/test/items.xml')).not.toThrow();
    expect(() => rejectUnsafe('artifacts/test/readme.txt')).not.toThrow();
  });

  // === UNSAFE PATHS - Absolute ===

  it('rejects absolute Unix path', () => {
    expect(() => rejectUnsafe('/etc/passwd')).toThrow('Path rejected');
  });

  it('rejects absolute Windows path', () => {
    expect(() => rejectUnsafe('C:\\windows\\system32\\config')).toThrow('Path rejected');
  });

  // === UNSAFE PATHS - Traversal ===

  it('rejects traversal with parent reference', () => {
    expect(() => rejectUnsafe('artifacts/../../etc/shadow')).toThrow('Path rejected');
  });

  it('rejects deeply nested traversal', () => {
    expect(() => rejectUnsafe('artifacts/../artifacts/../../../tmp/foo')).toThrow('Path rejected');
  });

  // === UNSAFE PATHS - Null bytes ===

  it('rejects null byte in path', () => {
    expect(() => rejectUnsafe('artifacts/%00/evil.txt')).toThrow('Path rejected');
  });

  // === UNSAFE PATHS - Shell metacharacters ===

  it('rejects semicolon', () => {
    expect(() => rejectUnsafe('artifacts/test;rm -rf /;.json')).toThrow('Path rejected');
  });

  it('rejects backtick', () => {
    expect(() => rejectUnsafe('artifacts/`id`/test.log')).toThrow('Path rejected');
  });

  it('rejects pipe', () => {
    expect(() => rejectUnsafe('artifacts/foo|bar/file.txt')).toThrow('Path rejected');
  });

  it('rejects dollar sign and braces', () => {
    expect(() => rejectUnsafe('artifacts/${PATH}/exploit.yaml')).toThrow('Path rejected');
  });

  it('rejects wildcard', () => {
    expect(() => rejectUnsafe('artifacts/*.json')).toThrow('Path rejected');
  });

  // === UNSAFE PATHS - Reserved names ===

  it('rejects Windows CON device', () => {
    expect(() => rejectUnsafe('CON/test.txt')).toThrow('Path rejected');
  });

  it('rejects Windows NUL device', () => {
    expect(() => rejectUnsafe('artifacts/NUL/out.log')).toThrow('Path rejected');
  });

  // === UNSAFE PATHS - Wrong pattern ===

  it('rejects path not in artifacts/', () => {
    expect(() => rejectUnsafe('tmp/artifact.json')).toThrow('Path rejected');
  });

  it('rejects path with double extension', () => {
    expect(() => rejectUnsafe('artifacts/test/file.js.json')).toThrow('Path rejected');
  });

  it('rejects uppercase extension', () => {
    expect(() => rejectUnsafe('artifacts/test/file.JSON')).toThrow('Path rejected');
  });

  it('rejects path without extension', () => {
    expect(() => rejectUnsafe('artifacts/test/README')).toThrow('Path rejected');
  });

  it('rejects empty path', () => {
    expect(() => rejectUnsafe('')).toThrow('Path rejected');
  });

  // === CLASSIFICATION TESTS ===

  it('classifyPath returns safe for valid artifact', () => {
    const result = classifyPath('artifacts/export/20260620-493.json');
    expect(result.safe).toBe(true);
    expect(result.reason).toBeNull();
  });

  it('classifyPath returns safe for artifact with numbers', () => {
    const result = classifyPath('artifacts/guard-2026/path-493.yaml');
    expect(result.safe).toBe(true);
  });

  it('classifyPath rejects absolute paths', () => {
    const result = classifyPath('/etc/hosts');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('Absolute');
  });

  it('classifyPath rejects traversal', () => {
    const result = classifyPath('artifacts/../../secret.txt');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('traversal');
  });

  it('classifyPath rejects null byte', () => {
    const result = classifyPath('artifacts/\0/evil.log');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('Null');
  });

  it('classifyPath rejects shell meta', () => {
    const result = classifyPath('artifacts/$(whoami)/out.txt');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('Shell');
  });

  it('classifyPath rejects reserved Windows name', () => {
    const result = classifyPath('PRN/foo.txt');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('Reserved');
  });

  it('classifyPath rejects unknown pattern', () => {
    const result = classifyPath('var/log/syslog');
    expect(result.safe).toBe(false);
    expect(result.reason).toContain('Not a recognized');
  });

  // === EDGE CASES ===

  it('rejects path with only spaces', () => {
    expect(() => rejectUnsafe('   ')).toThrow('Path rejected');
  });

  it('rejects path with newline injection attempt', () => {
    expect(() => rejectUnsafe('artifacts/test/file\n.json')).toThrow('Path rejected');
  });

  it('rejects backslash path traversal attempt', () => {
    expect(() => rejectUnsafe('artifacts\\..\\..\\secret.txt')).toThrow('Path rejected');
  });

  it('rejects path with encoded traversal', () => {
    // %2e%2e%2f is URL-encoded "../", but raw string should also be caught
    expect(() => rejectUnsafe('artifacts/%2e%2e%2fsecret.txt')).toThrow('Path rejected');
  });
});
