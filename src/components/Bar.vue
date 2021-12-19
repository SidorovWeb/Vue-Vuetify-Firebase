<template>
  <v-app-bar class="v-AppBar" height="94px" color="transparent" app elevation="0">
    <v-spacer></v-spacer>
    <div class="v-AppBar__controls d-flex primary rounded-pill px-8 elevation-4">
      <transition name="insert">
        <v-btn v-if="$route.path !== '/'" icon small fab @click="goHome" color="dark">
          <v-icon>mdi-home</v-icon>
        </v-btn>
      </transition>
      <v-menu
        offset-y
        nudge-bottom="10px"
        min-width="400px"
        transition="scroll-y-reverse-transition"
        :close-on-content-click="false"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn fab icon small v-bind="attrs" v-on="on" color="dark" @click="toLink({ path: '/' })">
            <v-icon>mdi-cog-outline</v-icon>
          </v-btn>
        </template>
        <v-card class="rounded-lg overflow-hidden" color="primary">
          <v-card-title class="secondary" style="height: 52px; position: absolute; top: 0; left: 0; width: 100%">
          </v-card-title>
          <transition :name="cardPath" mode="out-in">
            <card-menu v-if="card.path === '/'" />
            <card-menu-profile v-if="card.path === 'profile'" />
            <card-menu-completed-tasks v-if="card.path === 'completedTasks'" />
            <card-menu-reset-password v-if="card.path === 'reset'" />
            <card-menu-delete-account v-if="card.path === 'delete'" />
            <card-menu-themes v-if="card.path === 'themes'" />
            <card-menu-background v-if="card.path === 'background'" />
            <card-default-list v-if="card.path === 'defaultList'" />
          </transition>
        </v-card>
      </v-menu>
      <search />
    </div>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
import CardMenu from '@/components/card-menu/CardMenu.vue'
import CardMenuProfile from '@/components/card-menu/CardMenuProfile.vue'
import CardMenuResetPassword from '@/components/card-menu/CardMenuResetPassword.vue'
import CardMenuDeleteAccount from '@/components/card-menu/CardMenuDeleteAccount.vue'
import CardMenuThemes from '@/components/card-menu/CardMenuThemes.vue'
import CardMenuBackground from '@/components/card-menu/CardMenuBackground.vue'
import CardDefaultList from '@/components/card-menu/CardDefaultList.vue'
import CardMenuCompletedTasks from '@/components/card-menu/CardMenuCompletedTasks.vue'
import Search from '@/components/search/Search.vue'
import { actionsTypes as cardMenu } from '@/store/modules/cardMenu'

export default {
  name: 'Bar',
  components: {
    CardMenu,
    CardMenuProfile,
    CardMenuResetPassword,
    CardMenuDeleteAccount,
    CardMenuThemes,
    CardMenuBackground,
    CardDefaultList,
    CardMenuCompletedTasks,
    Search,
  },
  computed: {
    ...mapState({
      card: (state) => state.cardMenu.card,
    }),
    cardPath: function () {
      return 'slide-' + this.card.direction
    },
  },
  methods: {
    toLink({ path, direction }) {
      this.$store.dispatch(cardMenu.setCardMenu, {
        path,
        direction,
      })
    },

    goHome() {
      if (this.$route.path !== '/') {
        this.$router.push({ name: 'home' })
      }
    },
  },
}
</script>

<style lang="scss">
.slide-left-enter-active,
.slide-left-leave-active {
  transform: translateX(0);
  transition: transform 0.1s, opacity 0.3s ease-in-out;
}
.slide-left-enter,
.slide-left-leave-to {
  transform: translate(-100%);
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.1s, opacity 0.3s ease-in-out;
}
.slide-right-enter,
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.shadow {
  position: relative;
  &::before {
    position: absolute;
    content: '';
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.1);
  }
}
</style>
