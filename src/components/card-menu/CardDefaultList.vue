<template>
  <v-card class="CardDefaultList" color="primary" elevation="0">
    <v-card-title
      class="CardMenu-title secondary font-weight-bold subtitle-1 py-3 shadow"
      @click="toLink({ path: '/', direction: 'right' })"
    >
      <v-icon class="mr-2" color="dark"> mdi-chevron-left </v-icon>
      Список по умолчанию
    </v-card-title>
    <my-scroll>
      <v-card-text class="pa-0" style="max-height: calc(100vh - 168px)">
        <v-list class="py-0" color="primary">
          <v-list-item-group v-model="currentList">
            <v-list-item
              v-for="(item, index) in list"
              :key="index"
              :ripple="false"
              @click="changeDefaultList(item.name)"
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
                <my-divider :index="index" :array="list" />
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
import { mapState } from 'vuex'
import { categoryDefaultList } from '@/helpers/categoryDefaultList.js'

export default {
  name: 'CardDefaultList',
  components: {
    MyDivider,
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
      categoryList: (state) => state.lists.data,
    }),

    defaultList: function () {
      return this.list.findIndex((item) => {
        return item.name === this.currentUser.defaultList
      })
    },

    currentList: {
      get: function () {
        return this.defaultList ?? 3
      },
      set: function () {
        return 3
      },
    },

    list: function () {
      return [...categoryDefaultList(), ...this.categoryList]
    },
  },

  methods: {
    toLink({ path, direction }) {
      this.$store.dispatch(cardMenu.setCardMenu, {
        path,
        direction,
      })
    },

    changeDefaultList(listName) {
      this.$store.dispatch(profile.updateUser, {
        defaultList: listName,
      })
    },
  },
}
</script>

<style lang="scss"></style>
