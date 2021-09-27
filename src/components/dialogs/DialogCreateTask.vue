<template>
  <v-dialog
    v-model="isActive"
    :height="dialogOptions.height"
    max-width="600px"
    :overlay-color="dialogOptions.overlayColor"
    :overlay-opacity="dialogOptions.overlayOpacity"
    @click:outside="$emit('closeDialogCreateTask', '')"
    @keydown.esc="$emit('closeDialogCreateTask', '')"
    scrollable
    :transition="dialogOptions.transition"
  >
    <v-card class="DialogCreateTask rounded-lg overflow-hidden" color="primary">
      <my-scroll>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <v-form
                ref="form"
                @submit.prevent="createTask"
                class="flex-grow-1"
              >
                <v-list color="primary">
                  <v-list-item class="px-0">
                    <v-list-item-content>
                      <v-list-item-title
                        class="font-weight-bold dark--text text--darken-3 caption mb-4"
                        >ЗАГОЛОВОК</v-list-item-title
                      >
                      <field
                        className="title-field"
                        v-model="title"
                        placeholder="Я хочу"
                        :autofocus="focusTitle"
                      ></field>
                    </v-list-item-content>
                  </v-list-item>

                  <v-list-item class="px-0">
                    <v-list-item-content>
                      <v-list-item-title
                        class="font-weight-bold dark--text text--darken-3 caption mb-4 mt-2"
                        >ЗАМЕТКИ</v-list-item-title
                      >
                      <my-textarea
                        v-model="notes"
                        placeholder="Напишите сюда свои заметки"
                      ></my-textarea>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-form>
            </v-col>
            <v-col cols="12" md="4">
              <v-list class="DialogCreateTask__list" dense color="primary">
                <v-list-item class="px-0 mb-2">
                  <v-list-item-content class="text-left">
                    <v-list-item-title
                      class="font-weight-bold dark--text text--darken-3 caption mb-2"
                      >ТЕГИ</v-list-item-title
                    >
                    <div multiple column class="chip-group mb-2">
                      <v-chip
                        v-for="(tag, index) in newArrayTags"
                        :key="index"
                        class="active-tag mr-2 mb-2"
                        close
                        small
                        dark
                        active-class="active-tag"
                        @click:close="removeTag(index)"
                      >
                        {{ tag }}
                      </v-chip>
                    </div>
                    <div>
                      <btn-add @callDialogTags="callDialogTags"></btn-add>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="px-0 mb-2">
                  <v-list-item-content class="text-left">
                    <v-list-item-title
                      class="font-weight-bold dark--text text--darken-3 caption mb-2"
                      >СПИСОК</v-list-item-title
                    >
                    <panel-btns
                      v-if="newCategory"
                      :selectedItem="newCategory"
                      @callDialogPriority="callDialogCategory"
                      @cleansPriority="cleansCategory"
                    ></panel-btns>
                    <div class="PanelBtns__container" v-else>
                      <btn-add @callDialogTags="callDialogCategory"></btn-add>
                    </div>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item class="px-0 mb-2">
                  <v-list-item-content class="text-left">
                    <v-list-item-title
                      class="font-weight-bold dark--text text--darken-3 caption mb-2"
                      >ПРИОРИТЕТ</v-list-item-title
                    >
                    <panel-btns
                      v-if="newPriority"
                      :selectedItem="newPriority"
                      :color="newPriority.color"
                      @callDialogPriority="callDialogPriority"
                      @cleansPriority="cleansPriority"
                    ></panel-btns>
                    <div class="PanelBtns__container" v-else>
                      <btn-add @callDialogTags="callDialogPriority"></btn-add>
                    </div>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>
      </my-scroll>
      <v-card-actions class="pa-0 elevation-5">
        <v-btn
          class="secondary text-none font-weight-bold subtitle-1 rounded-0"
          height="54px"
          style="flex: 1 1 100%"
          color="accent"
          type="submit"
          text
          @click="createTask"
        >
          Добавить задачу
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mutationTypes as dialog } from '@/store/modules/dialog'
import MyTextarea from '@/components/Textarea.vue'
import BtnAdd from '@/components/BtnAdd.vue'
import PanelBtns from '@/components/PanelBtns.vue'
import Field from '@/components/Field.vue'
import { mapState } from 'vuex'

export default {
  name: 'DialogCreateTask',
  props: {
    isActive: {
      type: Boolean,
      requred: true,
    },
    isLoading: {
      type: Boolean,
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
  components: {
    MyTextarea,
    BtnAdd,
    PanelBtns,
    Field,
  },
  data() {
    return {
      title: '',
      focusTitle: true,
      notes: '',
      newArrayTags: null,
      newPriority: null,
      newCategory: null,
    }
  },
  watch: {
    tags: function (newState) {
      this.newArrayTags = newState
    },
    priority: function (newState) {
      this.newPriority = newState
    },
    category: function (newState) {
      this.newCategory = newState
    },
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
    }),

    defaultList: function () {
      return this.currentUser.defaultList
    },
  },
  methods: {
    createTask() {
      if (this.title) {
        if (!this.newPriority) {
          this.newPriority = {
            color: 'pantone',
            name: 'Без приоритета',
            id: Math.random().toString(36).substring(7),
          }
        }
        this.$emit('createTask', {
          title: this.title,
          notes: this.notes,
          priority: this.newPriority,
          tags: this.newArrayTags,
          category: this.newCategory,
        })
        this.$refs.form.reset()
      } else {
        document.querySelector('.title-field input').focus()
      }
    },
    callDialogPriority() {
      this.$store.commit(dialog.dialogPriority, true)
    },
    callDialogTags() {
      this.$store.commit(dialog.dialogTags, true)
      this.$emit('updateTags', this.newArrayTags)
    },
    cleansPriority() {
      this.$emit('updatePriority', null)
    },
    cleansCategory() {
      this.$emit('updateCategory', null)
    },
    removeTag(index) {
      const newTags = this.newArrayTags.filter(
        (item) => item != this.newArrayTags[index]
      )
      this.$emit('updateTags', newTags)
    },
    callDialogCategory() {
      this.$store.commit(dialog.dialogCategory, true)
    },
  },
  mounted() {
    this.newArrayTags = []
    this.newPriority = null
    this.newCategory = null

    if (this.defaultList) {
      this.newCategory = {
        name: this.defaultList,
        color: 'accent',
        id: Math.random().toString(36).substring(7),
      }
    }
  },
}
</script>

<style lang="scss">
.v-slide-group__content {
  padding: 0 !important;
}

.DialogCreateTask {
  &__list {
    position: relative;

    &::before {
      position: absolute;
      content: '';
      width: 1px;
      height: 90%;
      background-color: #949597;
      opacity: 0.5;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
