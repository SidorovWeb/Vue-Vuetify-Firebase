<template>
  <v-expansion-panel class="PanelCategoryList">
    <v-expansion-panel-header
      color="primary"
      v-ripple="true"
      class="px-4 font-weight-bold text-h6 dark--text"
      style="min-height: auto; height: 40px !important"
    >
      Списки
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
          v-for="(item, index) in combinedList"
          :key="index"
          dense
          @click="onLink(item.name)"
          :class="[$route.params.name === `${item.name}` ? 'isActive' : '']"
          :ripple="false"
        >
          <v-list-item-title class="font-weight-bold dark--text text--darken-3">
            {{ item.name }}
            <v-badge
              v-if="item.quantity"
              class="ml-2 white--text"
              color="pantone "
              :content="item.quantity"
            ></v-badge>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { getUniqueList } from '@/helpers/getUniqueList.js'
import { getDuplicateList } from '@/helpers/getDuplicateList.js'
import { getCombineList } from '@/helpers/getCombineList.js'
import { mapState, mapGetters } from 'vuex'
import { gettersTypes } from '@/store/modules/tasks'

export default {
  name: 'PanelCategoryList',
  data() {
    return {
      attrs: {
        boilerplate: true,
      },
    }
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.tasks.isLoading,
    }),
    ...mapGetters({
      getTasks: gettersTypes.getTasks,
    }),

    getCategoryList() {
      const list = []
      this.getTasks.forEach((item) => {
        if (item.category && !item.complited) list.push(item.category)
      })

      return list
    },

    uniqueList: function () {
      return getUniqueList(this.getCategoryList, 'name')
    },

    duplicateList() {
      return getDuplicateList(this.getCategoryList, 'name')
    },

    combinedList: function () {
      return getCombineList(this.uniqueList, this.duplicateList, 'name')
    },
  },

  methods: {
    onLink(name) {
      if (this.$route.params.name !== name) {
        this.$router
          .replace({
            name: 'category',
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
