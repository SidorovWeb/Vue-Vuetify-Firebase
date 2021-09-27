<template>
  <v-card
    class="CardMenuBackground"
    :class="'CardMenuBackground--' + theme"
    color="primary"
    elevation="0"
  >
    <v-card-title
      class="CardMenu-title secondary font-weight-bold subtitle-1 py-3 shadow"
      @click="toLink({ path: '/', direction: 'right' })"
    >
      <v-icon class="mr-2" color="dark"> mdi-chevron-left </v-icon>
      Фон
    </v-card-title>
    <my-scroll>
      <v-card-text style="max-height: calc(100vh - 152px)">
        <v-row class="">
          <v-col
            class="py-2"
            v-for="(item, idx) in thumbnails"
            :key="idx"
            cols="12"
            md="6"
          >
            <div
              :class="item.img === currentImg ? 'active' : ''"
              :data-img="item.img ? item.img : '0'"
              class="CardMenuBackground__btn rounded-lg"
              :style="backgroundImageSrc(item.img)"
              @click="chengeBackround(item.img)"
            >
              <span
                v-if="item.img === ''"
                class="CardMenuBackground__thumbnail__text text-h6 font-weight-bold"
                >Спокойствие</span
              >
              <span class="CardMenuBackground__thumbnail__sizer"></span>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </my-scroll>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { actionsTypes as cardMenu } from '@/store/modules/cardMenu'
import { actionsTypes as profile } from '@/store/modules/profile'

export default {
  name: 'CardMenuBackground',
  data() {
    return {
      thumbnails: [
        { img: '' },
        { img: '2.webp' },
        { img: '3.webp' },
        { img: '4.webp' },
        { img: '5.webp' },
        { img: '6.webp' },
        { img: '7.webp' },
        { img: '8.webp' },
        { img: '9.webp' },
        { img: '10.webp' },
      ],
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
      img: (state) => state.profile.imgBackground,
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
  },
  methods: {
    toLink({ path, direction }) {
      this.$store.dispatch(cardMenu.setCardMenu, {
        path,
        direction,
      })
    },

    backgroundImageSrc(img) {
      if (img === '') {
        return ''
      }

      return {
        backgroundImage: `url(${require(`@/assets/themes/${this.theme}/` +
          img)})`,
      }
    },

    chengeBackround(img) {
      const AppImage = document.querySelector('.AppImage')
      const newImg = new Image()
      const imgs = document.querySelectorAll('.AppImage__img')
      const btns = document.querySelectorAll('.CardMenuBackground__btn')

      btns.forEach((item) => {
        item.classList.remove('active')
      })

      if (img === '') {
        if (imgs.length > 0) {
          imgs[0].classList.add('AppImage--fadeOut')
          document.querySelector(`[data-img='0']`).classList.add('active')
        }

        setTimeout(() => {
          imgs.forEach((item) => {
            item.remove()
          })
        }, 500)

        this.$store.dispatch(profile.updateUser, {
          ...this.user,
          imgBackground: null,
        })
        return false
      }

      if (imgs.length > 0 && img === imgs[0].dataset.background) {
        return false
      }

      newImg.src = require(`@/assets/themes/${this.theme}/` + img)
      newImg.classList.add('AppImage__img')
      newImg.setAttribute('alt', 'Фон')
      newImg.setAttribute('data-background', img)
      AppImage.append(newImg)

      if (imgs.length > 0) {
        imgs[0].classList.add('AppImage--fadeOut')
        setTimeout(() => {
          newImg.classList.add('AppImage--fadeIn')
          imgs[0].remove()
        }, 500)
      } else {
        newImg.classList.add('AppImage--fadeIn')
      }

      const dataImg = document.querySelector(`[data-img='${img}']`)
      if (dataImg) {
        document.querySelector(`[data-img='${img}']`).classList.add('active')
      }

      this.$store.dispatch(profile.updateUser, {
        ...this.user,
        imgBackground: img,
      })
    },
  },
  mounted() {
    if (this.currentImg === null) {
      document.querySelector(`[data-img='0']`).classList.add('active')
    }
  },
}
</script>

<style lang="scss">
.CardMenuBackground--light {
  .CardMenuBackground__btn {
    background-color: var(--v-background-base, #e3e3e36b) !important;
  }
}

.CardMenuBackground--dark {
  .CardMenuBackground__btn {
    background-color: var(--v-background-base, #000) !important;
  }
}

.CardMenuBackground {
  &__btn {
    width: 100%;
    position: relative;
    background-color: #000;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: 0 0 0 2px transparent !important;
    transition: 0.3s;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 0 1px var(--v-primary) !important;
    }

    &:active {
      box-shadow: 0 0 0 2px var(--v-primary) !important;
    }

    &.v-item--active,
    &.active {
      box-shadow: 0 0 0 2px var(--v-primary) !important;
    }
  }

  &__thumbnail__sizer {
    display: block;
    padding-bottom: 62.5%;
  }

  &__thumbnail__text {
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;

    line-height: 1;
  }
}
</style>
