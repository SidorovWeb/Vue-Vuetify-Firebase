<template>
  <v-dialog
    v-model="isActivePriority"
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
      <my-title text="Приоритет"></my-title>
      <my-scroll>
        <v-card-text class="pa-0">
          <v-list class="py-0" color="primary">
            <v-list-item-group v-model="currentPriority">
              <v-list-item
                v-for="(item, index) in priority"
                :key="index"
                :class="item.color"
                :ripple="false"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.name }}</v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon v-if="active" :disabled="!active" color="accent"
                      >mdi-check-circle</v-icon
                    >
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </my-scroll>
      <actions
        @notUpdate="$emit('closeAdditionalDialog')"
        @update="addPriority"
      ></actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mutationTypes as dialog } from '@/store/modules/dialog'
import Actions from '@/components/card-elements/Actions.vue'
import MyTitle from '@/components/card-elements/Title.vue'

export default {
  name: 'DialogPriority',
  props: {
    isActivePriority: {
      type: Boolean,
      requred: true,
    },
    dialogOptions: {
      type: Object,
      requred: true,
    },
    priorityValue: {
      type: Object,
      requred: false,
    },
  },
  components: { Actions, MyTitle },
  data() {
    return {
      priority: [
        {
          name: 'Высокий',
          color: 'high',
        },
        {
          name: 'Средний',
          color: 'medium',
        },
        {
          name: 'Низкий',
          color: 'low',
        },
        {
          name: 'Без приоритета',
          color: 'pantone',
        },
      ],
      currentPriority: 3,
    }
  },
  methods: {
    addPriority() {
      this.$store.commit(dialog.dialogPriority, false)
      this.$emit('updatePriority', this.priority[this.currentPriority])
    },
  },
  mounted() {
    if (!this.priorityValue) {
      return false
    }

    const current = this.priority.findIndex(
      (item) => item.name === this.priorityValue.name
    )

    this.currentPriority = current
  },
}
</script>
