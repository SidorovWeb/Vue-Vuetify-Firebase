<template>
  <v-menu
    class="SortMenu"
    offset-y
    left
    nudge-bottom="20px"
    min-width="320px"
    transition="scroll-y-reverse-transition"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        width="24px"
        height="24px"
        icon
        :ripple="false"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon color="dark">mdi-swap-vertical</v-icon>
      </v-btn>
    </template>
    <v-card class="rounded-lg overflow-hidden">
      <v-list color="secondary">
        <v-list-item class="text-subtitle-2">
          <v-icon class="mx-2">mdi-sort</v-icon>
          Сортировать по
          <v-btn
            class="ml-auto text-none text-subtitle-2"
            text
            :ripple="false"
            color="accent"
            @click="sortingList((sort = !sort))"
          >
            <span v-if="sort">Спискам</span>
            <span v-else>Категории</span></v-btn
          >
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
import { actionsTypes as profile } from '@/store/modules/profile'
import { mapState } from 'vuex'

export default {
  name: 'SortMenu',
  data() {
    return {
      sort: null,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
    }),
  },
  methods: {
    sortingList(sort) {
      this.$store.dispatch(profile.updateUser, {
        sortBy: Number(sort),
      })
    },
  },
  mounted() {
    let timer = setInterval(() => {
      if (this.currentUser.sortBy) {
        this.sort =
          this.currentUser.sortBy === 0 ? this.currentUser.sortBy : true
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

<style lang="scss"></style>
