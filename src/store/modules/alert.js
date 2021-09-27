const state = {
  message: null,
}

export const mutationsTypes = {
  callAlertStart: 'call alert start',
  callAlertSuccess: 'call alert success',
  callAlertFailure: 'call alert failure',
}

export const actionsTypes = {
  callAlert: 'call alert',
}

const mutations = {
  [mutationsTypes.callAlertStart]() {},
  [mutationsTypes.callAlertSuccess](state, payload) {
    state.message = payload
  },
}

const actions = {
  [actionsTypes.callAlert]({ commit }, payload) {
    commit(mutationsTypes.callAlertStart)

    commit(mutationsTypes.callAlertSuccess, payload)

    setTimeout(() => {
      commit(mutationsTypes.callAlertSuccess, null)
    }, 3000)
  },
}

export default {
  state,
  mutations,
  actions,
}
