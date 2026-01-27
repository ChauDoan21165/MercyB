/**
 * Vite Bundle Analysis Configuration
 * For analyzing bundle size and identifying optimization opportunities
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap', // or 'sunburst', 'network'
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          'query-vendor': ['@tanstack/react-query'],
          
          // Admin chunks (lazy loaded)
          'admin': [
            './src/pages/admin/AdminDashboard',
            './src/pages/admin/UnifiedHealthCheck',
          ],
          
          // Design system
          'design-system': [
            './src/design-system/tokens',
            './src/design-system/components',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600, // Warn if chunk > 600kb
  },
});
