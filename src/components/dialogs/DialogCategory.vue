<template>
  <v-dialog
    v-model="isActiveCategory"
    :height="dialogOptions.height"
    :max-width="dialogOptions.maxWidth"
    :overlay-color="dialogOptions.overlayColor"
    :overlay-opacity="dialogOptions.overlayOpacity"
    @click:outside="$emit('closeAdditionalDialog')"
    @keydown.esc="$emit('closeAdditionalDialog')"
    :transition="dialogOptions.transition"
    scrollable
  >
    <v-card class="rounded-lg overflow-hidden" color="primary">
      <my-title text="Выбрать список"></my-title>
      <my-scroll>
        <v-card-text class="pt-4 px-0">
          <v-form
            class="d-flex px-3"
            ref="form"
            @submit.prevent="createCategory"
          >
            <field
              className="mb-5"
              v-model="myCategoryTitle"
              placeholder="Добавьте свой список"
              :autofocus="true"
            ></field>
            <v-btn
              type="submit"
              fab
              small
              color="accent"
              elevation="0"
              class="ml-4"
              :disabled="isMyCategoryTitle"
            >
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
          </v-form>
          <v-list class="py-0" color="primary">
            <v-list-item-group v-model="currentCategory">
              <v-list-item
                v-for="(item, index) in mergeData"
                :key="index"
                :ripple="false"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action class="d-flex flex-row align-center">
                    <v-btn
                      v-if="item.removable"
                      class="grey mr-2"
                      icon
                      x-small
                      :ripple="false"
                      color="primary"
                      @click.stop="removeList(item)"
                    >
                      <v-icon small>mdi-close</v-icon>
                    </v-btn>
                    <v-icon v-if="active" :disabled="!active" color="accent"
                      >mdi-check-circle</v-icon
                    >
                  </v-list-item-action>
                  <my-divider :index="index" :array="mergeData" />
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </my-scroll>
      <actions @notUpdate="noUpdate" @update="addCategory"></actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mutationTypes as dialog } from '@/store/modules/dialog'
import { actionsTypes as lists } from '@/store/modules/lists'
import { actionsTypes as alert } from '@/store/modules/alert'
import { gettersTypes } from '@/store/modules/tasks'
import { mapGetters, mapState } from 'vuex'
import Actions from '@/components/card-elements/Actions.vue'
import MyTitle from '@/components/card-elements/Title.vue'
import Field from '@/components/Field.vue'
import MyDivider from '@/components/MyDivider.vue'
import { categoryDefaultList } from '@/helpers/categoryDefaultList.js'

export default {
  name: 'DialogCategory',
  props: {
    isActiveCategory: {
      type: Boolean,
      requred: true,
    },
    dialogOptions: {
      type: Object,
      requred: true,
    },
    categoryValue: {
      type: Object,
      requred: false,
    },
  },
  components: { Actions, MyTitle, Field, MyDivider },
  data() {
    return {
      category: categoryDefaultList(),
      currentCategory: 3,
      myCategoryTitle: '',
    }
  },
  computed: {
    ...mapState({
      data: (state) => state.lists.data,
      currentUser: (state) => state.profile.currentUser,
    }),

    isMyCategoryTitle: function () {
      return this.myCategoryTitle !== '' ? false : true
    },

    defaultList: function () {
      return this.currentUser.defaultList
    },

    ...mapGetters({
      allTasks: gettersTypes.getTasks,
    }),

    mergeData: function () {
      const merge = [...this.category]
      this.data.forEach((el) => {
        merge.push(el)
      })

      return merge
    },
  },
  methods: {
    addCategory() {
      this.$store.commit(dialog.dialogCategory, false)
      this.mergeData.forEach((item) => {
        if (item.removable) {
          item.temporary = false
          this.$store.dispatch(lists.updateTask, item)
        }
      })

      this.$emit('updateCategory', this.mergeData[this.currentCategory])
    },
    createCategory() {
      if (!this.myCategoryTitle) return false
      if (this.mergeData.includes(`#${this.myCategoryTitle}`)) return false

      const item = {
        name: `${this.myCategoryTitle}`,
        removable: true,
        temporary: true,
      }

      this.$store.dispatch(lists.createLists, item).then(() => {
        this.myCategoryTitle = ''
        this.currentCategory = this.mergeData.length - 1
      })
    },
    removeList(list) {
      const isItem = this.allTasks.some((item) => {
        return item.category?.name === list.name
      })

      if (isItem) {
        this.$store.dispatch(alert.callAlert, {
          message: `В списке "${list.name}" есть задачи!`,
          type: 'error',
        })
        return false
      }

      this.$store.dispatch(lists.removeLists, list.id)
    },

    noUpdate() {
      this.mergeData.forEach((item) => {
        if (item.removable && item.temporary === true) {
          this.$store.dispatch(lists.removeLists, item.id)
        }
      })
      this.$emit('closeAdditionalDialog')
    },
  },
  mounted() {
    if (!this.categoryValue) {
      if (!this.defaultList) {
        return 3
      }

      this.currentCategory = this.mergeData.findIndex(
        (item) => item.name === this.defaultList
      )

      return false
    }

    if (this.categoryValue) {
      const current = this.mergeData.findIndex(
        (item) => item.name === this.categoryValue.name
      )
      this.currentCategory = current
      return false
    }
  },
}
</script>
