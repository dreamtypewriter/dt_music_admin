<template>
    <div class="fillcontain">
        <head-top></head-top>

        <div class="table_container">
            <el-form :inline="true">
                <el-form-item label="歌曲名称">
                    <el-input v-model="searchSongName"></el-input>
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

                <el-table-column prop="songId" label="编号"></el-table-column>

                <el-table-column prop="songName" label="歌曲名称"></el-table-column>

                <el-table-column prop="songImgPath" label="歌曲图片" style="width: 50px; height: 50px">
                    <template slot-scope="scorp">
                        <el-popover placement="left" trigger="hover">
                            <img :src="scorp.row.songImgPath" style="max-height: 300px;max-width: 300px">
                            <img slot="reference" :src="scorp.row.songImgPath" style="width:50px;height: 50px">
                        </el-popover>
                    </template>
                </el-table-column>

                <el-table-column prop="songLength" label="歌曲时长"></el-table-column>

                <el-table-column prop="singer.singerName" label="歌手名称"></el-table-column>

                <el-table-column prop="albumDto.albumName" label="所属专辑"></el-table-column>

                <el-table-column prop="songDescription" label="歌曲描述"></el-table-column>

                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">

                        <el-button size="small" @click="editSong(scope.row.songId)"><i class="el-icon-edit"></i>
                        </el-button>

                        <el-button size="small" type="danger" @click="delSong(scope.row.songId)"><i
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
                           :total="countSong">
            </el-pagination>
        </div>

        <el-dialog title="修改歌曲信息" v-model="updateFormVisible">
            <el-form :model="song" :rules="songRules" ref="updateSongForm">
                <el-form-item label="歌曲名称" label-width="100px" prop="songName">
                    <el-input v-model.trim="song.songName" auto-complete="off" style="width:500px"></el-input>
                </el-form-item>

                <el-form-item label="歌曲图片" label-width="100px" ref="uploadElement" prop="albumImgPath">
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

                <el-form-item label="歌曲时长" label-width="100px" prop="songLength">
                    <el-input v-model="song.songLength" auto-complete="off" style="width:500px" readonly></el-input>
                </el-form-item>

                <el-form-item label="演唱歌手" label-width="100px" prop="singerName">
                    <template>
                        <el-select v-model="song.singer.singerName" @change="getSingerId(song.singer.singerName)"
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

                <el-form-item label="所属专辑" label-width="100px" prop="albumName">
                    <el-select v-model="song.albumDto.albumName" @change="getAlbumId(song.albumDto.albumName)"
                               filterable
                               placeholder="专辑名称 (可根据名称模糊查询)" style="width:500px">
                        <el-option
                            v-for="album in albums"
                            :key="album.albumId"
                            :label="album.albumName"
                            :value="album.albumId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="歌曲简介" label-width="100px" prop="songDescription">
                    <el-input v-model.trim="song.songDescription" auto-complete="off" style="width:500px"></el-input>
                </el-form-item>

                <el-form-item label="歌词内容" label-width="100px" prop="songLyrics">
                    <el-input v-model.trim="song.songLyrics" auto-complete="off" style="width:500px"></el-input>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="updateFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateSong('updateSongForm')">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import headTop from '../components/headTop';

    export default {
        name: "songList",
        data() {
            return {
                fileList: [],
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
                tableData: [],
                currentRow: null,
                searchSongName: '',
                searchSingerName: '',
                offset: 0,
                limit: 20,
                count: 0,
                countSong: 0,
                currentPage: 1,
                song: {
                    songId: 0,
                    songName: '',
                    songPath: '',
                    songImgPath: '',
                    songLength: '',
                    singer: {
                        singerId: 0,
                        singerName: ''
                    },
                    albumDto: {
                        albumId: 0,
                        albumName: ''
                    },
                    songDescription: '',
                    songLyrics: ''
                },
                addFormVisible: false,
                updateFormVisible: false,
                songRules: {
                    songName: [
                        {required: true, message: '请输入', trigger: 'blur'},
                        {maxlength: 50, message: '长度过长', trigger: 'blur'},
                    ],
                    // songLength: [
                    //     {required: true, message: '请输入', trigger: 'blur'},
                    //     {pattern: /[0-5][0-9]+:[0-5][0-9]/, message: '请按照00:00格式填写', trigger: 'blur'},
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
                this.song.albumDto.albumName = obj.albumName;
                this.song.albumDto.albumId = val
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
                this.searchSongName = '';
                this.currentPage = 1;
                this.refreshData();
            },
            refreshData() {
                let url = '/api/song/listSomeSong';
                let params = {
                    params: {
                        offset: this.offset,
                        limit: this.limit,
                        songName: this.searchSongName,
                        singerName: this.searchSingerName
                    }
                };
                this.axios.get(url, params).then(data => {
                    this.tableData = data.data.list;
                    this.countSong = data.data.total;
                    // console.log(data)
                })
                this.axios.get('/api/singer', params).then(data => {
                    this.singers = data.data.list;
                    this.count = data.data.total;
                })

                this.axios.get('/api/album/listSomeAlbum', params).then(data => {
                    this.albums = data.data.list;
                    this.count = data.data.total;
                    // console.log(data)
                })
            },
            editSong(songId) {
                this.updateFormVisible = true;
                this.axios.get('/api/song/showSingleSong', {
                    params: {
                        songId: songId
                    }
                }).then(data => {
                    this.song = data.data;
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
            async updateSong(formName) {
                let _this = this;
                _this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let fd = new FormData();

                        fd.append("songId", this.song.songId)
                        fd.append("songName", this.song.songName);
                        //fd.append("songLength", this.song.songLength);
                        fd.append("singerId", this.song.singer.singerId);
                        fd.append("albumId", this.song.albumDto.albumId);
                        fd.append("songDescription", this.song.songDescription);
                        fd.append("songLyrics", this.song.songLyrics);
                        let url = '/api/song/update'
                        if (this.fileList === null || this.fileList.length === 0) {
                           url = '/api/song/updateNoImg'
                        }else{
                            fd.append("file", this.fileList[0].raw);
                        }
                        this.axios.post(url, fd).then(data => {
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
            delSong(songId) {
                this.axios.get('/api/song/updateStatus', {
                    params: {
                        songId: songId
                    }
                }).then(data => {
                    this.refreshData();
                    if (data.data == 1) {
                        alert("删除成功！");
                    } else {
                        alert("删除失败！");
                    }
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
