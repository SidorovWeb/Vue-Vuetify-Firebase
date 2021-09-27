import * as fb from '../../firebase/firebase'
// import firebase from 'firebase/app'
import { actionsTypes as callAlertType } from '@/store/modules/alert'

const state = {
  isSubmitting: false,
  validationErrors: null,
  isLoggedIn: null,
}

export const mutationTypes = {
  registerStart: '[auth] register start',
  registerSuccess: '[auth] register success',
  registerFailure: '[auth] register failure',

  loginStart: '[auth] login start',
  loginSuccess: '[auth] login success',
  loginFailure: '[auth] login failure',

  loginWithGoogleStart: '[auth] login with google start',
  loginWithGoogleSuccess: '[auth] login with google success',
  loginWithGoogleFailure: '[auth] login with google failure',

  logoutStart: '[auth] logout start',
  logoutSuccess: '[auth] logout success',
  logoutFailure: '[auth] logout failure',

  deleteAccountStart: '[auth] delete account start',
  deleteAccountSuccess: '[auth] delete account success',
  deleteAccountFailure: '[auth] delete account failure',
}

export const actionsTypes = {
  register: '[auth] register',
  login: '[auth] login',
  loginWithGoogle: '[auth] login with google',
  logout: '[auth] logout',
  deleteAccount: '[auth] delete account',
}

const mutations = {
  [mutationTypes.registerStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  [mutationTypes.registerSuccess](state) {
    state.isSubmitting = false
    state.isLoggedIn = true
  },
  [mutationTypes.registerFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  },

  [mutationTypes.loginStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  [mutationTypes.loginSuccess](state) {
    state.isSubmitting = false
    state.isLoggedIn = true
  },
  [mutationTypes.loginFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  },

  [mutationTypes.loginWithGoogleStart](state) {
    state.isSubmitting = true
    state.validationErrors = null
  },
  [mutationTypes.loginWithGoogleSuccess](state) {
    state.isSubmitting = false
    // state.isLoggedIn = true
  },
  [mutationTypes.loginWithGoogleFailure](state, payload) {
    state.isSubmitting = false
    state.validationErrors = payload
  },

  [mutationTypes.logoutStart]() {},
  [mutationTypes.logoutSuccess](state) {
    state.isLoggedIn = null
  },
  [mutationTypes.logoutFailure]() {},

  [mutationTypes.deleteAccountStart]() {},
  [mutationTypes.deleteAccountSuccess]() {},
  [mutationTypes.deleteAccountFailure]() {},
}

const actions = {
  async [actionsTypes.register]({ commit }, { name, email, password }) {
    commit(mutationTypes.registerStart)

    try {
      // создание пользователя в Firebase
      const { user } = await fb.auth.createUserWithEmailAndPassword(email, password)
      // создание объекта профиля пользователя в userCollections
      await fb.usersCollection.doc(user.uid).set({
        name: name,
        email: email,
      })
      // set user profile in state.currentUser
      commit(mutationTypes.registerSuccess)
    } catch ({ message }) {
      commit(mutationTypes.registerFailure, message)
    }
  },

  async [actionsTypes.login]({ commit, dispatch }, { email, password }) {
    commit(mutationTypes.loginStart)
    try {
      return await new Promise((resolve) => {
        fb.auth
          .signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            const user = userCredential.user
            commit(mutationTypes.loginSuccess)
            resolve(user)
          })
          .catch((error) => {
            const errorMessage = error.message

            dispatch(callAlertType.callAlert, {
              message: errorMessage,
              type: 'error',
            })

            commit(mutationTypes.loginFailure, error)
          })
      })
    } catch ({ message }) {
      commit(mutationTypes.loginFailure, message)
    }
  },

  // async [actionsTypes.loginWithGoogle]({ commit }) {
  //   commit(mutationTypes.loginWithGoogleStart)

  //   const provider = await new firebase.auth.GoogleAuthProvider()
  //   fb.auth
  //     .signInWithPopup(provider)
  //     .then(() => {
  //       commit(mutationTypes.loginWithGoogleSuccess)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //       commit(mutationTypes.loginWithGoogleFailure)
  //     })
  // },

  async [actionsTypes.logout]({ commit }) {
    commit(mutationTypes.logoutStart)
    try {
      await fb.auth.signOut()
      commit(mutationTypes.logoutSuccess)
      location.reload()
    } catch ({ message }) {
      commit(mutationTypes.logoutFailure, message)
    }
  },

  async [actionsTypes.deleteAccount]({ commit }) {
    commit(mutationTypes.deleteAccountStart)

    const uid = fb.auth.currentUser.uid
    const email = fb.auth.currentUser.email

    await fb.postsCollection
      .where('userId', '==', uid)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()
        })
      })

    await fb.listsCollection
      .where('userId', '==', uid)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()
        })
      })

    await fb.usersCollection
      .where('email', '==', email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete()
        })
      })

    const listRef = fb.storage.ref(`users/${uid}`)
    listRef
      .listAll()
      .then((res) => {
        res.items.forEach((itemRef) => {
          itemRef.delete()
        })
      })
      .catch((error) => {
        console.log(error)
      })

    const user = fb.auth.currentUser
    user
      .delete()
      .then(() => {
        commit(mutationTypes.deleteAccountSuccess)
      })
      .catch((error) => {
        commit(mutationTypes.deleteAccountFailure, error)
      })
  },
}

export default {
  state,
  mutations,
  actions,
}
