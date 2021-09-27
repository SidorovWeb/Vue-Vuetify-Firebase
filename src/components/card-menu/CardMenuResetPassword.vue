<template>
  <v-card class="CardMenuResetPassword" color="primary" elevation="0">
    <v-card-title
      class="CardMenu-title secondary font-weight-bold subtitle-1 py-3 shadow"
      @click="toLink({ path: 'profile', direction: 'right' })"
    >
      <v-icon class="mr-2" color="dark"> mdi-chevron-left </v-icon>
      Сбросить пароль
    </v-card-title>
    <my-scroll>
      <v-card-text
        class="pa-6 text-center"
        style="max-height: calc(100vh - 168px)"
      >
        <div class="dark--text subtitle-2 mb-2">
          Инструкция будет направлена на адрес:
        </div>
        <div class="font-weight-bold mb-8">{{ currentUser.email }}</div>
        <v-btn
          v-if="!isClick"
          class="font-weight-bold text-subtitle-2 text-none"
          max-width="100%"
          height="40px"
          width="100%"
          depressed
          color="accent"
          @click="resetPassword"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          Сбросить пароль
        </v-btn>
        <span v-else>Письмо отправлено на ваш Email</span>
      </v-card-text>
    </my-scroll>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { actionsTypes as cardMenu } from '@/store/modules/cardMenu'
import { actionsTypes as profile } from '@/store/modules/profile'

export default {
  name: 'CardMenuResetPassword',
  data() {
    return {
      isClick: false,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
      isSubmitting: (state) => state.profile.isSubmitting,
    }),
  },
  methods: {
    toLink({ path, direction }) {
      this.$store.dispatch(cardMenu.setCardMenu, {
        path,
        direction,
      })
    },

    resetPassword() {
      this.$store.dispatch(profile.resetPassword)
      setTimeout(() => {
        this.isClick = true
      }, 1000)
    },
  },
}
</script>

<style lang="scss"></style>
