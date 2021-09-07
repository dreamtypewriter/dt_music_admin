<template>
    <div class="fillcontain">
        <head-top></head-top>
        <!-- 搜索工具条 -->
        <div class="search_bar_container">
            <el-form :inline="true">
                <el-form-item label="标签名称">
                    <el-input v-model="categoryName" :maxlength='20'></el-input>
                </el-form-item>
                <el-form-item label="标签类型">
                    <el-select v-model="categoryTypeName" style="width: 120px">
                        <el-option v-for="item in typeList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleReset">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="queryDimCategory">
                        <i class="el-icon-search"></i>
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd()">
                        <i class="el-icon-plus"></i>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 表格区域 -->
        <div class="table_container">
            <!--当el-table元素中注入data对象数组后，在el-table-column中用
            prop属性来对应对象中的键名即可填入数据，
            用label属性来定义表格的列名。
            可以使用width属性来定义列宽。-->
            <el-table
                :data="tableData"
                style="width: 100%">
                <!--修改模态框-->
                <el-table-column
                    prop="categoryId"
                    label="编号"
                    width="350">
                </el-table-column>
                <!--                <el-table-column label="序号" width="60px" type="index">
                            <template slot-scope="scope">
                              <span>{{(pageNum- 1) * pageSize + scope.$index + 1 }}</span>
                            </template>
                        </el-table-column>-->
                <el-table-column
                    prop="categoryTypeName"
                    label="标签类型"
                    width="350">
                </el-table-column>
                <el-table-column
                    prop="categoryName"
                    label="标签名"
                    width="350">
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            size="small"
                            type="primary"
                            @click="handleEdit(scope.row)">
                            <i class="el-icon-edit"></i>
                        </el-button>
                        <el-button
                            size="small"
                            type="danger"
                            @click="handleDelete(scope.row)">
                            <i class="el-icon-delete2"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <!--current-page:当前页数，支持 .sync 修饰符-->
                <!--page-size:每页显示条目个数，支持 .sync 修饰符-->
                <!--total:总条目数, prev, pager, next-->
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="10"
                    layout="total, prev, pager, next"
                    :total="count">
                </el-pagination>
            </div>
        </div>

        <!-- 添加标签页 -->
        <el-dialog title="标签添加" :visible.sync="addFormVisible">
            <el-form :model="form" :rules="rules" ref="addCateForm">
                <el-form-item label="标签类型" :label-width="formLabelWidth" prop="categoryTypeName">
                    <el-select v-model="form.categoryTypeName" style="width: 120px">
                        <el-option v-for="item in updateTypeList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签名称" :label-width="formLabelWidth" prop="categoryName">
                    <el-input v-model="form.categoryName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addCategory('addCateForm')">确 定</el-button>
                <el-button @click="addFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 修改标签页 -->
        <el-dialog title="标签编辑" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="updateCateForm">
                <el-form-item label="标签ID" :label-width="formLabelWidth">
                    <el-input v-model="form.categoryId" disabled></el-input>
                </el-form-item>
                <el-form-item label="标签类型" :label-width="formLabelWidth" prop="categoryTypeName">
                    <el-select v-model="form.categoryTypeName" style="width: 120px">
                        <el-option v-for="item in updateTypeList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标签名称" :label-width="formLabelWidth" prop="categoryName">
                    <el-input v-model="form.categoryName" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateCategory('updateCateForm')">确 定</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop'//引入要使用的文件


    export default {
        data() {
            return {
                tableData: [],
                currentPage: 1,//当前页
                count: 0,
                offset: 0,
                limit: 10,//每页显示条数
                //显示修改模态框
                dialogFormVisible: false,
                //显示添加模态框
                addFormVisible: false,
                form: {
                    categoryId: '',
                    categoryName: '',
                    categoryTypeName: '',
                },
                formLabelWidth: '100px',
                typeList: [{
                    value: '语种',
                    label: '语种'
                }, {
                    value: '风格',
                    label: '风格'
                }, {
                    value: '场景',
                    label: '场景'
                }, {
                    value: '情感',
                    label: '情感',
                }],
                //添加修改下拉框
                updateTypeList: [{
                    value: '语种',
                    label: '语种'
                }, {
                    value: '风格',
                    label: '风格'
                }, {
                    value: '场景',
                    label: '场景'
                }, {
                    value: '情感',
                    label: '情感',
                }],
                categoryName: '',
                categoryTypeName: '',
                rules: {
                    categoryTypeName: [
                        {required: true, message: '请选择', trigger: 'blur'},
                    ],
                    categoryName: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度不能超过20', trigger: 'blur'},
                    ]
                },
            }
        },
        components: {
            headTop,//注册插件名
        },
        created() {
            this.refreshDate();
        },
        methods: {
            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1) * this.limit;
                this.refreshDate();
            },
            //刷新页面
            refreshDate() {
                let url = "/api/category/categoryList";
                let params = {
                    params: {
                        categoryName: this.categoryName,
                        categoryTypeName: this.categoryTypeName,
                        offset: this.offset,
                        limit: this.limit,
                    }
                };
                this.axios.get(url, params).then((data) => {
                    this.tableData = data.data.list;
                    this.count = data.data.total;
                })
            },
            //删除
            handleDelete(row) {
                if (confirm("确认是否删除！")) {
                    let url = "/api/category/deleteByPrimaryId/" + row.categoryId;
                    this.axios.post(url, null).then((data) => {
                        if (data.data === 1) {
                            this.$message.success("删除成功！");
                            this.refreshDate();
                        } else {
                            this.$message.error("删除失败！");
                        }
                    });
                }
            },
            //修改
            handleEdit(row) {
                this.form.categoryId = row.categoryId;
                this.form.categoryTypeName = row.categoryTypeName;
                this.form.categoryName = row.categoryName;
                this.dialogFormVisible = true;
            },
            updateCategory(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let url = "/api/category/updateByPrimaryId";
                        let params = {
                            categoryId: this.form.categoryId,
                            categoryTypeName: this.form.categoryTypeName,
                            categoryName: this.form.categoryName,
                        };
                        this.axios.post(url, params).then((data) => {
                            if (data.data === 1) {
                                _this.$message.success('修改成功!');
                                this.dialogFormVisible = false;
                                this.refreshDate();
                            } else {
                                _this.$message.error('修改失败!');
                            }
                        });
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
            //模糊查询
            queryDimCategory() {
                if (this.categoryTypeName != null && this.categoryTypeName == '请选择') {
                    this.categoryTypeName = '';
                }
                this.refreshDate();
            },
            //重置
            handleReset() {
                this.categoryName = '';
                this.categoryTypeName = '';
                this.refreshDate();
            },
            //添加
            handleAdd() {
                this.form.categoryId = '';
                this.form.categoryTypeName = '';
                this.form.categoryName = '';
                this.addFormVisible = true;
            },
            addCategory(formName) {
                let _this = this;

                if (this.form.categoryName === null || this.form.categoryName.trim() === '') {
                    _this.$notify.error({
                        title: '输入错误',
                        message: '请按照规则输入',
                        offset: 100
                    });
                } else {

                    _this.$refs[formName].validate((valid) => {
                        if (valid) {
                            let url = "/api/category/insert";
                            let params = {
                                categoryTypeName: this.form.categoryTypeName,
                                categoryName: this.form.categoryName,
                            };
                            this.axios.post(url, params).then((data) => {
                                if (data.data === 1) {
                                    this.addFormVisible = false;
                                    _this.$message.success('添加成功!');
                                    this.refreshDate();
                                } else {
                                    _this.$message.error('添加失败!');
                                }
                            });
                        } else {
                            _this.$notify.error({
                                title: '输入错误',
                                message: '请按照规则输入',
                                offset: 100
                            });
                            return false;
                        }
                    });

                }
            },
        },

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
