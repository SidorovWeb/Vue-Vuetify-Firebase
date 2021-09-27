import * as fb from '../../firebase/firebase'
import { actionsTypes as callAlertType } from '@/store/modules/alert'

const state = {
  isSubmitting: false,
  currentUser: null,
  error: '',
  isLoading: false,
}

export const mutationTypes = {
  fetchUserProfileStart: '[auth] fetch user profile start',
  fetchUserProfileSuccess: '[auth] fetch user profile success',
  fetchUserProfileFailure: '[auth] fetch user profile failure',

  updateUserStart: '[profile] update user start',
  updateUserSuccess: '[profile] update user success',
  updateUserFalure: '[profile] update user falure',

  resetPasswordStart: '[profile] reset password start',
  resetPasswordSuccess: '[profile] reset password success',
}

const mutations = {
  [mutationTypes.fetchUserProfileStart](state) {
    state.isLoading = true
  },
  [mutationTypes.fetchUserProfileSuccess](state, payload) {
    state.currentUser = payload
    state.isLoading = false
  },
  [mutationTypes.fetchUserProfileFailure](state) {
    state.isLoading = false
  },

  [mutationTypes.updateUserStart](state) {
    state.isSubmitting = true
  },
  [mutationTypes.updateUserSuccess](state, payload) {
    state.isSubmitting = false
    state.currentUser = payload
  },
  [mutationTypes.updateUserFalure](state) {
    state.isSubmitting = true
  },
  [mutationTypes.resetPasswordStart](state) {
    state.isSubmitting = true
  },
  [mutationTypes.resetPasswordSuccess](state) {
    state.isSubmitting = false
  },
}

export const actionsTypes = {
  fetchUserProfile: '[auth] fetch user profile',
  updateUser: '[profile] update user',
  resetPassword: '[profile] reset password',
}

const actions = {
  async [actionsTypes.fetchUserProfile]({ commit }, user) {
    commit(mutationTypes.fetchUserProfileStart)
    try {
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      commit(mutationTypes.fetchUserProfileSuccess, {
        ...userProfile.data(),
      })
    } catch ({ message }) {
      commit(mutationTypes.fetchUserProfileFailure)
    }
  },

  async [actionsTypes.updateUser]({ state, commit }, user) {
    commit(mutationTypes.updateUserStart)
    try {
      const uid = fb.auth.currentUser.uid
      await fb.usersCollection.doc(uid).update({ ...user })

      commit(mutationTypes.updateUserSuccess, { ...state.currentUser, ...user })
    } catch (error) {
      commit(mutationTypes.updateUserFalure)
    }
  },

  [actionsTypes.resetPassword]({ state, commit, dispatch }) {
    commit(mutationTypes.resetPasswordStart)

    const email = state.currentUser.email
    fb.auth
      .sendPasswordResetEmail(email)
      .then(() => {
        commit(mutationTypes.resetPasswordSuccess)

        dispatch(callAlertType.callAlert, {
          message: 'Письмо отправлено на ваш Email',
          type: 'success',
        })
      })
      .catch((error) => {
        const errorMessage = error.message
        dispatch(callAlertType.callAlert, {
          message: errorMessage,
          type: 'error',
        })
      })
  },
}

export default {
  state,
  mutations,
  actions,
}
