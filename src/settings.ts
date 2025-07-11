// Centralized settings for the application
// Environment variables are read at build time for production, runtime for development

interface Settings {
  api: {
    baseUrl: string;
  };
  app: {
    name: string;
    version: string;
  };
  apiUrl: (endpoint: string) => string;
}

// Helper function to get environment variable with fallback
const getEnvVar = (key: string, defaultValue: string): string => {
  // In development, Vite will read from the container environment
  // In production, this will be baked in at build time
  return import.meta.env[key] || defaultValue;
};


const settings: Settings = {
  api: {
    baseUrl: getEnvVar('VITE_API_BASE_URL', 'https://marcstreeter.dev'),
  },
  app: {
    name: 'MarcStreeter.dev',
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
  },
  apiUrl: (endpoint: string): string => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${settings.api.baseUrl}${cleanEndpoint}`;
  }
};

// Export individual settings for convenience
export const { api, app, apiUrl } = settings; 