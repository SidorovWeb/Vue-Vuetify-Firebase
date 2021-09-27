<template>
  <div class="PanelBtns">
    <div class="PanelBtns__container">
      <v-btn
        min-height="28px"
        :class="color"
        class="text-none justify-start font-weight-bold pr-8 white--text"
        rounded
        small
        outlined
        @click="$emit('callDialogPriority')"
      >
        {{ selectedItem.name }}
      </v-btn>
      <v-btn
        icon
        x-small
        color="white"
        class="PanelBtns__icon"
        @click="$emit('cleansPriority')"
      >
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelBtns',
  props: {
    selectedItem: {
      type: Object,
      requred: true,
    },
    color: {
      type: [Object, String],
      requred: false,
      default: function () {
        return 'accent'
      },
    },
  },
}
</script>

<style lang="scss">
.PanelBtns {
  &__container {
    position: relative;
    flex: none;
    display: inline-flex;
  }

  &__icon {
    position: absolute;
    right: 7px;
    top: 4px;
  }
}
</style>
