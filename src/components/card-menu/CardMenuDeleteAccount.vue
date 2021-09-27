<template>
  <v-card class="CardMenuDeleteAccount" color="primary" elevation="0">
    <v-card-title
      class="CardMenu-title secondary font-weight-bold subtitle-1 py-3 shadow"
      @click="toLink({ path: 'profile', direction: 'right' })"
    >
      <v-icon class="mr-2" color="dark"> mdi-chevron-left </v-icon>
      Удалить аккаунт
    </v-card-title>
    <my-scroll>
      <v-card-text
        class="px-5 pt-6 text-center font-weight-bold"
        style="max-height: calc(100vh - 168px)"
      >
        <div class="error--text mb-6" style="max-width: 200px; margin: 0 auto">
          Это навсегда удалит все ваши задачи и историю.
        </div>
        <v-text-field
          class="no-hide-element-focus CardMenuDeleteAccount__field--border mb-6"
          v-model.trim="password"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          filled
          solo
          dense
          hide-details
          name="Password"
          label="Пароль"
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <div class="mb-2">Если вы забыли свой пароль</div>

        <v-btn
          class="font-weight-bold text-subtitle-2 text-none mb-4"
          text
          color="accent"
          @click="redirectToResetPassword"
        >
          Установить пароль
        </v-btn>
        <v-btn
          class="font-weight-bold text-subtitle-2 text-none rounded-lg mb-4"
          height="40px"
          width="100%"
          tile
          color="error"
          :disabled="!isPassword"
          @click="deleteAccount"
        >
          Удалить аккаунт
        </v-btn>
      </v-card-text>
    </my-scroll>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import { actionsTypes as cardMenu } from '@/store/modules/cardMenu'
import { actionsTypes as auth } from '@/store/modules/auth'

export default {
  name: 'CardMenuDeleteAccount',
  data() {
    return {
      password: '',
      showPassword: false,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
    }),

    isPassword: function () {
      return this.password !== '' ? true : false
    },
  },
  methods: {
    toLink({ path, direction }) {
      this.$store.dispatch(cardMenu.setCardMenu, {
        path,
        direction,
      })
    },

    deleteAccount() {
      this.$store
        .dispatch(auth.login, {
          email: this.currentUser.email,
          password: this.password,
        })
        .then((data) => {
          if (data) {
            this.$store.dispatch(auth.deleteAccount).then(() => {
              this.$router.push({ name: 'login' })
            })
          }
        })
    },

    redirectToResetPassword() {
      this.toLink({ path: 'reset', direction: 'left' })
    },
  },
}
</script>

<style lang="scss">
.v-application .no-hide-element-focus .mdi-eye-off,
.v-application .mdi-eye {
  color: var(--v-pantone) !important;
}

.CardMenuDeleteAccount__field--border {
  border: 2px solid white !important;
}
</style>
