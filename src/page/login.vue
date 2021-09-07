<template>
    <div class="login_page fillcontain">
        <transition name="form-fade" mode="in-out">
            <section class="form_contianer" v-show="showLogin">
                <el-row>
                    <img src="static/musiclogo.png" alt="logo图" height="46px" width="170px">
                </el-row>
                <el-form :model="loginForm" :rules="rules" ref="loginForm">
                    <el-form-item prop="adminName">
                        <el-input v-model="loginForm.adminName" placeholder="用户名"><span>dsfsf</span></el-input>
                    </el-form-item>
                    <el-form-item prop="adminPassword">
                        <el-input type="password" placeholder="密码" v-model="loginForm.adminPassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="doLogin('loginForm')" class="submit_btn">登陆</el-button>
                    </el-form-item>
                </el-form>
                <p class="tip">注册账号请联系超级管理员</p>
            </section>
        </transition>
    </div>
</template>

<script>
    // import {login, getAdminInfo} from '@/api/getData'
    import {/*mapActions,*/ mapState} from 'vuex'

    export default {
        data() {
            return {
                loginForm: {
                    adminName: '',
                    adminPassword: '',
                },
                rules: {
                    adminName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    adminPassword: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                },
                showLogin: false,
            }
        },
        mounted() {
            this.showLogin = true;
            // if (!this.adminInfo.id) {
            //     this.getAdminData()
            // }
        },
        computed: {
            // ...mapState(['adminInfo']),
        },
        methods: {
            // ...mapActions(['getAdminData']),
            doLogin(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '/api/admin';
                        let params = _this.loginForm;
                        _this.axios.post(url, params).then(data => {
                                if (data.data.errorCode === 0) {
                                    _this.$message({
                                        type: 'success',
                                        message: '登录成功!'
                                    });
                                    let adminInfo = {
                                        adminId: data.data.result.adminId,
                                        avatar: data.data.result.adminAvatar,
                                        token: data.data.result.adminPassword,
                                        role: data.data.result.role.roleId
                                    };
                                    this.$store.commit('saveAdminInfo', adminInfo);
                                    _this.$router.push('manage');
                                } else {
                                    _this.$message({
                                        type: 'error',
                                        message: data.data.errorInfo
                                    });
                                }
                            }
                        )
                        //const res = await login({user_name: this.loginForm.adminName, password: this.loginForm.password})
                    } else {
                        this.$notify.error({
                            title: '未输入',
                            message: '请填写用户名和密码',
                            offset: 100
                        });
                        return false;
                    }
                });
            },
        },
        /*watch: {
            adminInfo: function (newValue) {
                if (newValue.id) {
                    this.$message({
                        type: 'success',
                        message: '检测到您之前登录过，将自动登录'
                    });
                    this.$router.push('manage')
                }
            }
        }*/
    }
</script>

<style lang="less" scoped>
    @import '../style/mixin';

    .login_page {
        background-color: #324057;
    }

    .manage_tip {
        position: absolute;
        width: 100%;
        top: -100px;
        left: 0;

        p {
            font-size: 34px;
            color: #fff;
        }
    }

    .form_contianer {
        .wh(350px, 250px);
        .ctp(350px, 250px);
        padding: 20px;
        border-radius: 5px;
        text-align: center;
        background-color: #fff;

        .submit_btn {
            width: 100%;
            font-size: 16px;
        }
    }

    .tip {
        font-size: 12px;
        color: grey;
    }

    .form-fade-enter-active, .form-fade-leave-active {
        transition: all 1s;
    }

    .form-fade-enter, .form-fade-leave-active {
        transform: translate3d(0, -50px, 0);
        opacity: 0;
    }
</style>
