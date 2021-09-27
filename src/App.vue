<template>
  <v-app class="App" :style="cssProps">
    <div class="d-sm-block d-none">
      <component :is="layout">
        <router-view></router-view>
      </component>
      <v-alert
        v-if="message"
        class="fixed-alert"
        transition="slide-x-reverse-transition"
        :type="message.type"
        max-width="500px"
        min-height="50px"
        elevation="5"
        :value="message ? true : false"
        >{{ message.message }}</v-alert
      >
    </div>

    <div class="d-sm-none d-block" style="height: 100%">
      <div
        class="d-flex flex-column justify-center align-center"
        style="height: 100%"
      >
        <span class="title pb-6">Мобильная версия не готова</span>
        <svg width="150" height="77" viewBox="0 0 104 77">
          <defs>
            <path
              id="svg-b-561"
              d="M23.138 55.258c20.75-9.759 40.253-10.816 58.513-3.173C99.91 59.727 72.926 63.549.699 63.549l22.44-8.291z"
            ></path>
            <filter
              id="svg-a-561"
              width="139.3%"
              height="306.1%"
              x="-19.7%"
              y="-78.8%"
              filterUnits="objectBoundingBox"
            >
              <feOffset
                dy="4"
                in="SourceAlpha"
                result="shadowOffsetOuter1"
              ></feOffset>
              <feGaussianBlur
                in="shadowOffsetOuter1"
                result="shadowBlurOuter1"
                stdDeviation="5"
              ></feGaussianBlur>
              <feColorMatrix
                in="shadowBlurOuter1"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.0212013134 0"
              ></feColorMatrix>
            </filter>
          </defs>
          <g fill="none" fill-rule="evenodd" transform="translate(8)">
            <circle cx="50.5" cy="13.5" r="13.5" fill="#FFC422"></circle>
            <path
              stroke="#2FC14A"
              stroke-linecap="round"
              stroke-width="4"
              d="M28 23v22.635a3.434 3.434 0 0 0 3.428 3.435h3.428"
            ></path>
            <path
              stroke="#2FC14A"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="4"
              d="M35 59V30M65 49V34"
            ></path>
            <path
              stroke="#2FC14A"
              stroke-linecap="round"
              stroke-width="4"
              d="M42.1 14v22.576a3.489 3.489 0 0 1-3.485 3.488H35.13"
            ></path>
            <g transform="rotate(3 43.938 55.3)">
              <use
                fill="#000"
                filter="url(#svg-a-561)"
                xlink:href="#svg-b-561"
              ></use>
              <use fill="#FFC422" xlink:href="#svg-b-561"></use>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import EmptyLayout from '@/layouts/EmptyLayout'
import MainLayout from '@/layouts/MainLayout'

export default {
  name: 'App',
  components: {
    EmptyLayout,
    MainLayout,
  },
  computed: {
    cssProps() {
      return {
        '--v-primary': this.$vuetify.theme.themes.dark.primary,
        '--v-pantone': this.$vuetify.theme.themes.dark.pantone,
      }
    },

    ...mapState({
      message: (state) => state.alert.message,
    }),

    layout() {
      return (this.$route.meta.layout || 'empty') + '-layout'
    },
  },
  mounted() {
    const isThemeLS = JSON.parse(localStorage.getItem('prefers-color-scheme'))
    const isPCS = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (isThemeLS === null) {
      localStorage.setItem(
        'dark_theme',
        JSON.stringify(this.$vuetify.theme.dark)
      )
    }

    localStorage.setItem('prefers-color-scheme', JSON.stringify(isPCS))

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        const isThemeLS = JSON.parse(localStorage.getItem('dark_theme'))
        JSON.stringify(localStorage.setItem('prefers-color-scheme', e.matches))

        if (isThemeLS === null) {
          if (e.matches) {
            this.$vuetify.theme.dark = true
          } else {
            this.$vuetify.theme.dark = false
          }
        }
      })

    const themeLocalStorage = JSON.parse(localStorage.getItem('dark_theme'))

    if (isPCS && themeLocalStorage === null) {
      this.$vuetify.theme.dark = isPCS
      return
    }

    if (themeLocalStorage) {
      this.$vuetify.theme.dark = true
    } else {
      this.$vuetify.theme.dark = false
    }
  },
}
</script>

<style lang="scss">
body {
  overflow: hidden !important;
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;

  .v-input {
    .v-input__slot {
      box-shadow: none !important;
    }
  }

  .theme--dark.focus-background-color.v-input--is-focused {
    .v-input__slot {
      background-color: #000 !important;
    }
  }
  .theme--light.focus-background-color.v-input--is-focused {
    .v-input__slot {
      background: lighten(#949597, 20%) !important;
    }
  }
}

.fixed-alert {
  position: fixed !important;
  top: 20px;
  right: 20px;
  z-index: 999;

  & .v-icon {
    margin-right: 10px;
  }
}
.v-alert.error {
  background-color: #ff3d33;
}
.v-alert.success {
  background-color: #54bf00;
}
</style>
