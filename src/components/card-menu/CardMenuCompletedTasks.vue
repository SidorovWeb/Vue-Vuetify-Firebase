<template>
  <div class="CardMenuCompletedTasks">
    <v-card color="primary" elevation="0">
      <v-card-title
        class="CardMenu-title secondary font-weight-bold subtitle-1 py-3 shadow"
        @click="toLink({ path: '/', direction: 'right' })"
      >
        <v-icon class="mr-2" color="dark"> mdi-chevron-left </v-icon>
        Выполненные задания
      </v-card-title>

      <my-scroll>
        <v-card-text
          class="pa-0 CardMenuCompletedTasks__body px-6"
          style="max-height: calc(100vh - 190px)"
        >
          <div class="CardMenuCompletedTasks__header pt-4 px-2">
            <ul
              class="CardMenuCompletedTasks__list d-flex justify-space-between align-center text-center mb-6"
            >
              <li class="CardMenuCompletedTasks__item">
                <div class="grey--text subtitle-2">Все задания</div>
                <div
                  class="CardMenuCompletedTasks__number font-weight-bold title"
                >
                  {{ isCompletedTasks }}
                </div>
              </li>
              <li class="CardMenuCompletedTasks__item">
                <div class="grey--text subtitle-2">За неделю</div>
                <div
                  class="CardMenuCompletedTasks__number font-weight-bold title"
                >
                  {{ lastSevenDaysDeletedTasks.length }}
                </div>
              </li>
              <li class="CardMenuCompletedTasks__item">
                <div class="grey--text subtitle-2">Сегодня</div>
                <div
                  class="CardMenuCompletedTasks__number font-weight-bold title"
                >
                  {{ todayDeletedTasks.length }}
                </div>
              </li>
            </ul>
            <v-text-field
              class="mb-2 rounded-lg"
              v-model="search"
              placeholder="Поиск задач"
              filled
              solo
              hide-details
              dense
              prepend-inner-icon="mdi-magnify"
              color="dark"
            ></v-text-field>
          </div>

          <v-list color="primary" class="mb-4">
            <v-list-item v-if="deletedTasks.length < 1">
              <div
                class="text-center mt-2 font-weight-bold"
                style="width: 100%"
              >
                Нет выполненых задач
              </div>
            </v-list-item>
            <v-list-item v-if="sorted.length < 1 && deletedTasks.length !== 0">
              <div
                class="text-center mt-2 font-weight-bold"
                style="width: 100%"
              >
                Не найдено
              </div>
            </v-list-item>

            <v-list-item
              class="d-flex flex-column align-start mb-4"
              style="overflow: hidden; min-height: 100%"
              dense
              v-for="t in sorted"
              :key="t.id"
              :ripple="false"
              link
              inactive
            >
              <div class="subtitle-1 font-weight-bold">
                {{ t.title }}
              </div>

              <v-list color="primary" class="ma-0 pa-0" style="width: 100%">
                <v-list-item
                  class="ma-0 pa-0 d-flex justify-space-between align-center"
                  style="overflow: hidden"
                  dense
                  v-for="s in t.sortedArray"
                  :key="s.id"
                  :ripple="false"
                  link
                  inactive
                >
                  <v-btn
                    class="grey mr-3"
                    icon
                    x-small
                    :ripple="false"
                    color="primary"
                    @click="restoreTask(s)"
                  >
                    <v-icon small>mdi-restart</v-icon>
                  </v-btn>
                  <v-list-item-title class="Search__title subtitle-2">
                    {{ s.title }}
                  </v-list-item-title>
                  <span
                    v-if="s.category"
                    class="subtitle-2 pl-3"
                    style="white-space: nowrap"
                    >{{ s.category.name }}</span
                  >
                  <span
                    v-if="!s.category"
                    class="subtitle-2 pl-3"
                    style="white-space: nowrap"
                  ></span>
                </v-list-item>
              </v-list>
            </v-list-item>
          </v-list>
        </v-card-text>
      </my-scroll>
      <div class="CardMenuCompletedTasks__foorer secondary">
        <v-btn
          class="font-weight-bold text-subtitle-2 text-none"
          height="40px"
          width="100%"
          tile
          color="accent"
          @click="deletAllCompletedTasks"
        >
          Удалить выполненые задачи
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import { actionsTypes as tasks, gettersTypes } from '@/store/modules/tasks'
import { actionsTypes as cardMenu } from '@/store/modules/cardMenu'
import { actionsTypes as attachments } from '@/store/modules/attachments'
import { actionsTypes as profile } from '@/store/modules/profile'

