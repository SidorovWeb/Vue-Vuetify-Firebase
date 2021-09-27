import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/store/modules/auth'
import tasks from '@/store/modules/tasks'
import lists from '@/store/modules/lists'
import dialog from '@/store/modules/dialog'
import profile from '@/store/modules/profile'
import attachments from '@/store/modules/attachments'
import alert from '@/store/modules/alert'
import userPhoto from '@/store/modules/userPhoto'
import cardMenu from '@/store/modules/cardMenu'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    auth,
    tasks,
    lists,
    dialog,
    profile,
    attachments,
    alert,
    userPhoto,
    cardMenu,
  },
})
