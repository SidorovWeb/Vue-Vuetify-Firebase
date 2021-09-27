<template>
  <v-dialog
    v-model="isActive"
    :height="dialogOptions.height"
    :max-width="dialogOptions.maxWidth"
    :overlay-color="dialogOptions.overlayColor"
    :overlay-opacity="dialogOptions.overlayOpacity"
    @click:outside="$emit('notUpdateName', oldUser)"
    @keydown.esc="$emit('notUpdateName', oldUser)"
    :transition="dialogOptions.transition"
  >
    <v-card class="rounded-lg overflow-hidden" color="primary">
      <my-title text="Ваше имя"></my-title>
      <v-card-text class="py-7">
        <v-form ref="form" @submit.prevent="$emit('updateName', user)">
          <field
            className="font-weight-bold headline"
            v-model="user.name"
            placeholder="Ваше имя"
            :autofocus="true"
          ></field>
        </v-form>
      </v-card-text>
      <actions
        :isSubmitting="isSubmitting"
        @notUpdate="$emit('notUpdateName', oldUser)"
        @update="$emit('updateName', user)"
      ></actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Actions from '@/components/card-elements/Actions.vue'
import MyTitle from '@/components/card-elements/Title.vue'
import Field from '@/components/Field.vue'

export default {
  name: 'DialogUpdateName',
  props: {
    isActive: {
      type: Boolean,
      requred: true,
    },
    isSubmitting: {
      type: Boolean,
      requred: true,
    },
    user: {
      type: Object,
      requred: true,
    },
    dialogOptions: {
      type: Object,
      requred: true,
    },
  },
  components: { Actions, MyTitle, Field },
  data() {
    return {
      oldUser: '',
    }
  },
  mounted() {
    this.oldUser = Object.assign({}, this.user)
  },
}
</script>
