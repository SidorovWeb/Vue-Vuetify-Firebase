<template>
  <div class="CheckIcon" :class="className">
    <v-btn icon small :color="complitedColor" :ripple="false">
      <v-icon
        class="CheckIcon__icon"
        @click="checked(!isComplited)"
        :color="color"
      >
        {{ icon }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'CheckIcon',
  props: {
    iconNoCheck: {
      type: String,
      requred: true,
    },
    isComplited: {
      type: Boolean,
      requred: true,
    },
    iconCheck: {
      type: String,
      requred: true,
    },
    color: {
      type: [Object, String],
      requred: true,
      default: () => {
        return 'grey'
      },
    },
    className: {
      type: String,
      requred: false,
    },
  },
  data() {
    return {
      ischeck: false,
    }
  },
  computed: {
    icon: function () {
      return this.isComplited === false ? this.iconNoCheck : this.iconCheck
    },
    complitedColor: function () {
      return this.isComplited ? 'grey' : ''
    },
  },
  methods: {
    checked(ischeck) {
      this.$emit('checked', ischeck)
    },
  },
}
</script>
