import { create } from 'storybook/theming/create'

export default create({
  base: 'light',
  brandTitle: 'MaroBase Design System',
  brandUrl: 'https://maropost.com',
  brandTarget: '_self',

  // Colors — MaroBase cyan + warm cream
  colorPrimary: '#1ab7ea',
  colorSecondary: '#1a1814',

  // UI — warm cream surfaces
  appBg: '#f7f3ec',
  appContentBg: '#fdfbf7',
  appPreviewBg: '#fdfbf7',
  appBorderColor: '#e6dfd1',
  appBorderRadius: 12,

  // Text
  textColor: '#1a1814',
  textInverseColor: '#FFFFFF',
  textMutedColor: '#7a7466',

  // Toolbar
  barTextColor: '#7a7466',
  barSelectedColor: '#1ab7ea',
  barHoverColor: '#1ab7ea',
  barBg: '#fdfbf7',

  // Inputs
  inputBg: '#fdfbf7',
  inputBorder: '#e6dfd1',
  inputTextColor: '#1a1814',
  inputBorderRadius: 8,

  // Font
  fontBase: '"Inter", system-ui, -apple-system, sans-serif',
  fontCode: '"JetBrains Mono", "Fira Code", monospace',
})
