<template>
  <v-card-actions class="Actions pa-0 shadow-bottom">
    <v-btn
      class="text-none font-weight-bold subtitle-1 rounded-0 dark--text text--darken-3"
      height="54px"
      style="flex: 1 1 100%"
      text
      @click="$emit('notUpdate')"
    >
      {{ notUpdateText }}
    </v-btn>
    <v-divider vertical></v-divider>
    <v-btn
      class="secondary text-none font-weight-bold subtitle-1 rounded-0"
      height="54px"
      style="flex: 1 1 100%"
      color="accent"
      type="submit"
      text
      :loading="isSubmitting"
      :disabled="isSubmitting"
      @click="$emit('update')"
    >
      {{ updateText }}
    </v-btn>
  </v-card-actions>
</template>

<script>
export default {
  name: 'Actions',
  props: {
    updateText: {
      type: String,
      requred: false,
      default: 'Сохранить',
    },
    notUpdateText: {
      type: String,
      requred: false,
      default: 'Отменить',
    },
    isSubmitting: {
      type: Boolean,
      requred: false,
    },
  },
}
</script>

<style lang="scss"></style>
