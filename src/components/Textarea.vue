<template>
  <v-textarea
    class="focus-background-color Textarea"
    dense
    filled
    solo
    auto-grow
    hide-details
    rows="1"
    row-height="10"
    color="white"
    :class="className"
    :value="value"
    :placeholder="placeholder"
    @input="update"
    @blur="blur"
  >
  </v-textarea>
</template>

<script>
export default {
  name: 'Textarea',
  props: {
    value: {
      type: [Object, String],
      requred: true,
    },
    placeholder: {
      type: String,
      requred: false,
    },
    className: {
      type: String,
      requred: false,
    },
    autofocus: {
      type: Boolean,
      requred: false,
    },
  },
  methods: {
    update(newValue) {
      this.$emit('input', newValue)
    },
    blur(newValue) {
      this.$emit('blur', newValue)
    },
  },
}
</script>

<style lang="scss">
.Textarea {
  min-height: 40px;
}

.Textarea {
  & .v-input__slot {
    border: 1px solid transparent !important;
    transition: 0.3s;
    &:hover {
      border: 1px solid var(--v-primary) !important;
    }
  }
}
</style>
