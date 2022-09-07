import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue')
  },
  {
    path: '/center',
    name: 'center',
    component: () => import(/* webpackChunkName: "about" */ '../views/center/center.vue')
  },
  {
    path: '/center',
    name: 'center',
    meta: { // 是否缓存页面
      // keepAlive: true
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/center/center.vue')
  },
  {
    path: '/volumeOneStart',
    name: 'volumeOneStart',
    component: () => import(/* webpackChunkName: "about" */ '../views/volume/volumeOneStart.vue')
  },
  {
    path: '/waitTime',
    name: 'waitTime',
    component: () => import(/* webpackChunkName: "about" */ '../views/waitTime/waitTime.vue')
  },
  {
    path: '/chooseGroup',
    name: 'chooseGroup',
    component: () => import(/* webpackChunkName: "about" */ '../views/volume/chooseGroup.vue')
  },
  {
    path: '/start',
    name: 'Start',
    component: () => import(/* webpackChunkName: "start" */ '../views/game/start.vue')
  },
  {
    path: '/prepare',
    name: 'Prepare',
    component: () => import(/* webpackChunkName: "prepare" */ '../views/game/prepare.vue')
  },
  {
    path: '/answer',
    name: 'Answer',
    component: () => import(/* webpackChunkName: "answer" */ '../views/game/answer.vue')
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import(/* webpackChunkName: "result" */ '../views/game/result.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

export default router
