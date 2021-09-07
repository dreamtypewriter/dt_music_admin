<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="search_bar_container">
            <el-form :inline="true">
                <el-form-item label="检索条件">
                    <el-input v-model="searchKeyword" placeholder="资源ID/名称" :maxlength='20'>
                        <el-select v-model="keywordType" placeholder="检索方式" slot="prepend" style="width: 90px">
                            <el-option v-for="item in option1"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value"
                            ></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="资源类型">
                    <el-select v-model="searchType" style="width: 80px">
                        <el-option v-for="item in option2"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="评论状态">
                    <el-select v-model="searchStatus" style="width: 120px">
                        <el-option v-for="item in option3"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="handleSearch">
                        <i class="el-icon-search"></i>
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table :data="tableData" style="width: 100%">
                <el-table-column
                    label="#"
                    width="100">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="typeName"
                    label="资源类型"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="resourceName"
                    label="资源名称"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="userLike"
                    label="用户点赞"
                    sortable
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="adminLike"
                    label="运营点赞"
                    sortable
                    width="120">
                </el-table-column>
                <el-table-column
                    prop="replyCount"
                    label="回复数"
                    sortable
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="userNickname"
                    label="评论者"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="fansNumber"
                    label="粉丝数"
                    sortable
                    width="100">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.commentStatus>0"
                            size="small"
                            type="danger"
                            @click="handleDisable(scope.row.commentId)">禁用
                        </el-button>
                        <el-button
                            v-else
                            size="small"
                            type="success"
                            @click="handleEnable(scope.row.commentId)">启用
                        </el-button>
                        <el-button size="small" type="primary" @click="handleLike(scope.row.commentId)">
                            赞
                        </el-button>
                        <el-button size="small" @click="handleResetLike(scope.row.commentId)">
                            取消赞
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="资源ID">
                                <span>{{props.row.resourceId}}</span>
                            </el-form-item>
                            <el-form-item label="评论内容">
                                <span>{{props.row.commentContent}}</span>
                            </el-form-item>
                            <el-form-item label="创建时间">
                                <span>{{props.row.createTime}}</span>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="Pagination" style="text-align: left;margin-top: 10px;">
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
</template>

<script>
    import headTop from '../components/headTop';

    export default {
        name: "commentList",
        data() {
            return {
                /*rules: {
                    singerImg: [{required: true, message: "请输入"}],
                    singerDescription: [{required: true, message: "请输入"}]
                },*/
                tableData: [],
                currentRow: null,
                offset: 0,
                limit: 10,
                count: 0,
                currentPage: 1,
                searchKeyword: '',
                keywordType: 1,
                searchType: 0,
                searchStatus: 0,
                option1: [{
                    value: 1,
                    label: '资源ID'
                }, {
                    value: 2,
                    label: '资源名称'
                }],
                option2: [{
                    value: 0,
                    label: '全部'
                }, {
                    value: 1,
                    label: '单曲'
                }, {
                    value: 3,
                    label: '歌单'
                }, {
                    value: 4,
                    label: '专辑'
                }, {
                    value: 5,
                    label: '动态'
                }], option3: [{
                    value: 0,
                    label: '全部'
                }, {
                    value: 1,
                    label: '已启用'
                }, {
                    value: -1,
                    label: '已禁用'
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
                    let url = 'api/comment/d/' + commentID;
                    this.axios.delete(url).then(data => {
                        this.refreshData();
                        // console.log(data);
                        if (data.status === 200) {
                            if (data.data === 1) {
                                this.$message({
                                    type: 'success',
                                    message: '已封禁！'
                                })
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: '错误！错误代码：' + data.status
                            })
                        }
                    })
                }
            },
            handleEnable(commentID) {
                if (confirm("确认启用？")) {
                    let url = 'api/comment/e/' + commentID;
                    this.axios.delete(url).then(data => {
                        this.refreshData();
                        // console.log(data);
                        if (data.status === 200) {
                            if (data.data === 1) {
                                this.$message({
                                    type: 'success',
                                    message: '已启用！'
                                })
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: '错误！错误代码：' + data.status
                            })
                        }
                    })
                }
            },
            handleLike(commentID) {
                let url = 'api/comment/adminLike/' + commentID;
                this.axios.post(url).then(data => {
                    this.refreshData();
                    // console.log(data);
                    if (data.status === 200) {
                        if (data.data > 0) {
                            this.$message({
                                type: 'success',
                                message: '已成功！'
                            })
                        }
                    } else {
                        this.$message({
                            type: 'error',
                            message: '错误！错误代码：' + data.status
                        })
                    }
                });
            },
            handleResetLike(commentID) {
                if (confirm('确认清除运营点赞?')) {
                    let url = 'api/comment/clearAdminLike/' + commentID;
                    this.axios.post(url).then(data => {
                        this.refreshData();
                        // console.log(data);
                        if (data.status === 200) {
                            if (data.data === 0) {
                                this.$message({
                                    type: 'success',
                                    message: '已成功！'
                                })
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: '错误！错误代码：' + data.status
                            })
                        }
                    });
                }
            },
            handleSearch() {
                if (this.keywordType === 1) {
                    if (isNaN(this.searchKeyword)) {
                        this.$message({
                            type: 'error',
                            message: 'ID格式错误！'
                        });
                        return false;
                    }
                }
                this.refreshData();
            },
            handleReset() {
                this.searchKeyword = '';
                this.keywordType = 1;
                this.searchType = 0;
                this.searchStatus = 0;
                this.currentPage = 1;
                this.refreshData();
            },
            refreshData() {
                let url = '/api/comment';
                let params = {
                    params: {
                        offset: this.offset,
                        limit: this.limit,
                        searchKeyword: this.searchKeyword,
                        keywordType: this.keywordType,
                        searchType: this.searchType,
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

    .search_bar_container {
        padding: 20px 20px 0 20px;
    }
</style>
