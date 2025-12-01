/**
 * Client-side Storage Encryption
 * Encrypts sensitive data in localStorage/sessionStorage
 */

import CryptoJS from 'crypto-js';

// Derive encryption key from environment + device fingerprint
const getEncryptionKey = (): string => {
  // Use a combination of static key and browser fingerprint
  const staticKey = import.meta.env.VITE_ENCRYPTION_KEY || 'mercy-blade-default-key';
  const fingerprint = navigator.userAgent + navigator.language;
  return CryptoJS.SHA256(staticKey + fingerprint).toString();
};

/**
 * Encrypt data before storing
 */
export const encryptData = (data: any): string => {
  const key = getEncryptionKey();
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, key).toString();
};

/**
 * Decrypt data after retrieving
 */
export const decryptData = <T>(encrypted: string): T | null => {
  try {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
};

/**
 * Secure localStorage wrapper
 */
export const secureStorage = {
  setItem: (key: string, value: any) => {
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
  },
  
  getItem: <T>(key: string): T | null => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData<T>(encrypted);
  },
  
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  },
};

/**
 * Secure sessionStorage wrapper
 */
export const secureSessionStorage = {
  setItem: (key: string, value: any) => {
    const encrypted = encryptData(value);
    sessionStorage.setItem(key, encrypted);
  },
  
  getItem: <T>(key: string): T | null => {
    const encrypted = sessionStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData<T>(encrypted);
  },
  
  removeItem: (key: string) => {
    sessionStorage.removeItem(key);
  },
  
  clear: () => {
    sessionStorage.clear();
  },
};