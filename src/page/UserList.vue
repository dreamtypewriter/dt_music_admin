<template>
    <div class="fillcontain">
        <head-top></head-top>
        <!-- 搜索工具条 -->
        <div class="search_bar_container">
            <el-form :inline="true">
                <el-form-item label="用户名">
                    <el-input v-model="searchUserName" :maxlength='20'></el-input>
                </el-form-item>
                <el-form-item label="账号状态">
                    <el-select v-model="searchStatus" style="width: 120px">
                        <el-option v-for="item in options"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="handleSearch"
                               ><i class="el-icon-search"></i>
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>

        <!-- 表格区域 -->
        <div class="table_container">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column
                    prop="userId"
                    label="ID">
                </el-table-column>
                <el-table-column
                    prop="userAvatar"
                    label="头像">
                    <template slot-scope="scope">
                        <img :src="scope.row.userAvatar" class="rounded-circle" alt="头像">
                    </template>
                </el-table-column>
                <el-table-column
                    prop="userNickname"
                    label="昵称">
                </el-table-column>
                <el-table-column
                    prop="fansNumber"
                    label="粉丝数">
                </el-table-column>
                <el-table-column
                    prop="followedNumber"
                    label="关注数">
                </el-table-column>
                <el-table-column
                    prop="createDate"
                    label="创建日期">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.userStatus>0"
                            size="small"
                            type="danger"
                            @click="handleDisable(scope.row.userId)">封禁
                        </el-button>
                        <el-button
                            v-else
                            size="small"
                            type="success"
                            @click="handleEnable(scope.row.userId)">解封
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="Pagination" style="text-align: left;margin-top: 10px;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-size="5"
                layout="total, prev, pager, next"
                :total="count">
            </el-pagination>
        </div>


    </div>
</template>

<script>
    import headTop from '../components/headTop';

    export default {
        name: "userList",
        data() {
            return {
                tableData: [],
                currentRow: null,
                offset: 0,
                limit: 5,
                count: 0,
                currentPage: 1,
                searchUserName: '',
                searchStatus: 0,
                options: [{
                    value: 0,
                    label: '全部'
                }, {
                    value: 1,
                    label: '已启用'
                }, {
                    value: -1,
                    label: '已封禁'
                }]
            }
        },
        components: {
            headTop
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
            handleDisable(commentID) {
                if (confirm("确认封禁？")) {
                    let url = 'api/user/d/' + commentID;
                    this.axios.delete(url).then(data => {
                        if (data.data.errorCode === 0) {
                            this.refreshData();
                            this.$message({
                                type: 'success',
                                message: '封禁成功!'
                            });
                        } else {
                            _this.$message({
                                type: 'error',
                                message: data.data.errorInfo
                            });
                        }
                    })
                }
            },
            handleEnable(commentID) {
                if (confirm("确认启用？")) {
                    let url = 'api/user/e/' + commentID;
                    this.axios.delete(url).then(data => {
                        if (data.data.errorCode === 0) {
                            this.refreshData();
                            this.$message({
                                type: 'success',
                                message: '解封成功!'
                            });
                        } else {
                            _this.$message({
                                type: 'error',
                                message: data.data.errorInfo
                            });
                        }
                    })
                }
            },
            handleSearch() {
                this.refreshData();
            },
            handleReset() {
                this.searchUserName = '';
                this.searchStatus = 0;
                this.refreshData();
            },
            refreshData() {
                let url = '/api/user/list';
                let params = {
                    params: {
                        offset: this.offset,
                        limit: this.limit,
                        searchUserName: this.searchUserName,
                        searchStatus: this.searchStatus
                    }
                };
                this.axios.get(url, params).then(data => {
                    this.tableData = data.data.list;
                    this.count = data.data.total;
                })
            }
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

    .demo-table-expand {
        font-size: 0;
    }

    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }

    .rounded-circle {
        .wh(50px, 50px);
        border-radius: 50%;
    }
</style>
