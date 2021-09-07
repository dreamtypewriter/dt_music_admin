<template>
    <div class="fillcontain">
        <head-top></head-top>


        <el-form style="margin-left: 200px" :model="album" :rules="albumRules" ref="addAlbumForm">
            <br>
            <header style="margin-left: 300px">添加专辑</header>
            <br>
            <el-form-item label="专辑名称" label-width="100px" prop="albumName">
                <el-input v-model.trim="album.albumName" auto-complete="off" placeholder="专辑名称"
                          style="width:500px"></el-input>
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

            <el-form-item label="歌手名称" label-width="100px" prop="singerId">
                <template>
                    <el-select v-model="singer.singerName" filterable @change="getSingerId(singer.singerName)"
                               placeholder="歌手名称 (可根据名称模糊查询)" style="width:500px">
                        <el-option
                            v-for="singer in options"
                            :key="singer.singerId"
                            :label="singer.singerName"
                            :value="singer.singerId">
                        </el-option>
                    </el-select>
                </template>
            </el-form-item>

            <el-form-item label="发行公司" label-width="100px" prop="releaseCompany">
                <el-input v-model.trim="album.releaseCompany" auto-complete="off" placeholder="发行公司"
                          style="width:500px"></el-input>
            </el-form-item>

            <el-form-item label="发行时间" label-width="100px" prop="releaseDate">
                <template>
                    <div class="block">
                        <el-date-picker
                            v-model="album.releaseDate"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions0">
                        </el-date-picker>
                    </div>
                </template>
            </el-form-item>

            <el-form-item label="专辑简介" label-width="100px" prop="albumDescription">
                <el-input type="textarea" v-model.trim="album.albumDescription" auto-complete="off" placeholder="专辑简介"
                          style="width:500px"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer" style="margin-left: 500px">
            <el-button type="primary" @click="addAlbum('addAlbumForm')">确认添加专辑</el-button>
        </div>


    </div>
</template>

<script>
    import headTop from '../components/headTop';

    export default {
        name: "addAlbum",
        data() {
            return {
                fileList: [],
                options: [],
                singer: {
                    singerId: 0,
                    singerName: ''
                },
                tableData: [],
                currentRow: null,
                searchName: '',
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
                album: {
                    albumId: 0,
                    albumName: '',
                    albumImgPath: '',
                    albumLanguage: '',
                    singerName: '',
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
                    releaseDate: [
                        {required: true, message: '请选择', trigger: 'blur' ,type:'date'},
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
            //     this.album.releaseDate = val.toLocaleString();
            // },
            getSingerId(val) {
                this.album.singer.singerId = val
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
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传图片不能超过 2MB!');
                }
                return isJPG && isLt5M;
            },
            async addAlbum(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.album.singer.singerId === 0) {
                            this.$message.error("歌手未选择!");
                            return false;
                        }
                        // if (this.album.releaseDate === null) {
                        //     this.$message.error("日期未选择!");
                        //     console.log(this.album.releaseDate)
                        //     return false;
                        // }
                        let fd = new FormData();
                        fd.append("albumName", this.album.albumName);
                        fd.append("albumLanguage", this.album.albumLanguage);
                        fd.append("singerId", this.album.singer.singerId);
                        fd.append("releaseCompany", this.album.releaseCompany);
                        fd.append("releaseDate", this.album.releaseDate);
                        fd.append("albumDescription", this.album.albumDescription);
                        let url = '/api/album/add'
                        if (this.fileList === null || this.fileList.length === 0) {
                            url = '/api/album/addNoImg'
                        }else{
                            fd.append("file", this.fileList[0].raw);
                        }
                        this.axios.post(url, fd).then(data => {
                            if (data.data == 1) {
                                this.album = {};
                                this.$message.success("新增成功！");
                            } else {
                                this.$message.success("新增失败！");
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
            //@todo
            // addAlbum() {
            //     this.axios.post('/api/album/add', this.album).then(data => {
            //         alert(this.album.singer.singerId)
            //         if (data.data == 1) {
            //             alert("新增成功！");
            //         } else {
            //             alert("新增失败！");
            //         }
            //     })
            // },
            refreshData() {
                let url = '/api/singer';
                let params = {
                    params: {
                        offset: this.offset,
                        limit: this.limit,
                        singerName: this.searchName
                    }
                };
                this.axios.get(url, params).then(data => {
                    this.options = data.data.list;
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
</style>
