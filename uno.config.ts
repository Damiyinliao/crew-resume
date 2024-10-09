// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options

  shortcuts: {
    'flex-center': 'flex justify-center items-center',
    'flex-column-center': 'flex flex-col items-center justify-center'
  }
})