import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Mermaid from '../components/Mermaid.vue'

export default <Theme>{
  extends: DefaultTheme,
  enhanceApp: async ({ app }) => {
    app.component('Mermaid', Mermaid)
  },
}
