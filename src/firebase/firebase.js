import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: 'AIzaSyAFNpwS8gWdMYX90ylUGoMZnlQw1yWn4KI',
  authDomain: 'todo-vue-vuetify-511ff.firebaseapp.com',
  projectId: 'todo-vue-vuetify-511ff',
  storageBucket: 'todo-vue-vuetify-511ff.appspot.com',
  messagingSenderId: '1061385908268',
  appId: '1:1061385908268:web:a1ae6dd9b352e9482fa189',
}

firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

// collection references
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const listsCollection = db.collection('lists')

// export utils/refs
export { db, auth, storage, usersCollection, postsCollection, listsCollection }
