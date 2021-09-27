<template>
  <v-card class="tasks elevation-4 rounded-lg" height="100%" color="primary">
    <v-card-text class="tasks__content pa-0">
      <my-scroll>
        <v-card flat class="pl-4 pr-2" color="primary">
          <v-list class="py-6" dense color="primary">
            <div v-if="isLoading && filteredTasks.length < 1">
              <div v-for="item in 6" :key="item">
                <br />
                <v-skeleton-loader
                  width="50%"
                  v-bind="attrs"
                  type="text"
                ></v-skeleton-loader>
              </div>
            </div>

            <div
              class="subtitle-1 font-weight-bold dark--text"
              v-if="(isTasks && !isLoading) || filteredTasks.length < 1"
            >
              Нет задач
            </div>

            <transition-group
              v-if="!userSortBy"
              name="insert"
              tag="div"
              class="tasks__list"
            >
              <task
                v-for="(task, index) in filteredTasks"
                :key="task.id"
                :task="task"
                @callDialogUpdateTask="callDialogUpdateTask"
                @checkedTask="updateTask($event, index)"
                @deleteTask="deleteTask"
              />
            </transition-group>

            <div v-else>
              <div v-for="(item, idx) in filteredTasks" :key="idx">
                <div
                  v-if="$route.params.name !== item.category"
                  class="subtitle-1 font-weight-bold dark--text text--darken-3"
                >
                  {{ item.category }}
                </div>
                <transition-group
                  name="insert"
                  tag="div"
                  class="tasks__list mb-5"
                >
                  <task
                    v-for="(task, index) in item.sortedArray"
                    :key="task.id"
                    :task="task"
                    @callDialogUpdateTask="callDialogUpdateTask"
                    @checkedTask="updateTask($event, index)"
                    @deleteTask="deleteTask"
                  />
                </transition-group>
              </div>
            </div>
          </v-list>
        </v-card>
      </my-scroll>
    </v-card-text>
    <slot></slot>
  </v-card>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { actionsTypes, gettersTypes } from '@/store/modules/tasks'
import Task from '@/components/tasks/Task.vue'
import {
  actionsTypes as actionsDialog,
  mutationTypes,
} from '@/store/modules/dialog'
import moment from 'moment'

export default {
  name: 'Tasks',
  data() {
    return {
      attrs: {
        boilerplate: true,
      },
    }
  },
  components: {
    Task,
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
      isLoading: (state) => state.tasks.isLoading,
    }),

    ...mapGetters({
      getTasks: gettersTypes.getTasks,
    }),

    notDeletedTasks() {
      return this.getTasks.filter((todo) => !todo.deleteTask)
    },

    user: function () {
      return this.currentUser ? true : null
    },

    userSortBy: function () {
      return this.user ? this.currentUser.sortBy : null
    },

    isTasks: function () {
      return this.notDeletedTasks.length === 0 ? true : false
    },

    filteredTasks: function () {
      const paramsName = this.$route.params.name
      const decode = decodeURI(this.$route.path)

      if (paramsName && this.$route.path.includes('priority')) {
        const filter = [...this.notDeletedTasks].filter((item) => {
          return item.priority && item.priority.name === paramsName
        })

        if (this.user && this.currentUser.sortBy) {
          return this.sorted(filter)
        }

        return filter
      }

      if (paramsName && this.$route.path.includes('category')) {
        const filter = [...this.notDeletedTasks].filter((item) => {
          return item.category && item.category.name === paramsName
        })

        if (this.user && this.currentUser.sortBy) {
          return this.sorted(filter)
        }

        return filter
      }

      if (paramsName && decode.includes('Сегодня')) {
        const filter = [...this.notDeletedTasks].filter((item) => {
          let time

          if (item.timeOfСreation instanceof Date) {
            let a = moment(item.timeOfСreation)
            time = a.toDate()
          } else {
            time = item.timeOfСreation.toDate()
          }

          return moment(time).format('L') === moment().format('L')
        })

        if (this.user && this.currentUser.sortBy) {
          return this.sorted(filter)
        }

        return filter
      }

      if (paramsName && decode.includes('дней')) {
        const filter = [...this.notDeletedTasks].filter((item) => {
          if (!item.complited) {
            const array = [0, 1, 2, 3, 4, 5, 6, 7]
            const dateDeleteTask = this.correctDate(
              item.timeOfСreation,
              'YYYY-MM-DD'
            )
            const todayDate = moment().format('YYYY-MM-DD')

            const date1 = moment(dateDeleteTask)
            const date2 = moment(todayDate)
            const diff = date2.diff(date1, 'days')

            return array.includes(diff)
          }
        })

        if (this.user && this.currentUser.sortBy) {
          return this.sorted(filter)
        }

        return filter
      }

      if (this.user && this.currentUser.sortBy) {
        return this.sorted(this.notDeletedTasks)
      }

      return this.notDeletedTasks
    },
  },
  methods: {
    callDialogUpdateTask(task) {
      this.$store.dispatch(actionsDialog.callDialog, task).then(() => {
        this.$store.commit(mutationTypes.dialogName, 'updateTask')
      })
    },

    updateTask(task) {
      this.$store.dispatch(actionsTypes.editTask, task)
    },

    deleteTask(task) {
      this.$store.dispatch(actionsTypes.editTask, task)
    },

    sorted(array) {
      const sorted = array.reduce(function (acc, item) {
        if (item.category) {
          if (!Object.prototype.hasOwnProperty.call(acc, item.category.name)) {
            acc[item.category.name] = []
          }

          acc[item.category.name] = [...acc[item.category.name], item]
        } else {
          if (!Object.prototype.hasOwnProperty.call(acc, 'Нет категории')) {
            acc['Нет категории'] = []
          }

          acc['Нет категории'] = [...acc['Нет категории'], item]
        }

        return acc
      }, [])

      const result = Object.keys(sorted).map(function (item) {
        return {
          category: item,
          id: Math.random().toString(36).substring(7),
          sortedArray: sorted[item],
        }
      })

      return result
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
  mounted() {
    this.$store.dispatch(actionsTypes.fetchTasks)
  },
}
</script>

<style lang="scss">
.tasks {
  position: relative;

  &__list {
    display: flex;
    flex-direction: column-reverse;

    & > *:not(:last-child) {
      margin-top: 10px;
    }
  }

  &__content {
    height: calc(100vh - 266px);
    overflow-x: hidden;
    overflow-y: auto;
  }
  & .v-list-item-group {
    display: flex;
    flex-direction: column-reverse;
  }
}
.v-tabs .v-tab:hover::before,
.v-tabs .v-tab::before {
  opacity: 0 !important;
}
.v-tabs .v-tab:not(.v-tab--active):hover {
  color: #00a4e1 !important;
  transition: color 0.5s;
}

.v-badge__badge {
  color: inherit !important;
}
</style>
