import * as fb from '../../firebase/firebase'

const state = {
  userPhoto: null,
  isLoading: false,
  error: null,
}

export const mutationsTypes = {
  uploadUserPhotoStart: '[storage] upload user photo start',
  uploadUserPhotoSuccess: '[storage] upload user photo success',
  uploadUserPhotoFailure: '[storage] upload user photo failure',

  downloadUserPhotoStart: '[storage] download user photo start',
  downloadUserPhotoSuccess: '[storage] download user photo success',
  downloadUserPhotoFailure: '[storage] download user photo failure',
}

export const actionsTypes = {
  uploadUserPhoto: '[storage] upload user photo',
  downloadUserPhoto: '[storage] download user photo',
}

const mutations = {
  [mutationsTypes.uploadUserPhotoStart](state) {
    state.isLoading = true
  },
  [mutationsTypes.uploadUserPhotoSuccess](state) {
    state.isLoading = false
  },
  [mutationsTypes.uploadUserPhotoFailure](state, error) {
    state.isLoading = false
    state.error = error
  },

  [mutationsTypes.downloadUserPhotoStart](state) {
    state.isLoading = true
    state.userPhoto = null
  },
  [mutationsTypes.downloadUserPhotoSuccess](state, userPhoto) {
    state.isLoading = false
    state.userPhoto = userPhoto
  },
  [mutationsTypes.downloadUserPhotoFailure](state, error) {
    state.isLoading = false
    state.error = error
  },
}

const actions = {
  async [actionsTypes.uploadUserPhoto]({ commit }, file) {
    commit(mutationsTypes.uploadUserPhotoStart)
    return await new Promise((resolve) => {
      try {
        const uid = fb.auth.currentUser.uid
        fb.storage
          .ref(`users/${uid}/userPhoto.${file.name.split('.').pop()}`)
          .put(file)
          .then(() => {
            resolve()
          })
        commit(mutationsTypes.uploadUserPhotoSuccess)
      } catch (error) {
        commit(mutationsTypes.uploadUserPhotoFailure, error)
      }
    })
  },

  async [actionsTypes.downloadUserPhoto]({ commit }) {
    commit(mutationsTypes.downloadUserPhotoStart)
    const uid = fb.auth.currentUser.uid
    await fb.storage
      .ref(`users/${uid}/userPhoto.jpeg`)
      .getDownloadURL()
      .then((url) => {
        commit(mutationsTypes.downloadUserPhotoSuccess, url)
      })
      .catch((e) => {
        commit(mutationsTypes.downloadUserPhotoFailure, e)
      })
  },
}

export default {
  state,
  mutations,
  actions,
}
