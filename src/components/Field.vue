<template>
  <v-text-field
    :class="className"
    class="Field focus-background-color"
    filled
    solo
    hide-details
    :autofocus="autofocus"
    dense
    :value="value"
    :placeholder="placeholder"
    @input="update"
    @blur="blur"
    @keydown.enter="enter"
  ></v-text-field>
</template>

<script>
export default {
  name: 'Field',
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
      type: [String, Array],
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
    enter(newValue) {
      this.$emit('enter', newValue)
    },
  },

  mounted() {
    const inputs = document.querySelectorAll('input')
    inputs.forEach((input) => {
      input.setAttribute('autocomplete', 'off')
    })
  },
}
</script>

<style lang="scss">
.Field {
  min-height: 40px;
}

.Field {
  & .v-input__slot {
    border: 1px solid transparent !important;
    transition: 0.3s;
    &:hover {
      border: 1px solid var(--v-primary) !important;
    }
  }
}
</style>
