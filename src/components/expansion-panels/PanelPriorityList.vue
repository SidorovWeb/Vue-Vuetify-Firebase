<template>
  <v-expansion-panel class="PanelPriorityList">
    <v-expansion-panel-header
      color="primary"
      v-ripple="true"
      class="px-4 font-weight-bold text-h6 dark--text"
      style="min-height: auto; height: 40px !important"
    >
      Приоритет
    </v-expansion-panel-header>

    <v-expansion-panel-content color="primary">
      <div v-if="isLoading" class="ml-4">
        <div v-for="item in 6" :key="item">
          <br />
          <v-skeleton-loader
            v-bind="attrs"
            type="text"
            width="50%"
          ></v-skeleton-loader>
        </div>
      </div>
      <v-list v-else color="primary">
        <v-list-item
          v-for="(item, index) in filteredList"
          :key="index"
          dense
          @click="onLink(item.name)"
          :class="[
            $route.params.name === `${item.name}` ? 'isActive noTextColor' : '',
          ]"
          :ripple="false"
        >
          <v-list-item-title
            v-if="item.color"
            class="font-weight-bold"
            :class="item.color + '--text'"
            >{{ item.name }}
            <v-badge
              class="ml-2 white--text"
              color="pantone"
              :content="item.quantity"
            ></v-badge>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { gettersTypes } from '@/store/modules/tasks'
import { getUniqueList } from '@/helpers/getUniqueList.js'
import { getDuplicateList } from '@/helpers/getDuplicateList.js'
import { getCombineList } from '@/helpers/getCombineList.js'

export default {
  name: 'PanelPriorityList',
  data() {
    return {
      attrs: {
        boilerplate: true,
      },
      combineList: [],
    }
  },

  computed: {
    ...mapState({
      isLoading: (state) => state.tasks.isLoading,
    }),
    ...mapGetters({
      getTasks: gettersTypes.getTasks,
    }),

    getPriorityList() {
      const list = []
      this.getTasks.forEach((item) => {
        if (item.priority && !item.complited) list.push(item.priority)
      })

      return list
    },

    uniqueList() {
      return getUniqueList(this.getPriorityList, 'name')
    },

    duplicateList() {
      return getDuplicateList(this.getPriorityList, 'name')
    },

    combinedList() {
      return getCombineList(this.uniqueList, this.duplicateList, 'name')
    },

    filteredList() {
      const res = [false, false, false, false]

      this.combinedList.forEach((element) => {
        if (element['name'] === 'Высокий') {
          res.splice(0, 0, element)
        }
        if (element['name'] === 'Средний') {
          res.splice(1, 0, element)
        }
        if (element['name'] === 'Низкий') {
          res.splice(2, 0, element)
        }
        if (element['name'] === 'Без приоритета') {
          res.splice(10, 0, element)
        }
      })

      return res.filter((element) => {
        return element !== false
      })
    },
  },

  methods: {
    onLink(name) {
      if (this.$route.params.name !== name) {
        this.$router
          .replace({
            name: 'priority',
            params: {
              name,
            },
          })
          .catch(() => {})
      }
    },
  },
}
</script>

<style lang="scss">
.v-application .isActive:not(.noTextColor) {
  & .v-list-item__title {
    color: #00a4e1 !important;
  }
}
.v-application .isActive .v-badge .v-badge__badge {
  background-color: #00a4e1 !important;
  color: #fff !important;
  transition: all 0.3s;
}
</style>