export default {
  name: 'CardMenuCompletedTasks',
  data() {
    return {
      search: '',
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
    ...mapGetters({
      getTasks: gettersTypes.getTasks,
    }),

    deletedTasks() {
      return this.getTasks.filter((todo) => todo.deleteTask)
    },

    isCompletedTasks: function () {
      return !this.currentUser.allCompletedTasks
        ? 0
        : this.currentUser.allCompletedTasks
    },

    isCategoryName: function () {
      return ''
    },

    lastSevenDaysDeletedTasks: function () {
      return [...this.deletedTasks].filter((item) => {
        const array = [0, 1, 2, 3, 4, 5, 6, 7]
        const dateDeleteTask = this.correctDate(
          item.timeOfDeleteTask,
          'YYYY-MM-DD'
        )
        const todayDate = moment().format('YYYY-MM-DD')

        const date1 = moment(dateDeleteTask)
        const date2 = moment(todayDate)
        const diff = date2.diff(date1, 'days')

        return array.includes(diff)
      })
    },

    todayDeletedTasks: function () {
      return [...this.deletedTasks].filter((item) => {
        const dateDeleteTask = this.correctDate(
          item.timeOfDeleteTask,
          'YYYY-MM-DD'
        )
        const todayDate = moment().format('YYYY-MM-DD')

        return dateDeleteTask === todayDate
      })
    },

    sorted() {
      const self = this

      const sorted = [...this.filterTasks].reduce(function (acc, item) {
        const dateDeleteTask = self.correctDate(
          item.timeOfDeleteTask,
          'DD.MM.YY'
        )

        if (!Object.prototype.hasOwnProperty.call(acc, dateDeleteTask)) {
          acc[dateDeleteTask] = []
        }

        acc[dateDeleteTask] = [...acc[dateDeleteTask], item]

        return acc
      }, [])

      const result = Object.keys(sorted).map(function (item) {
        return {
          title: item,
          id: Math.random().toString(36).substring(7),
          sortedArray: sorted[item],
        }
      })

      return result
    },

    filterTasks() {
      return this.deletedTasks.filter((t) => {
        return t.title.toLowerCase().includes(this.search.toLowerCase())
      })
    },
  },
  methods: {
    toLink({ path, direction }) {
      this.$store.dispatch(cardMenu.setCardMenu, {
        path,
        direction,
      })
    },

    restoreTask(task) {
      this.$store.dispatch(tasks.editTask, {
        ...task,
        complited: false,
        deleteTask: false,
        timeOfDeleteTask: null,
      })

      this.counterOfCompletedTasks()
    },

    deletAllCompletedTasks() {
      this.deletedTasks.forEach((t) => {
        if (t.attachments) {
          t.attachments.forEach((el) => {
            this.$store.dispatch(attachments.delete, el.file.name)
          })
        }

        this.$store.dispatch(tasks.deleteTask, t.id)
      })
    },

    counterOfCompletedTasks() {
      const newCount = this.currentUser.allCompletedTasks - 1
      this.$store.dispatch(profile.updateUser, {
        allCompletedTasks: newCount,
      })
    },

    correctDate(item, format) {
      let time
      if (item instanceof Date) {
        let a = moment(item)
        time = moment(a.toDate())
      } else {
        time = item.toDate()
      }
      console.log()

      return moment(time).format(format)
    },
  },
}
</script>

<style lang="scss">
.CardMenuCompletedTasks {
  &__list {
    margin: 0 !important;
    padding: 0 !important;
  }
  &__item {
    list-style-type: none;
  }
}
</style>
