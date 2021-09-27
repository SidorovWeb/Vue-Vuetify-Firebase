<template>
  <div
    class="view_content"
    style="position: relative; max-width: 800px; width: 100%; margin: auto"
  >
    <div
      class="toolbar d-flex primary rounded-pill px-4 elevation-4 mb-7 align-center"
      style="width: fit-content"
    >
      <div class="toolbar__title title mr-5 py-2 font-weight-bold">
        <v-skeleton-loader
          width="280px"
          v-if="isLoading"
          v-bind="attrs"
          type="text"
        ></v-skeleton-loader>
        <div v-else class="toolbar__title-text">
          {{ tollbarTitle || this.$route.query.name }}
        </div>
      </div>
      <remove-completed-tasks />

      <sort-menu />
    </div>
    <tasks><quick-add /></tasks>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { actionsTypes as lists } from '@/store/modules/lists'
import Tasks from '@/components/tasks/Tasks'
import QuickAdd from '@/components/QuickAdd'
import SortMenu from '@/components/SortMenu'
import RemoveCompletedTasks from '@/components/RemoveCompletedTasks'
import moment from 'moment'

export default {
  name: 'Home',
  components: {
    Tasks,
    QuickAdd,
    RemoveCompletedTasks,
    SortMenu,
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
      return this.currentUser ? this.currentUser.name : null
    },

    tollbarTitle: function () {
      if (this.userName && this.currentUser.name && this.$route.path === '/') {
        return `${this.greeting}, ${this.currentUser.name
          .split(' ')
          .shift()} 👋`
      } else {
        return this.$route.params.name
      }
    },
    greeting() {
      let message = null
      const time = moment().format('kk')

      if (time > 4 && time < 13) {
        message = 'Доброе утро'
      } else if (time > 12 && time < 17) {
        message = 'Добрый день'
      } else if (time > 16 && time < 24) {
        message = 'Добрый вечер'
      } else if (time > 23 || time < 5) {
        message = 'Доброй ночи'
      }
      return message
    },
  },

  mounted() {
    this.$store.dispatch(lists.fetchLists)
  },
}
</script>

<style lang="scss">
.v-height-100 {
  height: 100%;
}
.view_content {
  z-index: 2;
}

.toolbar {
  &__title {
    position: relative;
    padding-right: 20px;
    max-width: 500px;
    white-space: nowrap;

    &::before {
      content: '';
      position: absolute;
      width: 1px;
      height: 20px;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background-color: grey;
    }
  }
}
</style>
