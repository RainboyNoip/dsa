import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import category from './category.vue'
var _app=require('../config.js')

Vue.use(VueRouter)
Vue.prototype.$eventHub= Vue.prototype.$eventHub ||  new Vue()

Vue.prototype.app = _app;
//过滤器

const router = new VueRouter({
  routes:[
    {path:'/',component:category},
    {path:'/:id',component:App},
  ]
})

const VM = new Vue({
  router
})

VM.$mount('#app')
