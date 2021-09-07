<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">
            <el-form :model="editAdmin" :rules="rules" ref="updateAdminForm"
                     label-width="100px" style="width: 500px;">
                <el-form-item label="管理员名称" label-width="100px" prop="adminName">
                    <el-input disabled v-model="editAdmin.adminName"></el-input>
                </el-form-item>
                <el-form-item label="用户头像">
                    <img :src="imgPreviewPath" class="rounded-circle" alt="预览"
                         v-if="imgPreviewPath.length>0"><br/>
                    <el-upload
                        action="#"
                        accept="image/jpeg,image/jpg,image/png"
                        ref="upload"
                        :auto-upload="false"
                        :on-change="handleAddImgChange"
                        :file-list="adminAvatarList">
                        <el-button type="primary">选择图片</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="管理员电话" label-width="100px" prop="adminPhone">
                    <el-input v-model="editAdmin.adminPhone"></el-input>
                </el-form-item>
                <el-form-item label="管理员密码" label-width="100px" prop="adminPassword">
                    <el-input v-model="editAdmin.adminPassword" :type="passwordType"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="showPassword" v-if="passwordType.length>0">查看密码</el-button>
                    <el-button @click="hidePassword" v-if="passwordType.length<1">隐藏密码</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="updateAdmin('updateAdminForm')">确 定</el-button>
                    <el-button @click="cancelEdit">取 消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'

    export default {
        name: "admList",
        data() {
            return {
                adminAvatarFile: null,
                imgPreviewPath: '',
                adminAvatarList: [],
                editAdmin: {},

                passwordType: 'password',

                rules: {
                    adminName: [
                        {required: true, message: '请输入', trigger: 'blur'},
                    ],
                    adminPhone: [
                        {required: true, message: '请输入', trigger: 'blur'},
                    ],
                    adminPassword: [
                        {required: true, message: '请输入', trigger: 'blur'},
                    ],
                },
            }
        },
        components: {
            headTop,
        },
        created() {
            this.refreshData();
        },
        methods: {
            handleAddImgChange(file) {
                if (!this.checkUploadFile(file)) {
                    this.adminAvatarFile = [];
                    this.adminAvatarList = [];
                    return false;
                }
                this.imgPreviewPath = file.url;
                this.adminAvatarFile = file;
            },
            checkUploadFile(file) {
                const isJPG = file.raw.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            updateAdmin(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (confirm("确认更新?")) {
                            let url = '/api/admin/update';
                            let formData = new FormData();
                            formData.append("adminId", _this.editAdmin.adminId);
                            formData.append("adminName", _this.editAdmin.adminName);
                            formData.append("adminPassword", _this.editAdmin.adminPassword);
                            formData.append("adminPhone", _this.editAdmin.adminPhone);
                            if (_this.adminAvatarFile === null || _this.adminAvatarFile.size === 0) {
                                url = '/api/admin/updateNoImg';
                                formData.append("adminAvatar", _this.imgPreviewPath);
                            } else {
                                formData.append("adminAvatar", _this.adminAvatarFile.raw);
                            }
                            _this.axios.post(url, formData).then(data => {
                                if (data.data.errorCode === 0) {
                                    _this.$message.success('更新成功,请重新登录!');
                                    _this.$router.push('/');
                                } else {
                                    _this.$message.error(data.data.errorInfo);
                                    _this.$router.push('/manage');
                                }
                            });
                        }
                    } else {
                        _this.$notify.error({
                            title: '输入错误',
                            message: '请按照规则输入',
                            offset: 100
                        });
                        return false;
                    }
                });

            },
            refreshData() {
                let url = '/api/admin/getAdmin';
                this.axios.get(url).then(data => {
                    if (data.data.errorCode === 0) {
                        this.editAdmin = {
                            adminId: data.data.result.adminId,
                            adminName: data.data.result.adminName,
                            adminPassword: data.data.result.adminPassword,
                            adminPhone: data.data.result.adminPhone,
                        }
                        this.imgPreviewPath = data.data.result.adminAvatar;
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('role');
                        this.$router.push('/');
                    }
                })
            },
            cancelEdit() {
                this.$router.push('manage');
            },
            showPassword() {
                this.passwordType = '';
            },
            hidePassword() {
                this.passwordType = 'password';
            },
        }
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .table_container {
        padding: 20px;
    }

    .rounded-circle {
        .wh(100px, 100px);
        border-radius: 50%;
    }
</style>


