// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import config from './config'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import './assets/material.css'
import './http';
import 'element-ui/lib/theme-chalk/index.css';
import qs from 'qs'
import MyComponent from './components/MyComponent'

Vue.config.productionTip = false

// 引用qs库
Vue.prototype.$qs = qs;

// 设置主题
Vue.use(Vuetify, { theme: config.theme})

// 封装组件
Vue.use(MyComponent)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
