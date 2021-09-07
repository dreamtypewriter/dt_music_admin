<template>
    <div class="header_container">

        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item, index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown @command="handleCommand" menu-align='start'>
            <img :src="adminInfo.avatar" class="avator" alt="头像">
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="home">首页</el-dropdown-item>
                <el-dropdown-item command="signout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    // import {signout} from '@/api/getData'
    // import {baseImgPath} from '@/config/env'
    // import {mapActions, mapState} from 'vuex'

    export default {
        data() {
            return {
                // baseImgPath,
            }
        },
        created() {
            if (!this.adminInfo.adminId) {
                let url = '/api/admin';
                this.axios.get(url).then(data => {
                    if (data.data.errorCode === 0) {
                        let adminInfo = {
                            adminId: data.data.result.adminId,
                            avatar: data.data.result.adminAvatar,
                            token: data.data.result.adminPassword,
                            role: data.data.result.role.roleId
                        };
                        this.$store.commit('saveAdminInfo', adminInfo);
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        this.$router.push('/');
                    }
                })
            }
            // if (!this.adminInfo.id) {
            // 	this.getAdminData()
            // }
        },
        computed: {
            // ...mapState(['adminInfo']),
            adminInfo() {
                return this.$store.state.adminInfo
            },
        },
        methods: {
            // ...mapActions(['getAdminData']),
            async handleCommand(command) {
                if (command === 'home') {
                    this.$router.push('/manage');
                } else if (command === 'signout') {
                    // const res = await signout()
                    let logout = await this.logout();
                    this.$store.commit('destroyAdminInfo');
                    if (logout === 0) {
                        this.$message({
                            type: 'success',
                            message: '退出成功'
                        });
                        this.$router.push('/');
                    } else {
                        this.$message({
                            type: 'error',
                            message: logout
                        });
                    }
                }
            },
            async logout() {
                let url = '/api/admin/logout/' + this.$store.state.adminInfo.adminId;
                return await this.axios.post(url).then(data => {
                    if (data.data.errorCode === 0) {
                        return 0;
                    } else return data.data.errorInfo;
                })
            }
        }
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .header_container {
        background-color: #EFF2F7;
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 20px;
    }

    .avator {
        .wh(36px, 36px);
        border-radius: 50%;
        margin-right: 37px;
    }

    .el-dropdown-menu__item {
        text-align: center;
    }
</style>
