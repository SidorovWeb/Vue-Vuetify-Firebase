import * as fb from '../../firebase/firebase'

const state = {
  data: [],
  isLoading: false,
  error: false,
}

export const mutationTypes = {
  fetchTasksStart: '[tasks] fetch tasks start',
  fetchTasksSuccess: '[tasks] fetch tasks success',
  fetchTasksFailure: '[tasks] fetch tasks failure',

  createTaskStart: '[tasks] create task start',
  createTaskSuccess: '[tasks] create task success',
  createTaskFailure: '[tasks] create task failure',

  deleteTaskStart: '[tasks] delete task start',
  deleteTaskSuccess: '[tasks] delete task success',
  deleteTaskFailure: '[tasks] delete task failure',

  editTaskStart: '[tasks] edit task start',
  editTaskSuccess: '[tasks] edit task success',
  editTaskFailure: '[tasks] edit task failure',

  changeStatusTaskStart: '[tasks] change status task start',
  changeStatusTaskSuccess: '[tasks] change status task success',
  changeStatusTaskFailure: '[tasks] change status task failure',
}

export const actionsTypes = {
  fetchTasks: '[tasks] fetch tasks',
  createTask: '[tasks] create task',
  deleteTask: '[tasks] delete task',
  editTask: '[tasks] edit task',
  changeStatusTask: '[tasks] change status task',
}

export const gettersTypes = {
  getTasks: '[tasks] get  tasks',
}

const mutations = {
  [mutationTypes.fetchTasksStart](state) {
    state.isLoading = true
    state.data = []
  },
  [mutationTypes.fetchTasksSuccess](state, payload) {
    state.isLoading = false
    state.data = payload
  },
  [mutationTypes.fetchTasksFailure](state, payload) {
    state.isLoading = false
    state.error = payload
  },

  [mutationTypes.createTaskStart]() {},
  [mutationTypes.createTaskSuccess](state, payload) {
    state.data.push(payload)
  },
  [mutationTypes.createTaskFailure](state, payload) {
    state.error = payload
  },

  [mutationTypes.deleteTaskStart]() {},
  [mutationTypes.deleteTaskSuccess](state, payload) {
    state.data = payload
  },
  [mutationTypes.deleteTaskFailure]() {},

  [mutationTypes.editTaskStart]() {},
  [mutationTypes.editTaskSuccess](state, payload) {
    state.data = payload
  },
  [mutationTypes.editTaskFailure](state, payload) {
    state.error = payload
  },
}

const actions = {
  async [actionsTypes.fetchTasks]({ commit }) {
    commit(mutationTypes.fetchTasksStart)
    try {
      await fb.postsCollection
        .orderBy('timeOfСreation')
        .get()
        .then((snapshot) => {
          let postsArray = []

          snapshot.forEach((doc) => {
            let post = doc.data()
            post.id = doc.id
            const currentId = fb.auth.currentUser.uid
            if (post.userId === currentId) {
              postsArray.push(post)
            }
          })
          commit(mutationTypes.fetchTasksSuccess, postsArray)
        })
    } catch (error) {
      commit(mutationTypes.fetchTasksFailure, error)
    }
  },

  async [actionsTypes.createTask]({ commit, rootState }, task) {
    commit(mutationTypes.createTaskStart)

    try {
      const newTask = {
        timeOfСreation: new Date(),
        ...task,
        userId: fb.auth.currentUser.uid,
        userName: rootState.profile.currentUser.name,
        complited: false,
        deleteTask: false,
      }

      await fb.postsCollection.add(newTask).then((docRef) => {
        commit(mutationTypes.createTaskSuccess, { ...newTask, id: docRef.id })
      })
    } catch (error) {
      commit(mutationTypes.createTaskFailure, error)
    }
  },

  async [actionsTypes.deleteTask]({ commit, state }, id) {
    commit(mutationTypes.deleteTaskStart)
    try {
      await fb.postsCollection.doc(id).delete()
      const newArray = state.data.filter((task) => {
        return task.id != id
      })
      commit(mutationTypes.deleteTaskSuccess, newArray)
    } catch (error) {
      commit(mutationTypes.deleteTaskFailure)
    }
  },

  async [actionsTypes.editTask]({ commit, state }, task) {
    commit(mutationTypes.editTaskStart)
    try {
      await fb.postsCollection.doc(task.id).update({ ...task })
      const index = state.data.findIndex((item) => item.id === task.id)
      const newData = state.data.map((item, i) => {
        if (i == index) {
          return task
        }
        return item
      })
      commit(mutationTypes.editTaskSuccess, newData)
    } catch (error) {
      commit(mutationTypes.editTaskFailure, error)
    }
  },
}

const getters = {
  [gettersTypes.getTasks]: (state) => state.data,
}

export default {
  state,
  mutations,
  actions,
  getters,
}
