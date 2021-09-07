<template>
    <div>

        <head-top></head-top>

        <div class="table_container">

            <el-table :data="banners" style="width: 100%">

                <el-table-column prop="bannerNo" label="图片编号" width="200px"></el-table-column>
                <el-table-column prop="bannerPath" label="推广图片" style="width: 50%; height: auto">
                    <template slot-scope="scorp">
                        <el-popover placement="right" trigger="hover">
                            <img :src="scorp.row.bannerPath" style="max-height: 300px">
                            <img slot="reference" :src="scorp.row.bannerPath" style="width:400px;height: 150px">
                        </el-popover>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <!--<el-upload-->
                    <!--class="upload-demo"-->
                    <!--ref="upload"-->
                    <!--action="#"-->
                    <!--:file-list="fileList"-->
                    <!--:on-change="handleChange"-->
                    <!--:auto-upload="false">-->
                    <!--<el-button slot="trigger"  type="primary">选取文件</el-button>-->
                    <!--<el-button type="success" @click="updateBanner">上传到服务器</el-button>-->
                    <!--</el-upload>-->
                    <el-upload
                        class="upload-demo"
                        action="#"
                        accept="image/jpeg,image/jpg,image/png"
                        ref="upload"
                        :auto-upload="false"
                        :on-change="handleChange"
                        :file-list="fileList">
                        <el-button slot="trigger" type="primary">选取文件</el-button>
                    </el-upload>
                </el-table-column>
                <el-table-column>
                    <template slot-scope="scope">
                        <el-button type="success" @click="updateBanner(scope.row.bannerId)">上传到服务器</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

    import headTop from '../components/headTop';

    export default {
        name: "addBanner",
        data() {
            return {
                fileList: [],
                banners: [],
                banner: {
                    bannerId: 0,
                    bannerNo: 0,
                    bannerPath: '',
                },
                offset: 0,
                limit: 20,
                count: 0,
                currentPage: 1,
            };
        },
        components: {
            headTop
        },
        created() {
            this.refreshData();
        },
        methods: {
            handleRemove(file, fileList) {
                // console.log(file, fileList);
            },
            handlePreview(file) {
                // console.log(file);
            },
            handleChange(file, fileList) {
                let bo = this.beforeAvatarUpload(file);
                if (!bo) {
                    this.fileList = [];     //图片列表赋值为空
                    return;
                }
                this.fileList = fileList.slice(-1);
                // console.log('file', file)
                // console.log('filelist', fileList)
            },
            beforeAvatarUpload(file) {
                const isJPG = file.raw.type == 'image/jpeg';
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return isJPG && isLt5M;
            },
            async updateBanner(BannerId) {
                let url = '/api/banner/update';
                let fd = new FormData();
                if (this.fileList.length != 0) {
                    fd.append("file", this.fileList[0].raw);
                } else {
                    alert("未选择文件")
                }
                fd.append("bannerId", BannerId);
                // console.log(fd)
                this.axios.post(url, fd).then(data => {
                    if (data.data === 1) {
                        alert("修改成功！");
                        this.fileList = []
                        this.refreshData();
                    } else {
                        alert("修改失败！");
                    }
                })
            },
            refreshData() {
                let params = {
                    params: {
                        offset: this.offset,
                        limit: this.limit,
                    }
                };
                this.axios.get('/api/banner/listBanner', params).then(data => {
                    this.banners = data.data;
                    this.count = data.total;
                    // console.log(data)
                })
            },
        }
    }
</script>

<style lang="less"></style>
