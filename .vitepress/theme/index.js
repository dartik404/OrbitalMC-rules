import DefaultTheme from 'vitepress/theme'
import RulesDashboard from './components/RulesDashboard.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register the custom rules dashboard globally
    app.component('RulesDashboard', RulesDashboard)
  }
}
