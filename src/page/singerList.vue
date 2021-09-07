<template>
    <div class="fillcontain">
        <head-top></head-top>
        <!-- 搜索工具条 -->
        <div class="search_bar_container">
            <el-form :inline="true">
                <el-form-item label="歌手姓名">
                    <el-input v-model="searchName" :maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="类别">
                    <el-select v-model="searchType" style="width: 80px" placeholder="类别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                        <el-option label="组合" value="组合"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语种">
                    <el-select v-model="searchLanguage" style="width: 80px" placeholder="语种">
                        <el-option label="华语" value="华语"></el-option>
                        <el-option label="日韩" value="日韩"></el-option>
                        <el-option label="欧美" value="欧美"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleReset">重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">
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
                highlight-current-row
                style="width: 100%">
                <el-table-column
                    label="#"
                    width="100">
                    <template slot-scope="scope">
                        <span>{{scope.$index + 1}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="singerName"
                    label="歌手姓名"
                >
                </el-table-column>
                <el-table-column prop="singerImg" label="歌手图片" style="width: 50px; height: 50px">
                    <template slot-scope="scope">
                        <el-popover placement="left" trigger="hover">
                            <img :src="scope.row.singerImg" style="max-height: 300px;max-width: 300px" alt="歌手图">
                            <img slot="reference" :src="scope.row.singerImg" style="width:50px;height: 50px" alt="歌手图">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="singerType"
                    label="歌手类别">
                </el-table-column>
                <el-table-column
                    prop="singerLanguage"
                    label="歌手语种">
                </el-table-column>
                <el-table-column
                    prop="collectionCount"
                    label="收藏量">
                </el-table-column>
                <el-table-column label="操作" width="200">
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
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="8"
                    layout="total, prev, pager, next"
                    :total="count">
                </el-pagination>
            </div>
        </div>

        <!-- 新增对话框 -->
        <el-dialog title="新增歌手" v-model="addFormVisible">
            <el-form :model="editSinger" :rules="singerRules" ref="addSingerForm">
                <el-form-item label="歌手名" label-width="100px" prop="singerName">
                    <el-input v-model="editSinger.singerName"></el-input>
                </el-form-item>
                <el-form-item label="歌手图片" label-width="100px" ref="uploadElement" prop="singerImg">
                    <el-upload
                        name="addImg"
                        action="#"
                        accept="image/jpeg,image/jpg,image/png"
                        ref="upload"
                        :auto-upload="false"
                        :on-change="handleAddImgChange"
                        :file-list="singerImgList">
                        <el-button type="primary">选择图片</el-button>
                    </el-upload>
                    <img :src="imgPreviewPath" width="50px" height="50px" alt="预览" v-if="imgPreviewPath.length>0">
                </el-form-item>
                <el-form-item label="歌手类别" label-width="100px" prop="singerType">
                    <el-select v-model="editSinger.singerType" placeholder="歌手类别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                        <el-option label="组合" value="组合"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="歌手语种" label-width="100px" prop="singerLanguage">
                    <el-select v-model="editSinger.singerLanguage" placeholder="歌手语种">
                        <el-option label="华语" value="华语"></el-option>
                        <el-option label="日韩" value="日韩"></el-option>
                        <el-option label="欧美" value="欧美"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="歌手简介" label-width="100px" prop="singerDescription">
                    <el-input type="textarea" v-model="editSinger.singerDescription" :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addSinger('addSingerForm')">确 定</el-button>
                <el-button @click="clearDialogs">取 消</el-button>
            </div>
        </el-dialog>

        <!-- 修改对话框 -->
        <el-dialog title="修改歌手信息" v-model="updateFormVisible">
            <el-form :model="editSinger" :rules="singerRules" ref="updateSingerForm">
                <el-form-item label="歌手名" label-width="100px" prop="singerName">
                    <el-input v-model="editSinger.singerName"></el-input>
                </el-form-item>
                <el-form-item label="歌手图片" label-width="100px">
                    <el-upload
                        action="#"
                        accept="image/jpeg,image/jpg,image/png"
                        ref="upload2"
                        :auto-upload="false"
                        :on-change="handleAddImgChange"
                        :file-list="singerImgList2">
                        <el-button type="primary">选择图片</el-button>
                    </el-upload>
                    <img :src="imgPreviewPath" width="50px" height="50px" alt="预览" v-if="imgPreviewPath.length>0">
                </el-form-item>
                <el-form-item label="歌手类别" label-width="100px" prop="singerType">
                    <el-select v-model="editSinger.singerType" placeholder="歌手类别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                        <el-option label="组合" value="组合"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="歌手语种" label-width="100px" prop="singerLanguage">
                    <el-select v-model="editSinger.singerLanguage" placeholder="歌手语种">
                        <el-option label="华语" value="华语"></el-option>
                        <el-option label="日韩" value="日韩"></el-option>
                        <el-option label="欧美" value="欧美"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="歌手简介" label-width="100px" prop="singerDescription">
                    <el-input type="textarea" v-model="editSinger.singerDescription" :rows="4"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateSinger('updateSingerForm')">确 定</el-button>
                <el-button @click="clearDialogs">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop';

    export default {
        name: "singerList",
        data() {
            return {
                // 文件相关变量
                singerImgFile: null,
                imgPreviewPath: '',
                singerImgList: [],
                singerImgList2: [],
                // 表格和分页变量
                tableData: [],
                offset: 0,
                limit: 8,
                count: 0,
                currentPage: 1,
                // 对话框和增,改变量
                addFormVisible: false,
                updateFormVisible: false,
                editSinger: {
                    singerId: 0,
                    singerImg: '',
                    singerName: '',
                    singerType: '',
                    singerLanguage: '',
                    singerDescription: '',
                },
                // 搜索变量
                searchName: '',
                searchType: '',
                searchLanguage: '',
                // 校验规则
                singerRules: {
                    singerName: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {maxlength: 50, message: '长度过长', trigger: 'blur'},
                    ],
                    singerImg: [
                        {required: true, message: '请上传图片', trigger: 'blur'},
                    ],
                    singerType: [
                        {required: true, message: '请选择', trigger: 'blur'},
                    ],
                    singerLanguage: [
                        {required: true, message: '请选择', trigger: 'blur'},
                    ],
                    singerDescription: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {maxlength: 1000, message: '长度过长', trigger: 'blur'},
                    ],
                },
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
            handleEdit(row) {
                this.editSinger.singerId = row.singerId;
                this.editSinger.singerImg = row.singerImg;
                this.editSinger.singerName = row.singerName;
                this.editSinger.singerType = row.singerType;
                this.editSinger.singerLanguage = row.singerLanguage;
                this.editSinger.singerDescription = row.singerDescription;
                this.addFormVisible = false;
                this.updateFormVisible = true;
            },
            handleDelete(row) {
                if (confirm("确认删除？")) {
                    this.deleteSinger(row.singerId);
                }
            },
            handleSearch() {
                this.refreshData();
            },
            handleReset() {
                this.searchName = '';
                this.searchType = '';
                this.searchLanguage = '';
                this.currentPage = 1;
                this.refreshData();
            },
            clearDialogs() {
                this.editSinger = {
                    singerId: 0,
                    singerImg: '测试',
                    singerName: '',
                    singerType: '',
                    singerLanguage: '',
                    singerDescription: '',
                };
                this.singerImgFile = null;
                this.imgPreviewPath = '';
                this.addFormVisible = false;
                this.updateFormVisible = false;
                if (this.$refs.upload) {
                    this.$refs.upload.clearFiles();
                }
                if (this.$refs.upload2) {
                    this.$refs.upload2.clearFiles();
                }
            },
            handleAdd() {

                this.updateFormVisible = false;
                this.addFormVisible = true;
            },
            handleAddImgChange(file, fileList) {
                if (!this.checkUploadFile(file)) {
                    this.singerImgList = [];
                    this.singerImgList2 = [];
                    return false;
                }
                this.imgPreviewPath = file.url;
                this.editSinger.singerImg = '1';
                this.singerImgFile = file;
                // this.singerImgList = fileList;
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
            addSinger(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (_this.editSinger.singerName.trim().length === 0) {
                            _this.$message.error("歌手名不符合要求!");
                            return false;
                        }
                        if (_this.editSinger.singerDescription.trim().length === 0) {
                            _this.$message.error("歌手简介不符合要求!");
                            return false;
                        }
                        if (_this.singerImgFile === null || this.singerImgFile.size === 0) {
                            _this.$message.error("文件未上传!");
                            return false;
                        }
                        let url = '/api/singer/add';
                        let formData = new FormData();
                        formData.append("singerImgFile", _this.singerImgFile.raw);
                        formData.append("singerName", _this.editSinger.singerName);
                        formData.append("singerType", _this.editSinger.singerType);
                        formData.append("singerLanguage", _this.editSinger.singerLanguage);
                        formData.append("singerDescription", _this.editSinger.singerDescription);
                        this.axios.post(url, formData).then(data => {
                            _this.clearDialogs();
                            if (data.data === 1) {
                                _this.refreshData();
                                _this.$message.success('新增成功!');
                            } else {
                                _this.$message.error('新增失败!');
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
            updateSinger(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (_this.editSinger.singerDescription.trim().length === 0) {
                            _this.$message.error("歌手简介不符合要求!");
                            return false;
                        }

                        let url = '/api/singer/update';
                        let formData = new FormData();
                        formData.append('singerId', this.editSinger.singerId);
                        formData.append('singerName', this.editSinger.singerName);
                        formData.append("singerType", this.editSinger.singerType);
                        formData.append("singerLanguage", this.editSinger.singerLanguage);
                        formData.append("singerDescription", this.editSinger.singerDescription);
                        if (this.singerImgFile === null || this.singerImgFile.size === 0) {
                            url = '/api/singer/updateNoImg';
                            formData.append("singerImg", _this.editSinger.singerImg);
                        } else {
                            formData.append("singerImgFile", this.singerImgFile.raw);
                        }
                        this.axios.post(url, formData).then(data => {
                            _this.clearDialogs();
                            if (data.data === 1) {
                                _this.refreshData();
                                _this.$message.success('修改成功!');
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
            deleteSinger(singerId) {
                let _this = this;
                let url = '/api/singer/' + singerId;
                this.axios.delete(url, null).then(data => {
                    if (data.data === 1) {
                        this.refreshData();
                        _this.$message.success('删除成功!');
                    } else {
                        _this.$message.error('删除失败!');
                    }
                });
            },
            refreshData() {
                let url = '/api/singer';
                let params = {
                    params: {
                        offset: this.offset,
                        limit: this.limit,
                        singerName: this.searchName,
                        singerType: this.searchType,
                        singerLanguage: this.searchLanguage
                    }
                };
                this.axios.get(url, params).then(data => {
                    this.count = data.data.total;
                    this.tableData = data.data.list;
                })
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
