import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import './plugins/vuescroll'
import './styles/styles.scss'
import { auth } from './firebase/firebase'
import { actionsTypes as profile } from '@/store/modules/profile'

Vue.config.productionTip = false

let app

if (!app) {
  var newDiv = document.createElement('div')
  newDiv.innerHTML = `<div style="background-color: #000; min-height: 100vh; width: 100%; display: flex; justify-content: center;
  align-items: center;">

  <svg
  id="Layer_1"
  enable-background="new 0 0 511.428 511.428"
  height="200"
  viewBox="0 0 511.428 511.428"
  width="200"
  xmlns="http://www.w3.org/2000/svg"
>
  <g>
    <g>
      <path
        d="m255.714 0-10.666 266.666 10.666 244.762 196.333-87.7v-423.728z"
        fill="#7fc0fd"
      />
      <path d="m59.381 0v423.728l196.333 87.7v-511.428z" fill="#9ccefd" />
    </g>
    <g>
      <path
        d="m141.9 369.133-.284-129.616h43.226c17.177 0 32.111 7.324 42.052 20.622 8.605 11.511 13.153 26.78 13.153 44.157 0 36.859-22.76 64.01-54.118 64.558-8.05.141-44.029.279-44.029.279zm29.772-99.616c.021 12.047.088 57.896.125 69.479 5.158-.036 10.429-.082 13.61-.137 12.265-.215 24.641-10.985 24.641-34.563 0-32.271-19.292-34.779-25.205-34.779z"
        fill="#fffbf5"
      />
      <path
        d="m322.011 370.593c-36.556 0-66.297-29.741-66.297-66.297s29.741-66.297 66.297-66.297 66.297 29.741 66.297 66.297c0 36.557-29.741 66.297-66.297 66.297zm0-102.593c-20.014 0-36.297 16.283-36.297 36.297s16.283 36.297 36.297 36.297 36.297-16.283 36.297-36.297c0-20.015-16.283-36.297-36.297-36.297z"
        fill="#f7f0eb"
      />
    </g>
    <g>
      <path
        d="m232.724 77.072h-86.658v30h28.214v102.593h30v-102.593h28.444z"
        fill="#fffbf5"
      />
      <g>
        <path
          d="m305.066 77.072c-19.584 0-37.205 8.541-49.352 22.088l-5.735 44.209 5.735 44.209c12.147 13.546 29.768 22.088 49.352 22.088 36.556 0 66.297-29.741 66.297-66.297s-29.741-66.297-66.297-66.297zm0 102.593c-20.014 0-36.297-16.283-36.297-36.297s16.283-36.297 36.297-36.297 36.297 16.283 36.297 36.297c0 20.015-16.283 36.297-36.297 36.297z"
          fill="#f7f0eb"
        />
        <path
          d="m238.769 143.369c0 16.972 6.418 32.469 16.945 44.209v-88.419c-10.527 11.74-16.945 27.237-16.945 44.21z"
          fill="#fffbf5"
        />
      </g>
    </g>
  </g>
</svg>
  </div>`

  document.body.appendChild(newDiv)
}

setTimeout(() => {
  auth.onAuthStateChanged((user) => {
    if (!app) {
      app = new Vue({
        router,
        store,
        vuetify,
        render: (h) => h(App),
      }).$mount('#app')
    }

    if (user) {
      store.dispatch(profile.fetchUserProfile, user).then(() => {
        if (
          router.currentRoute.path === '/login' ||
          router.currentRoute.path === '/register'
        ) {
          router.push('/')
        }
      })
    }
  })
  newDiv.remove()
}, 1500)
