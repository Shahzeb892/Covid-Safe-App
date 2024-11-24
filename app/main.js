import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import {ID_INJECTION_KEY} from "element-plus"
import store from "./store";
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()

// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	app.use(ElementPlus)
	app.use(store)
	app.provide( ID_INJECTION_KEY, {
	  prefix: Math.floor(Math.random() * 10000), // or any stable value
	  current: 0,
	});
	return {
		app
	}
}
// #endif
