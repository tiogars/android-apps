import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Plugin to inject build timestamp into service worker
function injectBuildTimestamp(): Plugin {
  return {
    name: 'inject-build-timestamp',
    writeBundle(options) {
      const outDir = options.dir || 'dist';
      const swPath = path.join(outDir, 'service-worker.js');
      
      if (fs.existsSync(swPath)) {
        let content = fs.readFileSync(swPath, 'utf-8');
        const buildTimestamp = Date.now().toString();
        content = content.replace('__BUILD_TIMESTAMP__', buildTimestamp);
        fs.writeFileSync(swPath, content);
        console.log(`✓ Service worker updated with build timestamp: ${buildTimestamp}`);
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), injectBuildTimestamp()],
  base: '/',
})
