import * as fb from '../../firebase/firebase'

const state = {
  data: [],
  isLoading: false,
  error: null,
  progress: 0,
}

export const mutationsTypes = {
  uploadStart: '[storage] upload file start',
  uploadSuccess: '[storage] upload file success',
  uploadFailure: '[storage] upload file failure',

  uploadUpdateStart: '[storage] update upload file start',
  uploadUpdateSuccess: '[storage] update upload file success',
  uploadUpdateFailure: '[storage] update upload file failure',

  downloadStart: '[storage] download file start',
  downloadSuccess: '[storage] download file success',
  downloadFailure: '[storage] download file failure',

  deleteStart: '[storage] delete file start',
  deleteSuccess: '[storage] delete file success',
  deleteFailure: '[storage] delete file failure',

  progress: '[storage] progress',
}

export const actionsTypes = {
  upload: '[storage] upload file',
  uploadUpdate: '[storage] update upload file',
  download: '[storage] download file',
  delete: '[storage] delete file',
}

const mutations = {
  [mutationsTypes.uploadStart](state) {
    state.isLoading = true
  },
  [mutationsTypes.uploadSuccess](state) {
    state.isLoading = false
  },
  [mutationsTypes.uploadFailure](state, error) {
    state.isLoading = false
    state.error = error
  },

  [mutationsTypes.uploadUpdateStart]() {},
  [mutationsTypes.uploadUpdateSuccess](state, files) {
    state.data = files
  },
  [mutationsTypes.uploadUpdateFailure]() {},

  [mutationsTypes.downloadStart](state) {
    state.isLoading = true
  },
  [mutationsTypes.downloadSuccess](state) {
    state.isLoading = false
  },
  [mutationsTypes.downloadFailure](state, error) {
    state.isLoading = false
    state.error = error
  },

  [mutationsTypes.deleteStart](state) {
    state.isLoading = true
  },
  [mutationsTypes.deleteSuccess](state) {
    state.isLoading = false
  },
  [mutationsTypes.deleteFailure](state, error) {
    state.isLoading = false
    state.error = error
  },

  [mutationsTypes.progress](state, progress) {
    state.progress = progress
  },
}

const actions = {
  [actionsTypes.upload]({ commit }, file) {
    commit(mutationsTypes.uploadStart)
    try {
      const uploadFile = fb.storage
        .ref(`users/${fb.auth.currentUser.uid}/${file.name}`)
        .put(file)

      uploadFile.on('state_changed', (snapshot) => {
        let progress = Math.floor(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        )
        commit(mutationsTypes.progress, progress)
        if (progress === 100) {
          commit(mutationsTypes.uploadSuccess)
        }
      })
    } catch (error) {
      commit(mutationsTypes.uploadFailure, error)
    }
  },

  async [actionsTypes.download]({ commit }, fileName) {
    commit(mutationsTypes.downloadStart)
    return await new Promise((resolve) => {
      try {
        const url = fb.storage
          .ref(`users/${fb.auth.currentUser.uid}/${fileName}`)
          .getDownloadURL()
        commit(mutationsTypes.downloadSuccess)
        resolve(url)
      } catch (error) {
        commit(mutationsTypes.downloadFailure, error)
      }
    })
  },

  async [actionsTypes.delete]({ commit }, fileName) {
    commit(mutationsTypes.deleteStart)
    return await new Promise((resolve) => {
      try {
        const url = fb.storage
          .ref(`users/${fb.auth.currentUser.uid}/${fileName}`)
          .delete()
        commit(mutationsTypes.deleteSuccess)
        resolve(url)
      } catch (error) {
        commit(mutationsTypes.deleteFailure, error)
      }
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
