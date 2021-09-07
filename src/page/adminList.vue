<template>
    <div class="fillcontain">
        <head-top></head-top>
        <!-- 搜索工具条 -->
        <div class="search_bar_container">
            <el-form :inline="true">
                <el-form-item label="管理员姓名">
                    <el-input v-model="searchAdminName" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="searchRoleId" placeholder="管理员权限">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="handleSearch">
                        <i class="el-icon-search"></i>
                    </el-button>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleAdd">
                        <i class="el-icon-plus"></i>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 表格区域 -->
        <div class="table_container">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    label="#"
                    width="100">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="adminName"
                    label="姓名">
                </el-table-column>
                <el-table-column
                    prop="adminPhone"
                    label="电话">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="注册日期">
                </el-table-column>
                <el-table-column
                    prop="role.roleName"
                    label="级别">
                </el-table-column>
                <el-table-column label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.adminId > 1"
                            size="small"
                            type="primary"
                            @click="handleEdit(scope.row)"><i class="el-icon-edit"></i>
                        </el-button>
                        <el-button
                            v-if="scope.row.adminId > 1"
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.row)"><i class="el-icon-delete2"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="count">
                </el-pagination>
            </div>
        </div>

        <!-- 修改对话框 -->
        <el-dialog title="修改管理员信息" v-model="updateFormVisible">
            <el-form :model="editAdmin" :rules="adminRules" ref="addAdminForm" label-width="100px">
                <el-form-item label="管理员名称" prop="adminName">
                    <el-input v-model="editAdmin.adminName" disabled></el-input>
                </el-form-item>
                <el-form-item label="管理员密码" prop="adminPassword">
                    <el-input v-model="editAdmin.adminPassword" :type="passwordType"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="showPassword" v-if="passwordType.length>0">查看密码</el-button>
                    <el-button @click="hidePassword" v-if="passwordType.length<1">隐藏密码</el-button>
                </el-form-item>
                <el-form-item label="管理员电话" prop="adminPhone">
                    <el-input v-model="editAdmin.adminPhone"></el-input>
                </el-form-item>
                <el-form-item label="管理员权限" prop="role.roleId">
                    <el-select v-model="editAdmin.role.roleId" placeholder="管理员权限">
                        <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="modifyAdmin('addAdminForm')">确 定</el-button>
                <el-button @click="updateFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 新增对话框 -->
        <el-dialog title="添加管理员" v-model="addFormVisible">
            <el-form :model="newAdmin" :rules="adminRules" ref="addAdminForm">
                <el-form-item label="管理员名称" label-width="100px" prop="adminName">
                    <el-input v-model="newAdmin.adminName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="管理员密码" label-width="100px" prop="adminPassword">
                    <el-input v-model="newAdmin.adminPassword"></el-input>
                </el-form-item>
                <el-form-item label="管理员电话" label-width="100px" prop="adminPhone">
                    <el-input v-model="newAdmin.adminPhone"></el-input>
                </el-form-item>
                <el-form-item label="管理员权限" label-width="100px" prop="role.roleId">
                    <el-select v-model="newAdmin.role.roleId" placeholder="管理员权限">
                        <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addAdmin('addAdminForm')">确 定</el-button>
                <el-button @click="addFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'

    export default {
        name: "admList",
        data() {
            return {
                tableData: [],
                currentRow: null,
                offset: 0,
                limit: 10,
                count: 0,
                currentPage: 1,
                updateFormVisible: false,
                addFormVisible: false,
                searchAdminName: '',
                searchRoleId: 0,

                passwordType: 'password',


                editAdmin: {
                    adminId: 0,
                    adminName: '',
                    adminPhone: '',
                    adminPassword: '',
                    role: {roleId: 0}
                },
                newAdmin: {
                    adminName: '',
                    adminPassword: '',
                    adminPhone: '',
                    role: {roleId: 2}
                },
                options: [
                    {
                        value: 0,
                        label: '不指定'
                    }, {
                        value: 1,
                        label: '超级管理员'
                    }, {
                        value: 2,
                        label: '普通管理员'
                    }],
                options2: [
                    {
                        value: 1,
                        label: '超级管理员'
                    }, {
                        value: 2,
                        label: '普通管理员'
                    }],
                adminRules: {
                    adminName: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {pattern: /^[A-Za-z0-9]{3,20}$/, message: '数字或字母,3-20位', trigger: 'blur'},
                    ],
                    adminPhone: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[5-6]|7[0-8]|8\d|9[1589])\d{8}$/, message: '手机号格式错误', trigger: 'blur'},
                    ],
                    adminPassword: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {pattern: /^[A-Za-z0-9]{8,50}$/, message: '数字或字母,8-50位', trigger: 'blur'},
                    ],
                    roleId: [
                        {required: true, message: '请选择', trigger: 'blur'},
                    ]
                },
            }
        },
        computed: {
            role() {
                return localStorage.getItem('role');
            }
        },
        components: {
            headTop,
        },
        created() {
            this.refreshData();
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1) * this.limit;
                this.refreshData();
            },
            async refreshData() {
                let url = '/api/admin/listAdmin';
                let params = {
                    params: {
                        offset: this.offset,
                        limit: this.limit,
                        adminName: this.searchAdminName,
                        roleId: this.searchRoleId
                    }
                }
                await this.axios.get(url, params).then(data => {
                    this.tableData = data.data.list;
                    this.count = data.data.total;
                })
            },
            handleEdit(row) {
                this.editAdmin.adminId = row.adminId;
                this.editAdmin.adminName = row.adminName;
                this.editAdmin.adminPhone = row.adminPhone;
                this.editAdmin.role.roleId = row.role.roleId;
                this.updateFormVisible = true;
            },
            modifyAdmin: function (formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let admin = this.editAdmin;
                        _this.axios.post("/api/admin/modifyAdmin/", admin).then((data) => {
                            _this.updateFormVisible = false;
                            if (data.data.errorCode === 0) {
                                _this.refreshData();
                                _this.$message.success("更新信息成功!");
                            } else {
                                _this.$message.error(data.data.errorInfo);
                            }
                        })
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
            handleDelete(row) {
                this.delAdmin(row.adminId);
            },
            delAdmin: function (id) {
                let _this = this;
                if (confirm('确认删除?')) {
                    _this.axios.get("/api/admin/delSingleAdmin/" + id).then((data) => {
                        _this.$message.success("删除管理员成功!");
                        if (data.data === 1) {
                            _this.refreshData();
                        } else {
                            _this.$message.error("删除管理员失败!");
                        }
                    })
                }
            },
            handleSearch() {
                this.refreshData();
            },
            handleAdd() {
                this.addFormVisible = true;
            },
            addAdmin(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = '/api/admin/addAdmin';
                        let params = this.newAdmin;
                        _this.axios.put(url, params).then(data => {
                            _this.addFormVisible = false;
                            if (data.data.errorCode === 0) {
                                _this.refreshData();
                                _this.$message.success("添加成功！");
                            } else {
                                _this.$message.error(data.data.errorInfo);
                            }
                        })
                    } else {
                        _this.$notify.error({
                            title: '输入错误',
                            message: '请按照规则输入',
                            offset: 100
                        });
                        return false;
                    }
                })
            },
            checkData() {
                if (this.newAdmin.adminName.trim().length === 0) {
                    this.$message.error("名称不符合要求!");
                    return false;
                }
                return true;
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

    .search_bar_container {
        padding: 20px 20px 0 20px;
    }
</style>


