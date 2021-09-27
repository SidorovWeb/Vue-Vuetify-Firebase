const state = {
  card: {
    path: '/',
    direction: 'left',
  },
}

export const mutationsTypes = {
  setCardStart: '[cardMenu] card menu start',
  setCardSuccess: '[cardMenu] card menu success',
  setCardFailure: '[cardMenu] card menu failure',
}
const mutations = {
  [mutationsTypes.setCardStart](state) {
    state.card.path = ''
    state.card.direction = ''
  },
  [mutationsTypes.setCardSuccess](state, payload) {
    state.card = payload
  },
  [mutationsTypes.setCardFailure]() {},
}

export const actionsTypes = {
  setCardMenu: '[cardMenu] set card menu',
}

const actions = {
  [actionsTypes.setCardMenu]({ commit }, payload) {
    commit(mutationsTypes.setCardStart)
    try {
      commit(mutationsTypes.setCardSuccess, payload)
    } catch (e) {
      commit(mutationsTypes.setCardFailure)
    }
  },
}

export default {
  state,
  mutations,
  actions,
}
