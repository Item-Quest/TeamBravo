import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //build: {
   // minify: false, // Disable minification
   // rollupOptions: {
    //  output: {
     //   manualChunks: null, // Disable chunking
      //  entryFileNames: '[name].js', // Keep file names as-is
      //}
    //},
    //target: 'esnext', // Optional: targets modern JavaScript to avoid further optimizations
  //},
});
