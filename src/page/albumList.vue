<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container">
            <el-form :inline="true">
                <el-form-item label="专辑名称">
                    <el-input v-model="searchName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch"><i class="el-icon-search"></i></el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleReset">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
        <div class="table_container">
            <el-table :data="tableData" style="width: 100%">

                <el-table-column prop="albumId" label="编号"></el-table-column>

                <el-table-column prop="albumName" label="专辑名称"></el-table-column>

                <el-table-column prop="albumImgPath" label="专辑图片" style="width: 50px; height: 50px">
                    <template slot-scope="scorp">
                        <el-popover placement="left" trigger="hover">
                            <img :src="scorp.row.albumImgPath">
                            <img slot="reference" :src="scorp.row.albumImgPath" style="width:50px;height: 50px">
                        </el-popover>
                    </template>
                </el-table-column>


                <el-table-column prop="albumLanguage" label="专辑语言"></el-table-column>

                <el-table-column prop="collectionCount" label="收藏量"></el-table-column>

                <el-table-column prop="singer.singerName" label="歌手名称"></el-table-column>

                <el-table-column prop="releaseCompany" label="发行公司"></el-table-column>

                <el-table-column prop="albumDescription" label="专辑简介"></el-table-column>

                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">

                        <el-button @click="editAlbum(scope.row.albumId)" size="small"><i class="el-icon-edit"></i>
                        </el-button>

                        <el-button type="danger" @click="delAlbum(scope.row.albumId)" size="small"><i
                            class="el-icon-delete2"></i></el-button>

                    </template>
                </el-table-column>
            </el-table>

        </div>
        <div class="Pagination" style="text-align: left;margin-top: 10px;">
            <el-pagination style="margin-left: 500px"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="currentPage"
                           :page-size="20"
                           :pager-count="5"
                           layout="total, prev, pager, next"
                           :total="albumCount">
            </el-pagination>
        </div>
        <el-dialog title="修改专辑信息" v-model="updateFormVisible">
            <el-form :model="album" :rules="albumRules" ref="updateAlbumForm">
                <el-form-item label="专辑名称" label-width="100px" prop="albumName">
                    <el-input v-model.trim="album.albumName" style="width:500px"></el-input>
                </el-form-item>

                <el-form-item label="专辑图片" label-width="100px" ref="uploadElement" prop="albumImgPath">
                    <el-upload
                        class="upload-demo"
                        action="#"
                        accept="image/jpeg,image/jpg,image/png"
                        ref="upload"
                        :auto-upload="false"
                        :on-change="handleChange"
                        :file-list="fileList">
                        <el-button type="primary">选择图片</el-button>
                    </el-upload>
                </el-form-item>

                <el-form-item label="专辑语言" label-width="100px" prop="albumLanguage">
                    <el-select v-model="album.albumLanguage" placeholder="专辑语言" style="width:500px">
                        <el-option label="华语" value="华语"></el-option>
                        <el-option label="日本" value="日本"></el-option>
                        <el-option label="欧美" value="欧美"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                    </el-select>

                </el-form-item>

                <el-form-item label="歌手名称" label-width="100px" prop="singerName">
                    <template>
                        <el-select v-model="album.singer.singerId" @change="getSingerId(album.singer.singerId)"
                                   filterable
                                   placeholder="歌手名称 (可根据名称模糊查询)" style="width:500px">
                            <el-option
                                v-for="singer in singers"
                                :key="singer.singerId"
                                :label="singer.singerName"
                                :value="singer.singerId">
                            </el-option>
                        </el-select>
                    </template>
                </el-form-item>


                <el-form-item label="发行公司" label-width="100px" prop="releaseCompany">
                    <el-input v-model.trim="album.releaseCompany" style="width: 500px"></el-input>
                </el-form-item>

                <el-form-item label="发行时间" label-width="100px" prop="releaseDate">
                    <template>
                        <div class="block">
                            <el-date-picker
                                v-model="album.releaseDate"
                                value-format="yyyy-MM-dd"
                                type="date"

                                placeholder="选择日期"
                                :picker-options="pickerOptions0">
                            </el-date-picker>
                        </div>
                    </template>
                </el-form-item>

                <el-form-item label="专辑简介" label-width="100px" prop="albumDescription">
                    <el-input v-model.trim="album.albumDescription" style="width: 500px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateAlbum('updateAlbumForm')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import headTop from '../components/headTop';

    export default {
        name: "albumList",
        data() {
            return {
                fileList: [],
                singers: [],
                tableData: [],
                currentRow: null,
                searchName: '',
                offset: 0,
                limit: 20,
                count: 0,
                albumCount: 0,
                currentPage: 1,
                singer: {
                    singerId: 0,
                    singerName: ''
                },
                album: {
                    albumId: 0,
                    albumName: '',
                    albumImgPath: '',
                    albumLanguage: '',
                    releaseCompany: '',
                    releaseDate: '',
                    albumDescription: '',
                    singer: {
                        singerId: 0,
                        singerName: ''
                    },
                },
                addFormVisible: false,
                updateFormVisible: false,
                albumRules: {
                    albumName: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {maxlength: 50, message: '长度过长', trigger: 'blur'},
                    ],
                    albumLanguage: [
                        {required: true, message: '请选择', trigger: 'blur'},
                    ],
                    releaseCompany: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {maxlength: 50, message: '长度过长', trigger: 'blur'},
                    ],
                    albumDescription: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {maxlength: 1000, message: '长度过长', trigger: 'blur'},
                    ]
                },
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
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
            // getSTime(val){
            //     this.album.releaseDate = val;
            // },
            getSingerId(val) {
                this.album.singer.singerId = val
            },
            handleSizeChange(val) {
                // console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1) * this.limit;
                this.refreshData();
            },
            handleSearch() {
                this.refreshData();
            },
            handleReset() {
                this.searchName = '';
                this.currentPage = 1;
                this.refreshData();
            },
            refreshData() {

                let params = {
                    params: {
                        offset: this.offset,
                        limit: this.limit,
                        albumName: this.searchName
                    }
                };
                this.axios.get('/api/album/listSomeAlbum', params).then(data => {
                    this.tableData = data.data.list;
                    this.albumCount = data.data.total;
                })
                this.axios.get('/api/singer', params).then(data => {
                    this.singers = data.data.list;
                    // console.log('singers', this.singers)
                    this.count = data.data.total;
                })
            },
            editAlbum(albumId) {
                this.updateFormVisible = true;
                this.axios.get('/api/album/showSingleAlbum', {
                    params: {
                        albumId: albumId
                    }
                }).then(data => {
                    this.album = data.data;
                    this.album.releaseDate = new Date(data.data.releaseDate);
                    // console.log('album', this.album)
                    // console.log('album', this.album)
                })
            },
            handleChange(file, fileList) {
                let bo = this.beforeAvatarUpload(file);
                if (!bo) {
                    this.fileList = [];
                    return;
                }
                this.fileList = fileList.slice(-1);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.raw.type == 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            async updateAlbum(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {

                        let fd = new FormData();

                        fd.append("albumId", this.album.albumId)
                        fd.append("albumName", this.album.albumName);
                        fd.append("singerId", this.album.singer.singerId);
                        fd.append("albumLanguage", this.album.albumLanguage);
                        fd.append("releaseCompany", this.album.releaseCompany);
                        fd.append("releaseDate", this.album.releaseDate);
                        fd.append("albumDescription", this.album.albumDescription);
                        let url = '/api/album/update';
                        if (this.fileList === null || this.fileList.length === 0) {
                            url = 'api/album/updateNoImg'
                            fd.append("albumImgPath",this.album.albumImgPath)
                        } else {
                            fd.append("file", this.fileList[0].raw);
                        }
                        this.axios.post(url, fd).then(data => {
                            this.updateFormVisible = false;
                            if (data.data == 1) {
                                this.refreshData();
                                this.fileList = [];
                                alert("修改成功！");
                            } else {
                                alert("修改失败！");
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
            delAlbum(albumId) {
                if (confirm("确认删除？")) {
                    this.axios.get('/api/album/updateStatus', {
                        params: {
                            albumId: albumId
                        }
                    }).then(data => {
                        this.refreshData();
                        if (data.data == 1) {
                            alert("删除成功！");
                            location.reload();
                        } else {
                            alert("删除失败！");
                        }
                    })
                }
            }

        }
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .table_container {
        padding: 20px;
    }
</style>
