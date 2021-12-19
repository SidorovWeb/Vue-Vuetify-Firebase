<template>
  <v-list class="d-flex pt-0 mb-2 profile">
    <v-list-item class="d-flex justify-center" style="flex: none">
      <v-list-item-avatar class="profile__avatar mr-0" width="40px">
        <photo />
      </v-list-item-avatar>
    </v-list-item>

    <v-hover v-slot="{ hover }">
      <v-list-item class="pl-0 pr-6">
        <v-list-item-content>
          <v-list-item-title class="mb-0">
            <v-skeleton-loader v-if="isLoading" v-bind="attrs" type="text"></v-skeleton-loader>
            <v-btn v-else class="px-0 text-none no-background-hover" height="28px" text @click="updateName">
              <span class="font-weight-bold text-subtitle-1 px-0 text-none ellipes">{{ userName }}</span>
            </v-btn>
          </v-list-item-title>

          <v-list-item-subtitle class="ellipes text-subtitle-2">
            <v-skeleton-loader class="mt-2" v-if="isLoading" v-bind="attrs" type="text"></v-skeleton-loader>
            <div v-else>{{ userEmail }}</div>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-fade-transition>
          <div v-if="hover" style="position: absolute; right: 20px; top: 0">
            <v-btn elevation="0" fab x-small color="transparent" @click="updateName">
              <v-icon color="accent"> mdi-pencil </v-icon>
            </v-btn>
          </div>
        </v-fade-transition>
      </v-list-item>
    </v-hover>
  </v-list>
</template>

<script>
import { mapState } from 'vuex'
import { actionsTypes as dialog, mutationTypes } from '@/store/modules/dialog'
import Photo from '@/components/user/Photo'

export default {
  name: 'Profile',
  components: {
    Photo,
  },
  data() {
    return {
      attrs: {
        boilerplate: true,
      },
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
      isLoading: (state) => state.profile.isLoading,
    }),

    userName: function () {
      return this.currentUser ? this.currentUser.name : 'Ваше имя'
    },

    userEmail: function () {
      return this.currentUser ? this.currentUser.email : ''
    },
  },
  methods: {
    updateName() {
      this.$store.dispatch(dialog.callDialog, this.task).then(() => {
        this.$store.commit(mutationTypes.dialogName, 'updateName')
      })
    },
  },
}
</script>

<style lang="scss">
.profile {
  &__avatar {
    opacity: 1;
    transition: opacity 0.3s;
    &:hover {
      opacity: 0.5;
    }
  }
  &__icon {
    font-size: 20px !important;
  }
}

.no-background-hover::before {
  background-color: transparent !important;
}
</style>
