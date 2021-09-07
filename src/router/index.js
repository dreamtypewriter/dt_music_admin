import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
// const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
// const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
// const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
// const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');
// 新增部分
const singerList = r => require.ensure([], () => r(require('@/page/singerList')), 'singerList');
const commentList = r => require.ensure([], () => r(require('@/page/commentList')), 'commentList');
const albumList = r => require.ensure([], () => r(require('@/page/albumList')), 'albumList');
const addAlbum = r => require.ensure([], () => r(require('@/page/addAlbum')), 'addAlbum');
const songList = r => require.ensure([], () => r(require('@/page/songList')), 'songList');
const addSong = r => require.ensure([], () => r(require('@/page/addSong')), 'addSong');
const bannerList = r => require.ensure([], () => r(require('@/page/bannerList')), 'bannerList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const songListCategory = r => require.ensure([], () => r(require('@/page/songListCategory')), 'songListCategory');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');

const routes = [
    {
        path: '/',
        component: login
    },
    {
        path: '/manage',
        component: manage,
        name: '',
        children: [{
            path: '',
            component: home,
            meta: [],
        }, {
            path: '/singerList',
            component: singerList,
            meta: ['数据管理', '歌手管理'],
        }, {
            path: '/commentList',
            component: commentList,
            meta: ['数据管理', '评论管理'],
        }, {
            path: '/albumList',
            component: albumList,
            meta: ['数据管理', '专辑管理'],
        }, {
            path: '/songList',
            component: songList,
            meta: ['数据管理', '歌曲管理'],
        }, {
            path: '/bannerList',
            component: bannerList,
            meta: ['数据管理', '推广图片管理'],
        }, {
            path: '/songListCategory',
            component: songListCategory,
            meta: ['数据管理', '歌单标签管理']
        }, {
            path: '/userList',
            component: userList,
            meta: ['数据管理', '用户管理']
        }, {
            path: '/addAlbum',
            component: addAlbum,
            meta: ['添加数据', '添加专辑'],
        }, {
            path: '/addSong',
            component: addSong,
            meta: ['添加数据', '添加歌曲'],
        }, {
            path: '/adminList',
            component: adminList,
            meta: ['管理员设置', '管理员管理']
        }, {
            path: '/adminSet',
            component: adminSet,
            meta: ['管理员设置', '信息更新']
        }

            /*
            {
            path: '/visitor',
            component: visitor,
            meta: ['图表', '用户分布'],
        },{
            path: '/newMember',
            component: newMember,
            meta: ['图表', '用户数据'],
        }, {
            path: '/uploadImg',
            component: uploadImg,
            meta: ['文本编辑', 'MarkDown'],
        }, {
            path: '/vueEdit',
            component: vueEdit,
            meta: ['编辑', '文本编辑'],
        }, {
            path: '/adminSet',
            component: adminSet,
            meta: ['设置', '管理员设置'],
        }, {
            path: '/sendMessage',
            component: sendMessage,
            meta: ['设置', '发送通知'],
        }, {
            path: '/explain',
            component: explain,
            meta: ['说明', '说明'],
        }*/]
    }
]

const router = new Router({
    mode: "history",
    routes,
    strict: process.env.NODE_ENV !== 'production',
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    if (to.path === '/') {
        next();
    } else {
        let token = localStorage.getItem('token');
        if (!token || token === 'null' || token === '') {
            next('/');
        } else {
            if (to.path === '/adminList' && localStorage.getItem('role') > 1) {
                next('/');
            }
            next();
        }
    }
});

export default router;
