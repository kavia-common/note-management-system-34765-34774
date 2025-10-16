import Blits from '@lightningjs/blits'
import App from './App.js'
import { theme } from './styles/theme.js'

// PUBLIC_INTERFACE
export default Blits.Launch(App, 'app', {
  w: 1280,
  h: 720,
  // Map arrow/enter/back keys for TV/keyboard; can be extended later
  keys: {
    up: ['ArrowUp'],
    down: ['ArrowDown'],
    left: ['ArrowLeft'],
    right: ['ArrowRight'],
    enter: ['Enter'],
    back: ['Escape', 'Backspace']
  },
  // Provide theme globally
  plugins: [
    Blits.Plugins.Theme(theme)
  ],
  // initial state can be extended here if needed
})
