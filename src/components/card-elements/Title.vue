<template>
  <v-card-title
    class="Title secondary font-weight-bold d-flex justify-space-between shadow-top"
    style="z-index: 1"
  >
    <span>
      {{ text }}
    </span>
    <slot></slot>
  </v-card-title>
</template>

<script>
export default {
  name: 'Title',
  props: {
    text: {
      type: String,
      requred: false,
    },
  },
}
</script>
