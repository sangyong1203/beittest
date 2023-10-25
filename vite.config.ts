import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const localBaseUrl = "http://192.168.0.35:8085/api/"
  const publishUrl = "https://wpgumi.com/api/"

  return {
      plugins: [vue()],
      build: {
          outDir: "www",
      },
      define: {
          "process.env": {
              BASE_URL: command == "serve" ? localBaseUrl : publishUrl,
          },
      },
      esbuild:{
          drop: command === 'build' ? ["console","debugger"]:[]
      },
      resolve: {
          alias: {
              "@": fileURLToPath(new URL("./src", import.meta.url)),
              "@apis": fileURLToPath(new URL("./src/apis", import.meta.url)),
              "@assets": fileURLToPath(new URL("./src/assets", import.meta.url)),
              "@components": fileURLToPath(new URL("./src/components", import.meta.url)),
              "@views": fileURLToPath(new URL("./src/views", import.meta.url)),
              "@router": fileURLToPath(new URL("./src/router", import.meta.url)),
              "@stores": fileURLToPath(new URL("./src/stores", import.meta.url)),
              "@common": fileURLToPath(new URL("./src/common", import.meta.url)),
          },
      },
  }
})
