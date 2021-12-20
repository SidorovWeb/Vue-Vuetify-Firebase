<template>
  <v-expansion-panel class="PanelShortCutsList">
    <v-expansion-panel-header
      color="primary"
      v-ripple="true"
      class="px-4 font-weight-bold text-h6 dark--text"
      style="min-height: auto; height: 40px !important"
    >
      Ярлыки
    </v-expansion-panel-header>
    <v-expansion-panel-content color="primary">
      <v-list color="primary">
        <v-list-item
          dense
          @click="onLink('Сегодня')"
          :class="[$route.path === `/days/today` ? 'isActive' : '']"
          :ripple="false"
        >
          <v-list-item-title class="font-weight-bold dark--text text--darken-3">
            Сегодня
            <v-badge v-if="today.length" class="ml-2 white--text" color="pantone" :content="today.length"></v-badge>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          dense
          @click="onLink('Последнии 7 дней')"
          :class="[$route.path === `/days/seven` ? 'isActive' : '']"
          :ripple="false"
        >
          <v-list-item-title class="font-weight-bold dark--text text--darken-3">
            Последнии 7 дней
            <v-badge
              v-if="lastSevenDays.length"
              class="ml-2 white--text"
              color="pantone"
              :content="lastSevenDays.length"
            ></v-badge>
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          dense
          @click="onLink('Все задачи')"
          :class="[$route.path === `/days/all` ? 'isActive' : '']"
          :ripple="false"
        >
          <v-list-item-title class="font-weight-bold dark--text text--darken-3">
            Все задачи
            <v-badge
              class="ml-2 white--text"
              color="pantone"
              :content="getActiveTasks.length ? getActiveTasks.length : '0'"
            ></v-badge>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapGetters } from 'vuex'
import { gettersTypes } from '@/store/modules/tasks'
import moment from 'moment'

export default {
  name: 'PanelShortCutsList',
  computed: {
    ...mapGetters({
      getTasks: gettersTypes.getTasks,
    }),

    getActiveTasks() {
      return this.getTasks.filter((todo) => !todo.complited)
    },
    today: function () {
      return [...this.getTasks].filter((item) => {
        let time

        if (item.timeOfСreation instanceof Date) {
          let a = moment(item.timeOfСreation)
          time = a.toDate()
        } else {
          time = item.timeOfСreation.toDate()
        }

        return !item.complited && moment(time).format('L') === moment().format('L')
      })
    },
    lastSevenDays: function () {
      return [...this.getTasks].filter((item) => {
        if (!item.complited) {
          const array = [0, 1, 2, 3, 4, 5, 6, 7]
          const dateDeleteTask = this.correctDate(item.timeOfСreation, 'YYYY-MM-DD')
          const todayDate = moment().format('YYYY-MM-DD')

          const date1 = moment(dateDeleteTask)
          const date2 = moment(todayDate)
          const diff = date2.diff(date1, 'days')

          return array.includes(diff)
        }
      })
    },
  },
  methods: {
    onLink(name) {
      if (this.$route.path !== name) {
        this.$router
          .replace({
            name: 'days',
            params: {
              name,
            },
          })
          .catch(() => {})
      }
    },
    correctDate(item, format) {
      let time
      if (item instanceof Date) {
        let a = moment(item)
        time = moment(a.toDate())
      } else {
        time = item.toDate()
      }

      return moment(time).format(format)
    },
  },
}
</script>
