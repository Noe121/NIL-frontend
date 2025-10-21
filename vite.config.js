import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ command, mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Force development mode for dev command
  process.env.NODE_ENV = command === 'serve' ? 'development' : 'production';
  
  // Determine if we're in standalone or centralized mode
  const appMode = process.env.VITE_MODE || env.VITE_MODE || 'standalone';
  const isDev = command === 'serve' || process.env.NODE_ENV === 'development';
  
  // For production builds, force load production environment variables
  const isProductionBuild = command === 'build' && mode === 'production';
  let finalEnv = env;
  if (isProductionBuild) {
    finalEnv = loadEnv('production', process.cwd(), '');
    console.log('🔧 Production build detected, loading production env vars');
  }
  
  // Log configuration
  console.log('🔧 Building config with:', {
    command,
    mode: appMode,
    isDev,
    NODE_ENV: process.env.NODE_ENV,
    isProductionBuild
  });
  
  // Dual-mode configuration: check if mode === 'standalone' or 'centralized'
  const isStandaloneMode = appMode === 'standalone';
  const isCentralizedMode = appMode === 'centralized';
  
  // Dynamic port assignment based on mode: 5173 for standalone, 5174 for centralized
  const devPort = appMode === 'centralized' ? 5174 : 5173;
  const previewPort = appMode === 'centralized' ? 4174 : 5173;
  
  console.log(`🚀 Frontend starting in ${appMode} mode`);
  console.log(`📡 Dev server will run on port ${devPort}`);
  
  return {
    plugins: [react()],
    root: process.cwd(),
    base: '/',
    publicDir: 'public',
    
    // Path resolution
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@contexts': fileURLToPath(new URL('./src/contexts', import.meta.url)),
        '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@views': fileURLToPath(new URL('./src/views', import.meta.url))
      }
    },
    
    // Development server configuration
    server: {
      port: devPort,
      host: true,
      cors: true,
      fs: {
        strict: false
      },
      headers: isDev ? {
        // Disable CSP in development
        'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;"
      } : {
        // Strict CSP for production
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' http://localhost:* https://*;"
      },
      proxy: isDev ? {
        // Proxy API calls during development
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8002',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/auth/api': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/auth\/api/, '')
        },
        '/register': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false
        },
        '/login': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false
        },
        '/me': {
          target: 'http://localhost:9000',
          changeOrigin: true,
          secure: false
        }
      } : undefined
    },
    
    // Preview server configuration
    preview: {
      port: previewPort,
      host: true,
      cors: true
    },
    
    // Build configuration
    build: {
      outDir: `dist-${appMode}`,
      rollupOptions: {
        input: {
          main: './index.html' // React app as main entry
        },
        output: {
          manualChunks: {
            // Vendor chunk for better caching
            vendor: ['react', 'react-dom', 'react-router-dom'],
            // Separate chunk for blockchain-related code (centralized mode)
            ...(appMode === 'centralized' && {
              blockchain: [] // Empty for now - add when blockchain deps are installed
            })
          }
        }
      },
      // Optimize for the target mode
      target: 'es2015',
      sourcemap: isDev,
      minify: !isDev
    },
    
    // Environment variable handling
    define: {
      __APP_MODE__: JSON.stringify(appMode),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      // Force production URLs when building for production
      ...(isProductionBuild ? {
        'import.meta.env.VITE_API_URL': JSON.stringify(finalEnv.VITE_API_URL || 'https://sd7zgk0gz5.execute-api.us-east-1.amazonaws.com/prod'),
        'import.meta.env.VITE_AUTH_SERVICE_URL': JSON.stringify(finalEnv.VITE_AUTH_SERVICE_URL || 'https://sd7zgk0gz5.execute-api.us-east-1.amazonaws.com/prod/auth'),
        'import.meta.env.VITE_COMPANY_API_URL': JSON.stringify(finalEnv.VITE_COMPANY_API_URL || 'https://sd7zgk0gz5.execute-api.us-east-1.amazonaws.com/prod/api/company'),
        'import.meta.env.VITE_ENVIRONMENT': JSON.stringify('production'),
        'import.meta.env.VITE_DEBUG_MODE': JSON.stringify('false'),
      } : {})
    },
    
    // CSS configuration
    css: {
      devSourcemap: isDev,
      preprocessorOptions: {
        scss: {
          additionalData: `$app-mode: ${appMode};`
        }
      }
    },
    
    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'framer-motion',
        'axios'
      ],
      // Include blockchain dependencies for centralized mode
      ...(appMode === 'centralized' && {
        include: [
          'react',
          'react-dom', 
          'react-router-dom',
          'framer-motion',
          'axios'
          // Add blockchain dependencies when implemented
        ]
      })
    }
  };
});
