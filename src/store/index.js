import Vue from 'vue'
import Vuex from 'vuex'
// import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
    adminInfo: {
        adminId: 0,
        avatar: '/static/favicon.ico',
        token: null,
        role: 100
    },
}

const mutations = {
    saveAdminInfo(state, adminInfo) {
        state.adminInfo = adminInfo;
        localStorage.setItem('token', adminInfo.token);
        localStorage.setItem('role', adminInfo.role);
    },
    destroyAdminInfo() {
        state.adminInfo = {};
        localStorage.removeItem('token');
    }
}

const actions = {}

export default new Vuex.Store({
    state,
    actions,
    mutations,
})
