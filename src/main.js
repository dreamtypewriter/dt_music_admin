import Vue from 'vue'
import router from './router'

import App from './App'
import store from './store/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios'

Vue.config.productionTip = false;

// axios配置
Vue.prototype.axios = axios;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;
// http request拦截器
axios.interceptors.request.use(config => {
    if (localStorage.getItem('token')) {
        config.headers.Authorization = localStorage.getItem('token');
    }
    return config;
}, error => {
    return Promise.reject(error);
})
// http response 拦截器
/*axios.interceptors.response.use(
    response => {
        if (response.data.errno === 999) {
            router.replace('/');
            console.log("token过期");
        }
        return response;
    },
    error => {
        return Promise.reject(error);
    }
);*/

Vue.use(ElementUI);

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App}
})
