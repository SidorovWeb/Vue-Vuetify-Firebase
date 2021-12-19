<template>
  <v-app>
    <bar />
    <navigation-drawer />
    <v-main class="pb-8 mx-4">
      <router-view></router-view>
    </v-main>
    <dialogs />
    <div v-if="layout === 'main-layout'" class="AppImage" ref="AppImage"></div>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'
import Dialogs from '@/components/dialogs/Dialogs'
import Bar from '@/components/Bar'
import NavigationDrawer from '@/components/NavigationDrawer'

export default {
  name: 'MainLayout',
  components: {
    Dialogs,
    Bar,
    NavigationDrawer,
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
    }),

    theme: function () {
      if (this.$vuetify.theme.dark) {
        return 'dark'
      } else {
        return 'light'
      }
    },

    currentImg: function () {
      if (this.currentUser.imgBackground === null) {
        return null
      } else {
        return this.currentUser.imgBackground || 2 + '.webp'
      }
    },

    layout() {
      return (this.$route.meta.layout || 'empty') + '-layout'
    },
  },

  watch: {
    theme: function () {
      this.setBackground(this.currentImg)
    },
  },
  methods: {
    setBackground(currentImg) {
      const AppImage = this.$refs.AppImage
      const newImg = new Image()

      newImg.src = require(`@/assets/themes/${this.theme}/` + currentImg)
      newImg.classList.add('AppImage__img')
      newImg.setAttribute('alt', 'Фон')
      newImg.setAttribute('data-background', currentImg)
      AppImage.append(newImg)

      if (AppImage.childNodes.length < 2) {
        newImg.classList.add('AppImage--fadeIn')
      } else {
        AppImage.firstChild.classList.add('AppImage--fadeOut')
        setTimeout(() => {
          newImg.classList.add('AppImage--fadeIn')
          AppImage.firstChild.remove()
        }, 500)
      }
    },
  },

  mounted() {
    let timer = setInterval(() => {
      if (this.currentUser) {
        this.setBackground(this.currentImg)
        clearInterval(timer)
      } else {
        setTimeout(() => {
          clearInterval(timer)
        }, 5000)
      }
    }, 1000)
  },
}
</script>

<style lang="scss">
body {
  font-family: 'Open Sans', sans-serif;
  font-weight: normal;
  .v-input {
    .v-input__slot {
      box-shadow: none !important;
    }
  }

  .focus-background-color.v-input--is-focused {
    .v-input__slot {
      background-color: #000 !important;
    }
  }
}

.AppImage {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.AppImage--fadeIn {
  animation: fadeIn 1.5s;
}
.AppImage--fadeOut {
  animation: fadeOut 1.5s;
}

.AppImage__img {
  opacity: 1;
  width: 100%;
  height: 100%;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
