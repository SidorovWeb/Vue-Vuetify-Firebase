import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const lightTheme = {
  primary: '#ffffff',
  accent: '#0080ff',
  secondary: '#ffffff',
  error: '#ff3d33',
  warning: '#FB8C00',
  gainsBorough: '#a2a2a2',
  signalBlue: '#262261',
  pantone: '#949597',
  high: '#ff3d56',
  medium: '#fba800',
  low: '#48dafd',
  dark: '#000',
}
const darkTheme = {
  primary: '#161616',
  accent: '#0080ff',
  secondary: '#363636',
  error: '#ff3d33',
  success: '#54bf00',
  warning: '#FB8C00',
  gainsBorough: '#a2a2a2',
  signalBlue: '#262261',
  pantone: '#949597',
  high: '#ff3d56',
  medium: '#fba800',
  low: '#48dafd',
  dark: '#fff',
}

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  treeShaking: true,
  theme: {
    themes: {
      dark: darkTheme,
      light: lightTheme,
    },

    dark: true,
  },
})
