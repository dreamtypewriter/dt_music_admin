<template>
    <div class="fillcontain">
        <head-top></head-top>
        <el-form style="margin-left: 200px" :model="song" :rules="songRules" label-width="100px" ref="addSongForm">
            <br>
            <header style="margin-left: 300px">添加歌曲</header>
            <br>

            <el-form-item label="歌曲名称" prop="songName">
                <el-input v-model.trim="song.songName" auto-complete="off" placeholder="歌曲名称" style="width:500px"></el-input>
            </el-form-item>

            <el-form-item label="歌曲图片" label-width="100px" ref="uploadElement" prop="albumImgPath">
                <el-upload
                    class="upload-demo"
                    action="#"
                    accept="image/jpeg,image/jpg,image/png"
                    ref="upload"
                    :auto-upload="false"
                    :on-change="handleImpChange"
                    :file-list="fileList">
                    <el-button type="primary">选择图片</el-button>
                </el-upload>
            </el-form-item>

            <el-form-item label="歌曲资源" label-width="100px" ref="uploadElement" prop="albumPath">

                <el-upload
                    class="upload-demo"
                    action="#"
                    ref="upload"
                    :auto-upload="false"
                    :on-change="handleMusicChange"
                    :file-list="music">
                    <el-button type="primary">选择歌曲</el-button>
                </el-upload>
            </el-form-item>

            <!--<el-form-item label="歌曲时长" prop="songLength">-->
                <!--<el-input v-model="song.songLength" auto-complete="off" placeholder="歌曲时长"-->
                          <!--style="width:500px"></el-input>-->
            <!--</el-form-item>-->

            <el-form-item label="演唱歌手" prop="singerId">
                <template>
                    <el-select v-model="singer.singerName" @change="getSingerId(singer.singerName)" filterable
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

            <el-form-item label="所属专辑" prop="albumId">
                <el-select v-model="album.albumName" @change="getAlbumId(album.albumName)" filterable
                           placeholder="专辑名称 (可根据名称模糊查询)" style="width:500px">
                    <el-option
                        v-for="album in albums"
                        :key="album.albumId"
                        :label="album.albumName"
                        :value="album.albumId">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="歌曲简介" prop="songDescription">
                <el-input type="textarea" v-model.trim="song.songDescription" auto-complete="off" placeholder="歌曲简介"
                          style="width:500px"></el-input>
            </el-form-item>

            <el-form-item label="歌曲歌词" prop="songLyrics">
                <el-input type="textarea" v-model.trim="song.songLyrics" auto-complete="off" placeholder="歌曲歌词"
                          style="width:500px"></el-input>
            </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
            <div slot="footer" class="dialog-footer" style="margin-left: 500px">
                <el-button type="primary" @click="addSong('addSongForm')">确认添加歌曲</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop';

    export default {
        name: "addSong",
        data() {
            return {
                audioDuration: 0,
                music: [],
                fileList: [],
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
                singers: [],
                albums: [],
                singer: {
                    singerId: 0,
                    singerName: ''
                },
                album: {
                    albumId: 0,
                    albumName: ''
                },
                song: {
                    songId: 0,
                    songName: '',
                    songImgPath: '',
                    songLength: '',
                    singer: {
                        singerId: 0,
                        singerName: ''
                    },
                    album: {
                        albumId: 0,
                        albumName: ''
                    },
                    songDescription: '',
                    songLyrics: ''
                },
                songRules: {
                    songName: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {maxlength: 50, message: '长度过长', trigger: 'blur'},
                    ],
                    // songLength: [
                    //     {required: true, message: '请输入', trigger: 'blur'},
                    //     {pattern: /[0-5][0-9]+:[0-5][0-9]/, message: '请按照00:00格式填写', trigger: 'blur'},
                    // ],
                    // singerId: [
                    //     {required: true, message: '请选择', trigger: 'blur'},
                    // ],
                    // albumId: [
                    //     {required: true, message: '请选择', trigger: 'blur'},
                    // ],
                    songDescription: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {maxlength: 1000, message: '长度过长', trigger: 'blur'},
                    ],
                    songLyrics: [
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
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            getSingerId(val) {
                let obj = {};
                obj = this.singers.find((singer) => {
                    return singer.singerId === val;
                });
                this.song.singer.singerName = obj.singerName;
                this.song.singer.singerId = val;
            },
            getAlbumId(val) {
                let obj = {};
                obj = this.albums.find((album) => {
                    return album.albumId === val;
                });
                this.song.album.albumName = obj.albumName;
                this.song.album.albumId = val
            },
            handleImpChange(file, fileList) {
                let bo = this.beforeAvatarUpload(file);
                if (!bo) {
                    this.fileList = [];
                    return;
                }
                this.fileList = fileList.slice(-1);
            },
            handleMusicChange(file, fileList) {
                let bo = this.beforeFileUpload(file);
                if (!bo) {
                    this.music = [];
                    return;
                }
                this.music = fileList.slice(-1);
            },
            beforeAvatarUpload(file) {
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return isLt5M;
            },
            beforeFileUpload(file) {
                const isLt50M = file.size / 1024 / 1024 < 50;
                if (!isLt50M) {
                    this.$message.error('上传文件大小不能超过 50MB!');
                }
                return isLt50M;
            },
            async addSong(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.fileList === null || this.fileList.length === 0) {
                            this.$message.error("图片未上传!");
                            return false;
                        }
                        if (this.music === null || this.music.length === 0) {
                            this.$message.error("文件未上传!");
                            return false;
                        }
                        if (this.song.singer.singerId === 0) {
                            this.$message.error("歌手未选择!");
                            return false;
                        }
                        if (this.song.album.albumId === 0) {
                            this.$message.error("专辑未选择!");
                            return false;
                        }
                        let fd = new FormData();
                        fd.append("file", this.fileList[0].raw);
                        fd.append("music", this.music[0].raw);
                        fd.append("songName", this.song.songName);
                        fd.append("singerId", this.song.singer.singerId);
                        fd.append("albumId", this.song.album.albumId);
                        fd.append("songDescription", this.song.songDescription);
                        fd.append("songLyrics", this.song.songLyrics);
                        this.axios.post('/api/song/add', fd).then(data => {
                            if (data.data == 1) {
                                this.refreshData();
                                this.fileList = [];
                                this.song= {};
                                alert("新增成功！");
                            } else {
                                alert("新增失败！");
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
            refreshData() {
                let params = {
                    params: {
                        offset: this.offset,
                        limit: this.limit,
                        singerName: this.searchName
                    }
                };

                this.axios.get('/api/singer', params).then(data => {
                    this.singers = data.data.list;
                    // console.log(data);
                    this.count = data.data.total;
                })

                this.axios.get('/api/album/listSomeAlbum', params).then(data => {
                    this.albums = data.data.list;
                    // console.log(data);
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
