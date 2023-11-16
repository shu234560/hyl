import App from './App'
import store from '@/store'

import {http,togo,redirectTo,baseDev,imagesUrl} from '@/utils/utils.js'

import Vue from 'vue'
Vue.config.productionTip = false
Vue.prototype.$navTo = togo;
Vue.prototype.$redirectTo = redirectTo;
Vue.prototype.$http = http;
Vue.prototype.$baseDev = baseDev;
Vue.prototype.$imagesUrl = imagesUrl;
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()

