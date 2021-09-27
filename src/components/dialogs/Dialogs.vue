<template>
  <div>
    <!-- UPDATE NAME -->
    <dialog-update-name
      v-if="dialog === 'updateName'"
      :isActive="isActive"
      :dialogOptions="dialogOptions"
      :isSubmitting="isSubmitting"
      :user="user"
      @notUpdateName="notUpdateName"
      @updateName="updateName"
    />
    <!-- CREATE TASK-->
    <dialog-create-task
      v-if="dialog === 'createTask'"
      :isActive="isActive"
      :dialogOptions="dialogOptions"
      :isLoading="isLoading"
      :priority="priority"
      :tags="tags"
      :category="category"
      @closeDialogCreateTask="closeDialogCreateTask"
      @createTask="createTask"
      @updatePriority="updatePriority"
      @updateTags="updateTags"
      @updateCategory="updateCategory"
    />
    <!-- UPDATE TASK-->
    <dialog-update-task
      v-if="dialog === 'updateTask'"
      :isActive="isActive"
      :task="task"
      :dialogOptions="dialogOptions"
      :isLoading="isLoading"
      :priority="priority"
      :tags="tags"
      :category="category"
      @closeDialog="closeDialog"
      @updatePriority="updatePriority"
      @updateTags="updateTags"
      @updateCategory="updateCategory"
    />
    <!-- PRIORITY -->
    <dialog-priority
      v-if="isActivePriority"
      :isActivePriority="isActivePriority"
      :dialogOptions="dialogOptions"
      :priorityValue="priorityValue"
      @closeAdditionalDialog="closeAdditionalDialog"
      @updatePriority="updatePriority"
    />
    <!-- Tags -->
    <dialog-tags
      v-if="isActiveTags"
      :isActiveTags="isActiveTags"
      :dialogOptions="dialogOptions"
      :tags="tags"
      @closeAdditionalDialog="closeAdditionalDialog"
      @updateTags="updateTags"
    />
    <!-- CATEGORY -->
    <dialog-category
      v-if="isActiveCategory"
      :isActiveCategory="isActiveCategory"
      :dialogOptions="dialogOptions"
      :categoryValue="categoryValue"
      @closeAdditionalDialog="closeAdditionalDialog"
      @updateCategory="updateCategory"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { actionsTypes, mutationTypes as dialog } from '@/store/modules/dialog'
import { actionsTypes as tasks } from '@/store/modules/tasks'
import { actionsTypes as profile } from '@/store/modules/profile'
import DialogUpdateTask from '@/components/dialogs/DialogUpdateTask'
import DialogCreateTask from '@/components/dialogs/DialogCreateTask'
import DialogUpdateName from '@/components/dialogs/DialogUpdateName'
import DialogPriority from '@/components/dialogs/DialogPriority'
import DialogTags from '@/components/dialogs/DialogTags'
import DialogCategory from '@/components/dialogs/DialogCategory'

export default {
  name: 'Dialogs',
  data() {
    return {
      dialogOptions: {
        maxWidth: '450px',
        overlayColor: '#0009',
        overlayOpacity: '1',
        height: 'calc(100vh - 64px)',
        transition: 'scroll-y-transition',
      },
      priority: null,
      tags: null,
      category: null,
    }
  },
  components: {
    DialogUpdateTask,
    DialogCreateTask,
    DialogUpdateName,
    DialogPriority,
    DialogTags,
    DialogCategory,
  },
  computed: {
    ...mapState({
      user: (state) => state.profile.currentUser,
      dialog: (state) => state.dialog.dialog,
      isActive: (state) => state.dialog.isActive,
      isActivePriority: (state) => state.dialog.isDialogPriority,
      isActiveTags: (state) => state.dialog.isDialogTags,
      isActiveCategory: (state) => state.dialog.isDialogCategory,
      task: (state) => state.dialog.data,
      isSubmitting: (state) => state.profile.isSubmitting,
      isLoading: (state) => state.tasks.isLoading,
    }),

    priorityValue: function () {
      return this.task ? this.task.priority : this.priority
    },
    categoryValue: function () {
      return this.task ? this.task.category : this.category
    },
  },

  methods: {
    closeDialog() {
      return new Promise((resolve) => {
        this.$store.dispatch(actionsTypes.closeDialog)
        return resolve()
      })
    },
    closeDialogCreateTask() {
      this.$store.dispatch(actionsTypes.closeDialog)
      this.priority = null
      this.tags = null
      this.category = null
    },
    closeAdditionalDialog() {
      this.$store.commit(dialog.dialogPriority, false)
      this.$store.commit(dialog.dialogTags, false)
      this.$store.commit(dialog.dialogCategory, false)
    },
    createTask(newTask) {
      this.closeDialog().then(() => {
        this.$store.dispatch(tasks.createTask, newTask)
        this.priority = null
        this.tags = null
      })
    },
    notUpdateName(oldName) {
      this.closeDialog().then(() => {
        this.user.name = oldName.name
      })
    },
    updateName(newName) {
      this.closeDialog().then(() => {
        this.$store.dispatch(profile.updateUser, newName)
      })
    },
    updatePriority(priority) {
      this.priority = priority
    },
    updateTags(tags) {
      this.tags = tags
    },
    updateCategory(category) {
      this.category = category
    },
  },
}
</script>

<style lang="scss">
.dialog {
  padding-bottom: 54px;
}
</style>
