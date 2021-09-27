<template>
  <div>
    <v-navigation-drawer
      app
      class="drawer elevation-4"
      color="primary"
      width="280px"
      permanent
    >
      <div class="py-3 pb-6">
        <profile />
        <div class="d-flex justify-center">
          <v-btn
            class="font-weight-bold text-subtitle-2 text-none"
            max-width="220px"
            height="40px"
            width="100%"
            depressed
            rounded
            color="accent"
            @click="createTask"
          >
            <v-icon left> mdi-plus </v-icon>
            Создать задачу
          </v-btn>
        </div>
      </div>
      <expansion-panels />
    </v-navigation-drawer>
  </div>
</template>

<script>
import { actionsTypes as dialog, mutationTypes } from '@/store/modules/dialog'
import ExpansionPanels from '@/components/expansion-panels/Panels.vue'
import Profile from '@/components/user/Profile.vue'

export default {
  name: 'NavigationDrawer',
  components: {
    ExpansionPanels,
    Profile,
  },

  methods: {
    createTask() {
      this.$store.dispatch(dialog.callDialog, this.task).then(() => {
        this.$store.commit(mutationTypes.dialogName, 'createTask')
      })
    },
  },
}
</script>

<style lang="scss">
.drawer {
  & .v-navigation-drawer__content {
    overflow: hidden !important;
  }
}

.v-navigation-drawer__border {
  background-color: transparent !important;
}
</style>
