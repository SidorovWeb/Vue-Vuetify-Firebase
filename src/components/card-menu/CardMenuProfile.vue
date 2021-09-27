<template>
  <div class="CardMenuProfile">
    <v-card color="primary" elevation="0">
      <v-card-title
        class="CardMenu-title secondary font-weight-bold subtitle-1 py-3 shadow"
        @click="toLink({ path: '/', direction: 'right' })"
      >
        <v-icon class="mr-2" color="dark"> mdi-chevron-left </v-icon>
        Мой профиль
      </v-card-title>
      <my-scroll>
        <v-card-text class="pa-0" style="max-height: calc(100vh - 212px)">
          <div class="d-flex flex-column align-center py-4">
            <v-list-item-avatar
              width="60px"
              height="60px"
              class="CardMenuProfile__avatar profile__avatar mr-0"
            >
              <user-photo :isDownload="false" />
            </v-list-item-avatar>

            <v-list-item-title
              class="font-weight-bold text-subtitle-1 text-none mb-0"
            >
              {{ currentUser.name }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-subtitle-2">{{
              currentUser.email
            }}</v-list-item-subtitle>
          </div>
          <v-list color="primary">
            <v-list-item
              v-for="(item, index) in array"
              :key="index"
              @click="toLink(item)"
              :ripple="false"
            >
              <v-list-item-content>
                <v-list-item-title class="dark--text subtitle-2">{{
                  item.name
                }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon color="dark"> mdi-chevron-right </v-icon>
              </v-list-item-action>
              <my-divider :index="index" :array="array" />
            </v-list-item>
          </v-list>
        </v-card-text>
      </my-scroll>
      <v-card-actions class="justify-center primary">
        <v-btn
          class="text-none subtitle-2 mb-2"
          color="dark"
          text
          rounded
          @click="logout"
          :ripple="false"
        >
          Выйти
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { actionsTypes } from '@/store/modules/auth'
import { actionsTypes as cardMenu } from '@/store/modules/cardMenu'
import UserPhoto from '@/components/user/Photo.vue'
import MyDivider from '@/components/MyDivider.vue'

export default {
  name: 'CardMenuProfile',
  props: {},
  components: {
    UserPhoto,
    MyDivider,
  },
  data() {
    return {
      array: [
        { name: 'Сбросить пароль', path: 'reset', direction: 'left' },
        { name: 'Удалить аккаунт', path: 'delete', direction: 'left' },
      ],
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
    }),
  },
  methods: {
    toLink({ path, direction }) {
      this.$store.dispatch(cardMenu.setCardMenu, {
        path,
        direction,
      })
    },
    logout() {
      this.$store
        .dispatch(actionsTypes.logout)
        .then(() => this.$router.push({ name: 'login' }))
    },
  },
}
</script>
