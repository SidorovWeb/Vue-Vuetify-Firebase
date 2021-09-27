<template>
  <v-dialog
    v-model="isActiveTags"
    :height="dialogOptions.height"
    :max-width="dialogOptions.maxWidth"
    :overlay-color="dialogOptions.overlayColor"
    :overlay-opacity="dialogOptions.overlayOpacity"
    @click:outside="closeDialog"
    @keydown.esc="closeDialog"
    :transition="dialogOptions.transition"
    scrollable
  >
    <v-card class="rounded-lg overflow-hidden" color="primary">
      <my-title text="Теги"></my-title>
      <my-scroll>
        <v-card-text class="pt-4">
          <v-form class="d-flex" ref="form" @submit.prevent="createChip">
            <field
              className="mb-5"
              v-model="myTag"
              placeholder="Добавьте свой тег"
              :autofocus="true"
            ></field>
            <v-btn
              type="submit"
              fab
              small
              color="accent"
              elevation="0"
              class="ml-4"
              :disabled="isMyTag"
            >
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
          </v-form>

          <v-chip
            color="#7a7b7d7d darken-1"
            class="dark--text mt-2 mr-2"
            v-for="(tag, index) in notReactiveDefaultTags"
            :key="index"
            @click="addDefaultTag(index)"
          >
            {{ tag }}
          </v-chip>
          <h3 class="mt-2" v-if="myTagsArray.length">Выбранные теги</h3>
          <div v-if="myTagsArray.length">
            <v-chip
              v-for="(tag, index) in myTagsArray"
              :key="index"
              class="active-tag mr-2 mt-2"
              close
              dark
              @click:close="removeChip(index)"
            >
              {{ tag }}
            </v-chip>
          </div>
        </v-card-text>
      </my-scroll>
      <actions @notUpdate="closeDialog" @update="updateTags"></actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Actions from '@/components/card-elements/Actions.vue'
import MyTitle from '@/components/card-elements/Title.vue'
import Field from '@/components/Field.vue'
import { mutationTypes as dialog } from '@/store/modules/dialog'

export default {
  name: 'DialogPriority',
  props: {
    isActiveTags: {
      type: Boolean,
      requred: true,
    },
    dialogOptions: {
      type: Object,
      requred: true,
    },
    tags: {
      type: Array,
      requred: false,
    },
  },
  components: { Actions, MyTitle, Field },
  data() {
    return {
      defaultTags: [
        '#Работа',
        '#Семья',
        '#Учеба',
        '#Спорт',
        '#Еда',
        '#Я любимый',
        '#Art',
        '#Tech',
        '#Creative Writing',
      ],
      notReactiveDefaultTags: [],
      notReactiveTags: [],
      myTag: '',
      myTagsArray: [],
    }
  },
  computed: {
    isMyTag: function () {
      return this.myTag !== '' ? false : true
    },
  },
  methods: {
    addDefaultTag(index) {
      const value = this.notReactiveDefaultTags[index]

      if (this.myTagsArray.includes(value)) return false

      this.myTagsArray.push(value)

      this.notReactiveDefaultTags = this.notReactiveDefaultTags.filter(
        (value) => {
          return value != this.notReactiveDefaultTags[index]
        }
      )
    },

    updateTags() {
      this.$store.commit(dialog.dialogTags, false)
      this.$emit('updateTags', this.myTagsArray)
    },

    createChip() {
      if (!this.myTag) return false
      if (this.myTagsArray.includes(`#${this.myTag}`)) return false
      this.myTagsArray.push(`#${this.myTag}`)
      this.myTag = ''
    },
    removeChip(index) {
      const removeValue = this.myTagsArray[index]

      if (this.defaultTags.includes(removeValue)) {
        const indexInDefaultTags = this.defaultTags.indexOf(removeValue)
        this.notReactiveDefaultTags.splice(indexInDefaultTags, 0, removeValue)
      }

      this.myTagsArray = this.myTagsArray.filter((value) => {
        return value != this.myTagsArray[index]
      })
    },
    closeDialog() {
      this.$store.commit(dialog.dialogTags, false)
      this.$emit('updateTags', this.notReactiveTags)
    },
  },
  mounted() {
    this.notReactiveDefaultTags = JSON.parse(JSON.stringify(this.defaultTags))
    this.notReactiveTags = JSON.parse(JSON.stringify(this.tags))

    if (this.tags) {
      this.tags.forEach((element) => {
        if (this.defaultTags.includes(element)) {
          this.notReactiveDefaultTags = this.notReactiveDefaultTags.filter(
            (value) => {
              return value != element
            }
          )
        }
      })
      this.myTagsArray = this.tags
    }
  },
}
</script>

<style lang="scss">
.active-tag {
  background: #2093f1 !important;
}
</style>
