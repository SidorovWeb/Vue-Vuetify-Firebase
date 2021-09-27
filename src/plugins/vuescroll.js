import Vue from 'vue'
import Vuescroll from 'vuescroll'

Vue.use(Vuescroll, {
  ops: {
    bar: {
      background: '#363636',
      size: '6px',
      keepShow: true,
    },
  },
  name: 'myScroll',
})
