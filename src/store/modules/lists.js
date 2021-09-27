import * as fb from '../../firebase/firebase'

const state = {
  data: [],
  isLoading: false,
  error: null,
}

export const mutationsTypes = {
  fetchListsStart: '[list] fetch lists statr',
  fetchListsSuccess: '[list] fetch lists success',
  fetchListsFailure: '[list] fetch lists Failure',

  createListsStart: '[list] create lists statr',
  createListsSuccess: '[list] create lists success',
  createListsFailure: '[list] create lists Failure',

  removeTaskStart: '[lists] remove lists start',
  removeTaskSuccess: '[lists] remove lists success',
  removeTaskFailure: '[lists] remove lists failure',

  updateListsStart: '[tasks] update lists start',
  updateListsSuccess: '[tasks] update lists success',
  updateListsFailure: '[tasks] update lists failure',
}

const mutations = {
  [mutationsTypes.fetchListsStart](state) {
    state.isLoading = true
    state.data = []
  },
  [mutationsTypes.fetchListsSuccess](state, lists) {
    state.isLoading = false
    state.data = lists
  },
  [mutationsTypes.fetchListsFailure](state, error) {
    state.isLoading = false
    state.error = error
  },

  [mutationsTypes.createListsStart](state) {
    state.isLoading = true
  },
  [mutationsTypes.createListsSuccess](state, list) {
    state.isLoading = false
    state.data.push(list)
  },
  [mutationsTypes.createListsFailure](state, error) {
    state.isLoading = false
    state.error = error
  },

  [mutationsTypes.removeTaskStart](state) {
    state.isLoading = true
  },
  [mutationsTypes.removeTaskSuccess](state, lists) {
    state.isLoading = false
    state.data = lists
  },
  [mutationsTypes.removeTaskFailure](state, error) {
    state.isLoading = false
    state.error = error
  },

  [mutationsTypes.updateListsStart]() {},
  [mutationsTypes.updateListsSuccess]() {},
  [mutationsTypes.updateListsFailure](state, error) {
    state.isLoading = false
    state.error = error
  },
}

export const actionsTypes = {
  fetchLists: '[lists] fetch lists',
  createLists: '[lists] create lists',
  removeLists: '[lists] remove lists',
  updateTask: '[lists] update lists',
}

const actions = {
  async [actionsTypes.fetchLists]({ commit }) {
    commit(mutationsTypes.fetchListsStart)
    try {
      await fb.listsCollection.get().then((snapshot) => {
        let newData = []

        snapshot.forEach((doc) => {
          let post = doc.data()
          post.id = doc.id
          const currentId = fb.auth.currentUser.uid
          if (post.userId === currentId) {
            newData.push(post)
          }
        })
        commit(mutationsTypes.fetchListsSuccess, newData)
      })
    } catch (e) {
      commit(mutationsTypes.fetchListsFailure, e)
    }
  },

  async [actionsTypes.createLists]({ commit }, list) {
    commit(mutationsTypes.createListsStart)
    try {
      const newList = {
        ...list,
        userId: fb.auth.currentUser.uid,
      }

      await fb.listsCollection.add(newList).then((docRef) => {
        commit(mutationsTypes.createListsSuccess, { ...newList, id: docRef.id })
      })
    } catch (e) {
      commit(mutationsTypes.createListsFailure, e)
    }
  },

  async [actionsTypes.removeLists]({ commit, state }, id) {
    commit(mutationsTypes.removeTaskStart)
    try {
      await fb.listsCollection.doc(id).delete()
      const newArray = state.data.filter((list) => {
        return list.id != id
      })
      commit(mutationsTypes.removeTaskSuccess, newArray)
    } catch (e) {
      commit(mutationsTypes.removeTaskFailure, e)
    }
  },

  async [actionsTypes.updateTask]({ commit }, list) {
    commit(mutationsTypes.updateListsStart)
    try {
      await fb.listsCollection.doc(list.id).update({ ...list })
      commit(mutationsTypes.updateListsSuccess)
    } catch (error) {
      commit(mutationsTypes.updateListsFailure, error)
    }
  },
}

export default {
  state,
  mutations,
  actions,
}
