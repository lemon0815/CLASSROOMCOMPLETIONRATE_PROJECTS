import Vue from 'vue';
import ElementUI from 'element-ui';
import axios from 'axios';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css';
import './styles/index.scss';
import './styles/element-variables.scss';
import App from './App.vue';
import router from './router';


Vue.use(ElementUI);

// axios
Vue.http = Vue.prototype.$http = axios;

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
