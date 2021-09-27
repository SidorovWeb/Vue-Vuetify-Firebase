import Vue from 'vue'
import VueRouter from 'vue-router'
import { auth } from '../firebase/firebase'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: {
      requiresAuth: true,
      layout: 'main',
    },
  },
  {
    name: 'days',
    path: '/days/:name',
    component: () => import('@/views/Home.vue'),
    meta: {
      requiresAuth: true,
      layout: 'main',
    },
  },
  {
    name: 'priority',
    path: '/priority/:name',
    component: () => import('@/views/Home.vue'),
    meta: {
      requiresAuth: true,
      layout: 'main',
    },
  },
  {
    name: 'category',
    path: '/category/:name',
    component: () => import('@/views/Home.vue'),
    meta: {
      requiresAuth: true,
      layout: 'main',
    },
  },
  {
    path: '/register',
    name: 'register',
    meta: {
      layout: 'empty',
    },
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      layout: 'empty',
    },
    component: () => import('@/views/Login.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((x) => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router
