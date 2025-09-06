// Vitest configuration for IDE test detection
export default {
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    testTimeout: 10000,
    hookTimeout: 10000,
    setupFiles: ['./test/setup.ts'],
    // Enable test discovery for IDEs
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@': './src',
    },
  },
}



