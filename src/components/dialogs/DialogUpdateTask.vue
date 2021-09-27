<template>
  <v-dialog
    v-model="isActive"
    :max-width="dialogOptions.maxWidth"
    :overlay-color="dialogOptions.overlayColor"
    :overlay-opacity="dialogOptions.overlayOpacity"
    @click:outside="updateTask"
    @keydown.esc="updateTask"
    :transition="dialogOptions.transition"
    scrollable
  >
    <v-card
      class="dialog dialog-update-task rounded-lg overflow-hidden"
      color="primary"
    >
      <my-title text="Детали задачи" :class="[isComplited ? complited : '']">
        <v-btn
          v-if="!task.complited"
          class="text-none font-weight-bold subtitle-2"
          color="accent"
          text
          rounded
          @click="complitTask"
        >
          <v-icon left>mdi-checkbox-marked-circle-outline</v-icon>
          Выполнить
        </v-btn>
      </my-title>
      <my-scroll>
        <v-card-text class="pt-8" style="height: 100%; overflow-x: hidden">
          <div :class="[isComplited ? complited : '']">
            <field
              v-model="task.title"
              placeholder="Имя задачи"
              :autofocus="!isComplited"
            ></field>

            <v-list dense color="primary">
              <!-- Priority -->
              <v-list-item class="pl-0 pr-0">
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold dark--text text--darken-3 caption mb-4 mt-2"
                    >ПРИОРИТЕТ</v-list-item-title
                  >
                  <panel-btns
                    v-if="task.priority"
                    :selectedItem="task.priority"
                    :color="task.priority.color"
                    @callDialogPriority="callDialogPriority"
                    @cleansPriority="cleansPriority"
                  ></panel-btns>
                  <div class="PanelBtns__container" v-else>
                    <btn-add @callDialogTags="callDialogPriority"></btn-add>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <!-- Category -->
              <v-list-item class="pl-0 pr-0">
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold dark--text text--darken-3 caption mb-4 mt-2"
                    >СПИСОК</v-list-item-title
                  >
                  <div class="text-left">
                    <panel-btns
                      v-if="task.category"
                      :selectedItem="task.category"
                      @callDialogPriority="callDialogCategory"
                      @cleansPriority="cleansCategory"
                    ></panel-btns>
                    <div class="PanelBtns__container" v-else>
                      <btn-add @callDialogTags="callDialogCategory"></btn-add>
                    </div>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <!-- Tags -->
              <v-list-item class="pl-0 pr-0">
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold dark--text text--darken-3 caption mb-2 mt-2"
                    >ТЕГИ</v-list-item-title
                  >
                  <div class="mb-2">
                    <v-chip
                      v-for="(tag, index) in task.tags"
                      :key="index"
                      class="active-tag mt-2 mr-2"
                      close
                      small
                      dark
                      active-class="active-tag"
                      @click:close="removeTag(index)"
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                  <div class="text-left">
                    <v-btn
                      rounded
                      class="text-none pantone font-weight-bold"
                      outlined
                      text
                      small
                      dark
                      @click="callDialogTags"
                      >Добавить</v-btn
                    >
                  </div>
                </v-list-item-content>
              </v-list-item>
              <!-- Notes -->
              <v-list-item class="pl-0 pr-0">
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold dark--text text--darken-3 caption mb-4 mt-2"
                    >ЗАМЕТКИ</v-list-item-title
                  >
                  <my-textarea
                    v-model="task.notes"
                    placeholder="Напишите сюда свои заметки"
                  ></my-textarea>
                </v-list-item-content>
              </v-list-item>
              <!-- SubTask -->
              <v-list-item class="pl-0 pr-0">
                <v-list-item-content class="sub-task">
                  <v-list-item-title
                    class="font-weight-bold dark--text text--darken-3 caption mb-4 mt-2"
                    >ПОДЗАДАЧИ</v-list-item-title
                  >
                  <sub-tasks :task="task" @subTasks="subTasks" />
                </v-list-item-content>
              </v-list-item>
              <!-- Attachments -->
              <v-list-item class="pl-0 pr-0">
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold dark--text text--darken-3 caption mb-4 mt-2"
                    >ВЛОЖЕНИЯ</v-list-item-title
                  >
                  <attachments
                    @upload="upload"
                    :taskId="task.id"
                    :attachmentsFiles="task.attachments"
                  />
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="pl-0 pr-0">
                <v-list-item-content>
                  <v-list-item-title
                    class="font-weight-bold dark--text text--darken-3 caption mb-4 mt-2"
                    >СОЗДАНО</v-list-item-title
                  >
                  {{ task.timeOfСreation | formatDate }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-actions class="justify-center">
              <v-btn
                class="text-none font-weight-bold subtitle-2"
                color="error"
                text
                rounded
                @click="deleteTask"
              >
                Удалить
              </v-btn>
            </v-card-actions>
          </div>
        </v-card-text>
      </my-scroll>
      <v-card-actions
        class="battons-bar pa-0 elevation-5"
        v-if="!task.complited"
      >
        <v-btn
          class="secondary text-none font-weight-bold subtitle-1 rounded-0"
          height="54px"
          style="flex: 1 1 100%"
          color="accent"
          type="submit"
          text
          @click="updateTask"
        >
          Выйти
        </v-btn>
      </v-card-actions>
      <v-card-actions class="battons-bar pa-0 elevation-5" v-else>
        <v-btn
          class="secondary text-none font-weight-bold subtitle-1 rounded-0"
          height="54px"
          style="flex: 1 1 100%"
          color="accent"
          type="submit"
          text
          @click="restoreTask"
        >
          Восстановить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import {
  actionsTypes as actionsDialog,
  mutationTypes as dialog,
} from '@/store/modules/dialog'
import { actionsTypes as tasks } from '@/store/modules/tasks'
import { actionsTypes as profile } from '@/store/modules/profile'
import formatDate from '@/filters/formatDate.js'
import Attachments from '@/components/Attachments'
import SubTasks from '@/components/tasks/SubTasks'
import MyTitle from '@/components/card-elements/Title.vue'
import PanelBtns from '@/components/PanelBtns.vue'
import MyTextarea from '@/components/Textarea.vue'
import Field from '@/components/Field.vue'
import BtnAdd from '@/components/BtnAdd.vue'
import { actionsTypes as callAlertType } from '@/store/modules/alert'

export default {
  name: 'DialogUpdateTask',
  props: {
    isActive: {
      type: Boolean,
      requred: true,
    },
    isLoading: {
      type: Boolean,
      requred: true,
    },
    task: {
      type: Object,
      requred: true,
    },
    dialogOptions: {
      type: Object,
      requred: true,
    },
    priority: {
      type: Object,
      requred: false,
    },
    tags: {
      type: Array,
      requred: false,
    },
    category: {
      type: Object,
      requred: false,
    },
  },
  data() {
    return {
      oldTitle: '',
      complited: 'complited',
    }
  },
  components: {
    Attachments,
    SubTasks,
    MyTitle,
    PanelBtns,
    MyTextarea,
    Field,
    BtnAdd,
  },
  filters: { formatDate },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
    }),

    isComplited: function () {
      return this.task.complited ? true : false
    },
  },
  watch: {
    priority: function (newVal) {
      this.task.priority = newVal
    },
    tags: function (newVal) {
      this.task.tags = newVal
    },
    category: function (newVal) {
      this.task.category = newVal
    },
  },
  methods: {
    updateTask() {
      if (!this.task.priority) {
        this.task.priority = {
          color: 'pantone',
          name: 'Без приоритета',
        }
      }
      if (this.task.title === '') {
        this.task.title = this.oldTitle
      }

      this.$store.dispatch(tasks.editTask, this.task)
      this.$emit('closeDialog')
    },
    deleteTask() {
      this.$store.dispatch(tasks.editTask, {
        ...this.task,
        deleteTask: true,
        timeOfDeleteTask: new Date(),
      })

      this.$emit('closeDialog')
      this.counterOfCompletedTasks()
    },

    counterOfCompletedTasks() {
      const newCount = this.currentUser.allCompletedTasks + 1

      this.$store.dispatch(profile.updateUser, {
        allCompletedTasks: newCount,
      })

      this.$store.dispatch(callAlertType.callAlert, {
        message: `Выполнено ${newCount} задач.`,
        type: 'info',
      })
    },

    callDialogPriority() {
      this.$store.commit(dialog.dialogPriority, true)
    },
    cleansPriority() {
      this.task.priority = null
      this.$emit('updatePriority', null)
    },
    callDialogTags() {
      this.$store.commit(dialog.dialogTags, true)
    },
    removeTag(index) {
      const newTags = this.task.tags.filter(
        (item) => item != this.task.tags[index]
      )
      this.$emit('updateTags', newTags)
    },
    callDialogCategory() {
      this.$store.commit(dialog.dialogCategory, true)
    },
    cleansCategory() {
      this.task.category = null
      this.$emit('updateCategory', null)
    },
    complitTask() {
      this.$store.dispatch(actionsDialog.closeDialog)
      this.$store.dispatch(tasks.editTask, {
        ...this.task,
        complited: true,
      })
    },
    restoreTask() {
      this.$store.dispatch(tasks.editTask, {
        ...this.task,
        complited: false,
      })
      this.task.complited = false
      this.task.deleteTask = false
      this.task.timeOfDeleteTask = null
    },
    upload(files) {
      if (files !== null) {
        this.$store.dispatch(tasks.editTask, {
          ...this.task,
          attachments: [...files],
        })
        this.task.attachments = [...files]
      }
    },
    subTasks(subTasks) {
      if (subTasks !== null) {
        this.$store.dispatch(tasks.editTask, {
          ...this.task,
          subTasks: [...subTasks],
        })
        this.task.subTasks = [...subTasks]
      }
    },
  },

  mounted() {
    this.$emit('updateTags', this.task.tags)
  },
}
</script>

<style lang="scss">
.dialog-update-task {
  & .complited {
    pointer-events: none;
    -webkit-user-select: none;
    user-select: none;
    opacity: 0.3;
  }
}
.dialog {
  position: relative;
  & .battons-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
  }
}
</style>
