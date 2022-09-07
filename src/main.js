import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './components/vant.js'
import './rem/index.js'
import './assets/style.scss'
import Vconsole from 'vconsole'

// 在 test 环境才使用
process.NODE_ENV !== 'production' ? new Vconsole() : ''

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
