<template>
  <v-btn
    rounded
    :class="color"
    class="BtnAdd text-none font-weight-bold pantone white--text"
    outlined
    text
    small
    @click="$emit('callDialogTags')"
    >{{ text }}</v-btn
  >
</template>

<script>
export default {
  name: 'BtnAdd',
  props: {
    color: {
      type: String,
      requred: false,
      default: 'pantone',
    },
    text: {
      type: String,
      requred: false,
      default: 'Добавить',
    },
  },
}
</script>

<style lang="scss">
.v-btn__content {
  display: block;
}
</style>
