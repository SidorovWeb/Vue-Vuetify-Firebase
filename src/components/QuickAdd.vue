<template>
  <div class="quick-add secondary pa-4 d-flex align-center shadow-bottom">
    <v-form
      class="quick-add__form d-flex align-center"
      ref="form"
      @submit.prevent="createQuickTask"
    >
      <v-text-field
        class="rounded-pill quick-add__input mr-4"
        v-model="field"
        placeholder="Быстро добавить задачу"
        filled
        solo
        hide-details
        dense
        color="dark"
      ></v-text-field>
      <v-btn fab small elevation="0" @click="createQuickTask" :color="ifField">
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-form>
  </div>
</template>

<script>
import { actionsTypes } from '@/store/modules/tasks'
import { mapState } from 'vuex'

export default {
  name: 'QuickAdd',
  data() {
    return {
      field: '',
    }
  },

  computed: {
    ...mapState({
      currentUser: (state) => state.profile.currentUser,
    }),

    ifField: function () {
      return this.field !== '' ? 'accent' : 'gray'
    },

    defaultList: function () {
      return this.currentUser.defaultList
    },

    category: function () {
      return this.defaultList
        ? {
            name: this.defaultList,
            color: 'accent',
            id: Math.random().toString(36).substring(7),
          }
        : null
    },
  },

  methods: {
    createQuickTask() {
      if (!this.field) {
        document.querySelector('.quick-add__input input').focus()
        return false
      }
      this.$store.dispatch(actionsTypes.createTask, {
        title: this.field,
        notes: '',
        priority: {
          color: 'pantone',
          name: 'Без приоритета',
          id: Math.random().toString(36).substring(7),
        },
        tags: null,
        category: this.category,
      })
      this.$refs.form.reset()
    },
  },
}
</script>

<style lang="scss">
.quick-add {
  position: relative;
  &__form {
    width: 100%;
  }
}

.theme--light .quick-add {
  &__input {
    .v-input__slot {
      background: lighten(#949597, 30%) !important;
    }
  }
}
</style>
