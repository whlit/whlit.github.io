import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default <Theme>{
  extends: DefaultTheme,
  enhanceApp: async ({}) => {},
}
