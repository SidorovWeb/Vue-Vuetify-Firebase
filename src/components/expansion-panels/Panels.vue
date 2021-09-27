<template>
  <div class="nav-expansion-panels pt-3 pb-4">
    <my-scroll>
      <v-expansion-panels
        class="pr-2"
        accordion
        flat
        v-model="openPanels"
        multiple
        hover
      >
        <panel-short-cuts-list />
        <panel-category-list />
        <panel-priority-list />
      </v-expansion-panels>
    </my-scroll>
  </div>
</template>

<script>
import PanelCategoryList from '@/components/expansion-panels/PanelCategoryList'
import PanelPriorityList from '@/components/expansion-panels/PanelPriorityList'
import PanelShortCutsList from '@/components/expansion-panels/PanelShortCutsList'

export default {
  name: 'ExpansionPanels',
  props: {},
  components: {
    PanelCategoryList,
    PanelPriorityList,
    PanelShortCutsList,
  },
  data() {
    return {
      openPanels: [0, 1, 2],
    }
  },
}
</script>

<style lang="scss">
.v-expansion-panel-content__wrap {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.nav-expansion-panels {
  position: relative;
  overflow-y: auto;
  height: calc(100% - 145px);
}
</style>
