<template>
  <div class="SubTasks">
    <div class="SubTasks__list" name="insert" is="transition-group">
      <div
        class="SubTasks__item"
        v-for="(item, index) in subTasks"
        :key="item.id"
        :class="[item.isComplited ? `SubTasks__complited` : '']"
      >
        <div class="SubTasks__line"></div>
        <check-icon
          className="SubTasks__btn--check"
          iconCheck="mdi-check-circle-outline"
          iconNoCheck="mdi-checkbox-blank-circle-outline"
          :isComplited="item.isComplited"
          @checked="checks(index, item.text, $event)"
        ></check-icon>
        <field
          v-model="item.text"
          placeholder="Новая задача"
          @blur="onBlur(index, item.text)"
          @enter="newSubTask"
        ></field>
        <v-btn
          class="SubTasks__btn--delete grey"
          icon
          x-small
          :ripple="false"
          color="primary"
          @click="deleteSubTask(index)"
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>
    <v-btn class="text-none d-flex justify-start" plain @click="newSubTask"
      ><v-icon left> mdi-plus </v-icon>Добавить новую подзадачу</v-btn
    >
  </div>
</template>

<script>
import Field from '@/components/Field.vue'
import CheckIcon from '@/components/CheckIcon.vue'

export default {
  name: 'SubTasks',
  props: {
    task: {
      type: Object,
      requred: true,
    },
  },
  components: {
    CheckIcon,
    Field,
  },
  data() {
    return {
      subTasks: null,
      subTaskText: '',
    }
  },
  methods: {
    newSubTask() {
      this.subTasks = this.subTasks.filter((item) => item.text !== '')
      this.subTasks.push({
        text: this.subTaskText,
        isComplited: false,
        id: Date.now(),
      })
      setTimeout(() => {
        const items = document.querySelectorAll('.SubTasks__item input')
        items[items.length - 1].focus()
      }, 0)
    },

    deleteSubTask(index) {
      this.subTasks.splice(index, 1)
      this.$emit('subTasks', this.subTasks)
    },

    checks(index, text, check) {
      if (text === '') {
        this.subTasks = this.subTasks.filter((item, i) => i !== index)
        return false
      }

      this.subTasks.map((item, i) => {
        if (i === index) {
          return (item.isComplited = check)
        }
        return item
      })

      this.$emit('subTasks', this.subTasks)
    },

    onBlur(index, text) {
      if (text === '') {
        this.subTasks = this.subTasks.filter((item, i) => i !== index)
        return false
      }
      this.$emit('subTasks', this.subTasks)
    },
  },
  mounted() {
    this.subTasks = this.task.subTasks ? this.task.subTasks : []
  },
}
</script>

<style lang="scss">
$sumPadding: calc(100% - (50px + 45px));
.SubTasks {
  &__list {
    & > * {
      margin-bottom: 10px;
    }
  }
  &__item {
    position: relative;
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
  }
  &__btn--check,
  &__btn--delete {
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
  }
  &__btn--check {
    left: 8px;
  }
  &__btn--delete {
    right: 8px;
    opacity: 0;
    transform: translate(110%, -50%);
    transition: all 0.5s;
  }
  &__item,
  &__input {
    & .v-input__slot {
      padding-left: 50px !important;
    }
  }
}
.SubTasks__complited {
  & .SubTasks__btn .v-icon {
    color: gray;
  }
  & .SubTasks__line {
    transform: scaleX(1);
  }
  & .v-input__slot {
    background-color: transparent !important;
    pointer-events: none;
  }
  & input {
    color: gray !important;
  }
  & .SubTasks__btn--delete {
    opacity: 1;
    transform: translate(0, -50%);
  }
}
</style>
