<template>
  <div class="d-flex align-center pr-2">
    <v-list-item
      class="Task rounded-lg"
      :class="[isComplited ? `Task__complited` : '']"
    >
      <check-icon
        iconCheck="mdi-check-circle-outline"
        iconNoCheck="mdi-checkbox-blank-circle-outline"
        :isComplited="isComplited"
        @checked="checkedTask"
      ></check-icon>
      <div class="Task__line"></div>
      <v-list-item-content
        class="Task__content pl-3 py-1"
        @click="callDialogUpdateTask"
      >
        <v-list-item-title
          class="Task__title subtitle-1 mt-1 mb-0 font-weight-bold"
          v-text="task.title"
        ></v-list-item-title>
        <div
          v-if="!isComplited"
          class="Task__indicators d-flex justify-start align-center subtitle-2"
        >
          <span class="Task__indicator d-flex align-center">
            <span :class="colorCheckIcon"></span>
          </span>
          <span v-if="task.category" class="grey--text align-center">
            {{ task.category.name }}</span
          >
          <span v-if="task.subTasks" class="grey--text d-flex align-center">
            {{ subTaskIsComplited.length }} / {{ task.subTasks.length }}
            <v-icon class="ml-1" color="grey" small>mdi-file-tree</v-icon>
          </span>
          <span v-if="task.attachments" class="grey--text align-center">
            {{ task.attachments.length }}
            <v-icon color="grey" small style="transform: rotate(20deg)"
              >mdi-paperclip</v-icon
            >
          </span>
          <div v-if="task.tags">
            <v-chip
              class="Task__tag mr-2"
              v-for="(tag, index) in task.tags"
              :key="index"
              x-small
              :ripple="false"
            >
              {{ tag }}
            </v-chip>
          </div>
        </div>
      </v-list-item-content>
      <v-btn
        class="Task__btn--delete grey"
        icon
        x-small
        :ripple="false"
        color="primary"
        @click="deleteTask"
      >
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </v-list-item>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import CheckIcon from '@/components/CheckIcon.vue'
import { actionsTypes as profile } from '@/store/modules/profile'
import { actionsTypes as callAlertType } from '@/store/modules/alert'

export default {
  name: 'Task',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  components: { CheckIcon },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
    }),

    colorCheckIcon: function () {
      return this.task.priority ? this.task.priority.color : 'pantone'
    },

    isComplited: function () {
      return this.task.complited ? true : false
    },

    subTaskIsComplited: function () {
      return this.task.subTasks.filter((item) => item.isComplited)
    },
  },
  methods: {
    callDialogUpdateTask() {
      this.$emit('callDialogUpdateTask', this.task)
    },

    checkedTask(ischeck) {
      this.$emit('checkedTask', { ...this.task, complited: ischeck })
    },

    deleteTask() {
      this.$emit('deleteTask', {
        ...this.task,
        deleteTask: true,
        timeOfDeleteTask: new Date(),
      })

      this.counterOfCompletedTasks()
    },

    counterOfCompletedTasks() {
      const count = !this.currentUser.allCompletedTasks
        ? 0
        : this.currentUser.allCompletedTasks
      const newCount = count + 1

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

<style lang="scss">
$sumPadding: calc(100% - (50px + 45px));

.Task {
  position: relative;
  overflow: hidden;
  cursor: pointer;

  transition: background 0.2s;
  &:hover {
    background: #424242 !important;
  }

  &.theme--light {
    &:hover {
      background: lighten(#424242, 70%) !important;
    }
  }

  &__line {
    position: absolute;
    top: 50%;
    left: 50px;
    width: $sumPadding;
    background-color: gray;
    height: 1px;
    z-index: 1;
    transform: scaleX(0);
    transform-origin: top left;
    transition: all 0.5s;
    pointer-events: none;
  }
  &__content {
    position: relative;
  }
  &__priority {
    position: absolute;
    width: 4px;
    height: 50%;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
  }
  & .v-slide-group__content {
    padding-bottom: 0 !important;

    .active-tag:before {
      content: none !important;
    }
  }
  &__checkbox {
    .v-input__slot {
      margin: 0 !important;
    }
    .v-input--selection-controls__input {
      margin: 0 !important;
    }
  }

  &__indicators {
    min-height: 22px;
    & > *:not(:last-child) {
      position: relative;
      padding-right: 20px;
      &::before {
        content: '';
        position: absolute;
        width: 1px;
        height: 14px;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        background-color: grey;
      }
    }
  }

  &__indicator {
    span {
      width: 16px;
      height: 5px;
      display: inline-block;
      border-radius: 10px;
    }
  }

  &__tag {
    &::before {
      opacity: 0 !important;
    }
  }

  &__btn--delete {
    position: absolute;
    z-index: 1;
    top: 50%;
    right: 18px;
    opacity: 0;
    transform: translate(110%, -50%);
    transition: all 0.5s;
  }
}

.Task__complited {
  &.secondary.darken-1 {
    background-color: transparent !important;
    &:hover {
      background: transparent !important;
    }
  }
  & .Task__title {
    color: gray !important;
  }
  & .Task__line {
    transform: scaleX(1);
  }

  & .Task__btn--delete {
    opacity: 1;
    transform: translate(0, -50%);
  }
}
</style>
