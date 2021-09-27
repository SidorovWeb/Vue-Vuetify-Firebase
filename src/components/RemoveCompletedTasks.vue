<template>
  <v-btn
    class="mr-2"
    icon
    outlined
    x-small
    :ripple="false"
    color="dark"
    :disabled="!isComplitedTasks"
    @click="removeCompletedTasks"
  >
    <v-icon color="dark" small>mdi-close</v-icon>
  </v-btn>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { gettersTypes, actionsTypes } from '@/store/modules/tasks'
import { actionsTypes as profile } from '@/store/modules/profile'
import { actionsTypes as callAlertType } from '@/store/modules/alert'

export default {
  name: 'RemoveCompletedTasks',
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
    }),
    ...mapGetters({
      allTasks: gettersTypes.getTasks,
    }),
    isComplitedTasks: function () {
      return this.allTasks.filter((t) => t.complited && !t.deleteTask).length >
        0
        ? true
        : false
    },
  },
  methods: {
    removeCompletedTasks() {
      let number = 0

      ;[...this.allTasks].forEach((task) => {
        if (task.complited && !task.deleteTask) {
          this.$store.dispatch(actionsTypes.editTask, {
            ...task,
            deleteTask: true,
            timeOfDeleteTask: new Date(),
          })
          number += 1
        }
      })

      this.counterOfCompletedTasks(number)
    },

    counterOfCompletedTasks(n) {
      const count = !this.currentUser.allCompletedTasks
        ? 0
        : this.currentUser.allCompletedTasks
      const newCount = count + n
      this.$store.dispatch(profile.updateUser, {
        allCompletedTasks: newCount,
      })

      this.$store.dispatch(callAlertType.callAlert, {
        message: `Выполнено ${newCount} задач.`,
        type: 'info',
      })
    },
  },
}
</script>

<style lang="scss"></style>
