import Vue from 'vue'
import App from './App'
import store from './store/index'

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.URL = 'http://localhost';
Vue.prototype.getURL = function(url) {
	console.log(this.URL + url);
	return this.URL + url;
}

const app = new Vue({
	...App,
	store
})
app.$mount()
