<template>
  <v-row class="Register">
    <v-card-text class="py-10 pr-10 pa-10">
      <h1 class="display-1 font-weight-bold text-center mb-12">Зарегистрироваться</h1>
      <v-form ref="form" @submit.prevent="submitHandler" autocomplete="off">
        <v-text-field
          v-model.trim="name"
          :rules="nameRules"
          filled
          solo
          dense
          autocomplete="new-password"
          name="Name"
          label="Имя"
          required
        ></v-text-field>
        <v-text-field
          v-model.trim="email"
          :rules="emailRules"
          filled
          solo
          dense
          autocomplete="new-password"
          name="Email"
          label="Email"
          required
        ></v-text-field>
        <v-text-field
          class="no-hide-element-focus"
          v-model.trim="password"
          :rules="passwordRules"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          filled
          solo
          dense
          name="Password"
          label="Пароль"
          autocomplete="new-password"
          required
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-row>
          <v-col class="d-flex mt-4">
            <div class="text-center pl-3 d-flex align-center">
              <router-link class="accent--text" :to="{ name: 'login' }">У меня есть аккаунта</router-link>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              :loading="isSubmitting"
              class="text-none font-weight-bold white--text px-8"
              :disabled="isSubmitting"
              type="submit"
              color="accent"
              rounded
              >Зарегистрироваться</v-btn
            >
          </v-col>
        </v-row>
        <!-- <v-btn
          class="Login__btn_google pa-2 mt-7 text-left"
          type="button"
          color="accent"
          height="auto"
          :ripple="false"
          @click="authWithGoogle"
        >
          <svg width="40" height="40" viewBox="0 0 40 40">
            <g fill="none" fill-rule="evenodd">
              <rect width="40" height="40" fill="#FFF" rx="3.2"></rect>
              <path
                fill="#D7282A"
                d="M7.54 12.984c.582-1.299 1.405-2.432 2.37-3.457 2.185-2.32 4.83-3.806 7.96-4.313 4.382-.71 8.303.337 11.692 3.295.215.187.267.296.035.527-1.197 1.187-2.374 2.394-3.558 3.593-.122.124-.204.274-.42.073-2.983-2.77-7.853-2.739-11.024.25-1.088 1.025-1.862 2.255-2.369 3.664-.074-.049-.152-.093-.221-.147-1.49-1.16-2.978-2.323-4.466-3.485"
              ></path>
              <path
                fill="#45AC43"
                d="M12.19 22.275c.429 1.101.96 2.142 1.75 3.026 2.009 2.248 4.498 3.218 7.481 2.904 1.386-.146 2.65-.621 3.829-1.352.113.102.221.212.34.306 1.381 1.093 2.764 2.183 4.146 3.274-1.524 1.468-3.324 2.444-5.348 2.963-4.773 1.223-9.173.45-13.08-2.675a13.408 13.408 0 0 1-3.78-4.776l4.663-3.67"
              ></path>
              <g transform="translate(20.192 16.688)">
                <path
                  fill="#4385F5"
                  d="M9.544 13.746C8.162 12.655 6.78 11.564 5.4 10.472c-.12-.095-.228-.205-.34-.307.935-.724 1.716-1.58 2.229-2.668.204-.434.348-.887.484-1.346.094-.317.065-.44-.322-.437-2.3.02-4.6.01-6.901.01-.488 0-.488 0-.488-.51 0-1.581.007-3.162-.007-4.742C.052.167.104.05.443.052c4.243.012 8.486.009 12.73.003.229 0 .373.017.413.3.527 3.76.104 7.355-1.838 10.674-.595 1.016-1.31 1.944-2.204 2.717"
                ></path>
              </g>
              <path
                fill="#F4C300"
                d="M12.19 22.275l-4.663 3.67c-.759-1.43-1.197-2.967-1.4-4.568-.355-2.773.034-5.441 1.195-7.986.064-.14.144-.271.217-.407l4.466 3.485c.07.054.147.098.221.147-.624 1.883-.592 3.77-.035 5.66"
              ></path>
            </g>
          </svg>
          <div class="login__btn-container-tetx pl-5 text-none">
            <div class="login__btn-tetx font-weight-bold text-left mb-2">
              Войти с использованием Google
            </div>
            <div class="login__btn-tetx">Безопасный вход</div>
          </div>
        </v-btn> -->
      </v-form>
    </v-card-text>
  </v-row>
</template>

<script>
import { mapState } from 'vuex'
import { actionsTypes } from '@/store/modules/auth'
import { actionsTypes as alert } from '@/store/modules/alert'

export default {
  name: 'Register',
  data: () => ({
    valid: true,
    name: '',
    nameRules: [],
    email: '',
    emailRules: [],
    password: '',
    passwordRules: [],
    showPassword: false,
  }),
  computed: {
    ...mapState({
      isSubmitting: (state) => state.auth.isSubmitting,
      validationErrors: (state) => state.auth.validationErrors,
    }),
  },
  watch: {
    name() {
      this.nameRules = []
    },
    email() {
      this.emailRules = []
    },
    password() {
      this.passwordRules = []
    },
  },
  methods: {
    // authWithGoogle() {
    //   this.$store.dispatch(actionsTypes.loginWithGoogle)
    // },

    submitHandler() {
      this.nameRules = [(v) => !!v || 'Name is required', (v) => (v && v.length >= 5) || `Name must have 5+ characters`]
      this.emailRules = [(v) => !!v || 'E-mail is required', (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid']
      this.passwordRules = [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must have 6+ characters',
      ]

      setTimeout(() => {
        if (this.$refs.form.validate()) {
          this.$store
            .dispatch(actionsTypes.register, {
              name: this.name,
              email: this.email,
              password: this.password,
            })
            .then(() => {
              if (!this.validationErrors && this.name) {
                this.$router.push({ name: 'home' }).catch(() => {})
              } else {
                this.$store.dispatch(alert.callAlert, {
                  message: this.validationErrors,
                  type: 'error',
                })
              }
            })
        }
      }, 0)
    },
  },
}
</script>

<style lang="scss">
.v-application .no-hide-element-focus .mdi-eye-off,
.v-application .mdi-eye {
  color: var(--v-pantone) !important;
}
</style>
