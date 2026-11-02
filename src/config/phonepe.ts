/**
 * PhonePe Gateway Configuration Module
 * Loads and validates credentials from environment variables.
 * Supports Node.js / Express proxy and Vite frontend environments.
 */

export interface PhonePeEnvironmentConfig {
  merchantId: string;
  saltKey: string;
  saltIndex: number;
  environment: 'PRODUCTION' | 'UAT';
  baseUrl: string;
}

function resolveEnv(key: string, viteKey: string): string | undefined {
  if (typeof process !== 'undefined' && process.env) {
    if (process.env[key]) return process.env[key];
    if (process.env[viteKey]) return process.env[viteKey];
  }
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      if (import.meta.env[viteKey]) return import.meta.env[viteKey] as string;
    }
  } catch {
    // import.meta not available in this context
  }
  return undefined;
}

/**
 * Validates and retrieves the PhonePe configuration.
 * Throws a descriptive error if required environment variables are absent.
 */
export function getPhonePeConfig(): PhonePeEnvironmentConfig {
  const merchantId = resolveEnv('PHONEPE_MERCHANT_ID', 'VITE_PHONEPE_MERCHANT_ID');
  const saltKey = resolveEnv('PHONEPE_SALT_KEY', 'VITE_PHONEPE_SALT_KEY');
  const saltIndexRaw = resolveEnv('PHONEPE_SALT_INDEX', 'VITE_PHONEPE_SALT_INDEX') || '1';
  const envRaw = (resolveEnv('PHONEPE_ENVIRONMENT', 'VITE_PHONEPE_ENVIRONMENT') || 'UAT').toUpperCase();

  if (!merchantId) {
    throw new Error(
      'PhonePe Gateway Configuration Error: Merchant ID is missing. ' +
      'Please configure PHONEPE_MERCHANT_ID or VITE_PHONEPE_MERCHANT_ID in your environment variables.'
    );
  }

  if (!saltKey) {
    throw new Error(
      'PhonePe Gateway Configuration Error: Salt Key is missing. ' +
      'Please configure PHONEPE_SALT_KEY or VITE_PHONEPE_SALT_KEY in your environment variables.'
    );
  }

  const saltIndex = parseInt(saltIndexRaw, 10);
  if (isNaN(saltIndex)) {
    throw new Error(
      `PhonePe Gateway Configuration Error: Invalid Salt Index "${saltIndexRaw}". Expected an integer (e.g. 1).`
    );
  }

  const environment: 'PRODUCTION' | 'UAT' = envRaw === 'PRODUCTION' ? 'PRODUCTION' : 'UAT';
  const baseUrl = environment === 'PRODUCTION'
    ? 'https://api.phonepe.com/apis/hermes'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

  return {
    merchantId,
    saltKey,
    saltIndex,
    environment,
    baseUrl,
  };
}

/**
 * Dynamic configuration proxy so credentials are evaluated on access.
 * Prevents build-time failures if environment variables are injected at runtime.
 */
export const PHONEPE_CONFIG: PhonePeEnvironmentConfig = {
  get merchantId() {
    return getPhonePeConfig().merchantId;
  },
  get saltKey() {
    return getPhonePeConfig().saltKey;
  },
  get saltIndex() {
    return getPhonePeConfig().saltIndex;
  },
  get environment() {
    return getPhonePeConfig().environment;
  },
  get baseUrl() {
    return getPhonePeConfig().baseUrl;
  },
};
