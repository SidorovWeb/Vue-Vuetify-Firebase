<template>
  <v-card class="CardMenuThemes" color="primary" elevation="0">
    <v-card-title
      class="CardMenu-title secondary font-weight-bold subtitle-1 py-3 shadow"
      @click="toLink({ path: '/', direction: 'right' })"
    >
      <v-icon class="mr-2" color="dark"> mdi-chevron-left </v-icon>
      Тема
    </v-card-title>
    <my-scroll>
      <v-card-text class="pa-0" style="max-height: calc(100vh - 168px)">
        <v-list class="py-0" color="primary">
          <v-list-item-group v-model="currentPriority">
            <v-list-item
              v-for="(item, index) in themeNames"
              :key="item.name"
              @click="swithThemes(item.value)"
              :ripple="false"
            >
              <template v-slot:default="{ active }">
                <v-list-item-content>
                  <v-list-item-title class="dark--text subtitle-2">{{
                    item.name
                  }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon v-if="active" :disabled="!active" color="accent"
                    >mdi-check-circle</v-icon
                  >
                </v-list-item-action>
                <my-divider :index="index" :array="themeNames" />
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </my-scroll>
  </v-card>
</template>

<script>
import { actionsTypes as cardMenu } from '@/store/modules/cardMenu'
import { actionsTypes as profile } from '@/store/modules/profile'
import MyDivider from '@/components/MyDivider.vue'

export default {
  name: 'CardMenuThemes',
  components: {
    MyDivider,
  },
  data() {
    return {
      currentPriority: 2,
      themeNames: [
        { name: 'Авто', value: null },
        { name: 'Светлая', value: false },
        { name: 'Темная', value: true },
      ],
    }
  },

  methods: {
    toLink({ path, direction }) {
      this.$store.dispatch(cardMenu.setCardMenu, {
        path,
        direction,
      })
    },

    swithThemes(value) {
      if (value === null) {
        localStorage.removeItem('dark_theme')

        const isThemeLS = JSON.parse(
          localStorage.getItem('prefers-color-scheme')
        )

        this.$vuetify.theme.dark = isThemeLS
        return
      }

      this.$vuetify.theme.dark = value

      localStorage.setItem(
        'dark_theme',
        JSON.stringify(this.$vuetify.theme.dark)
      )

      this.$store.dispatch(profile.updateUser, {
        ...this.user,
        theme: this.$vuetify.theme.dark,
      })
    },
  },
  mounted() {
    let isTheme = JSON.parse(localStorage.getItem('dark_theme'))
    if (isTheme === null) {
      this.currentPriority = 0
      return
    }

    if (!isTheme) {
      this.currentPriority = 1
    } else {
      this.currentPriority = 2
    }
  },
}
</script>

<style lang="scss"></style>
