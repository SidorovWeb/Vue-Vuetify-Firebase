<template>
  <div class="MyDivider" v-if="index !== array.length - 1"></div>
</template>

<script>
export default {
  name: 'MyDivider',
  props: {
    index: {
      type: Number,
      require: true,
    },
    array: {
      type: Array,
      require: true,
    },
  },
}
</script>

<style lang="scss">
.MyDivider {
  position: absolute;
  width: calc(100% - 40px);
  height: 1px;
  background-color: var(--v-pantone);
  opacity: 0.4;
  bottom: 0px;
}
</style>
