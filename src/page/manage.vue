<template>
    <div class="manage_page fillcontain">
        <el-row style="height: 100%;">
            <el-col :span="4" style="min-height: 100%; background-color: rgb(238,241,246);">
                <el-menu :default-active="defaultActive" style="min-height: 100%;" router>
                    <el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-document"></i>数据管理</template>
                        <el-menu-item index="songListCategory">歌单标签管理</el-menu-item>
                        <el-menu-item index="bannerList">推广图片管理</el-menu-item>
                        <el-menu-item index="singerList">歌手管理</el-menu-item>
                        <el-menu-item index="albumList">专辑管理</el-menu-item>
                        <el-menu-item index="songList">歌曲管理</el-menu-item>
                        <el-menu-item index="userList">用户管理</el-menu-item>
                        <el-menu-item index="commentList">评论管理</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-plus"></i>添加数据</template>
                        <!--<el-menu-item index="addShop">添加商铺</el-menu-item>-->
                        <!--<el-menu-item index="addGoods">添加商品</el-menu-item>-->
                        <el-menu-item index="addAlbum">添加专辑</el-menu-item>
                        <el-menu-item index="addSong">添加歌曲</el-menu-item>
                    </el-submenu>
                    <!--<el-submenu index="4">
                        <template slot="title"><i class="el-icon-star-on"></i>图表</template>
                        <el-menu-item index="visitor">用户分布</el-menu-item>
                        &lt;!&ndash; <el-menu-item index="newMember">用户数据</el-menu-item> &ndash;&gt;
                    </el-submenu>
                    <el-submenu index="5">
                        <template slot="title"><i class="el-icon-edit"></i>编辑</template>
                        &lt;!&ndash; <el-menu-item index="uploadImg">上传图片</el-menu-item> &ndash;&gt;
                        <el-menu-item index="vueEdit">文本编辑</el-menu-item>
                    </el-submenu>-->
                    <el-submenu index="3">
                        <template slot="title"><i class="el-icon-setting"></i>管理员设置</template>
                        <el-menu-item index="adminList" v-if="role<2">管理员设置</el-menu-item>
                        <el-menu-item index="adminSet">信息更新</el-menu-item>
                        <!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
                    </el-submenu>
                    <!--<el-submenu index="7">
                        <template slot="title"><i class="el-icon-warning"></i>说明</template>
                        <el-menu-item index="explain">说明</el-menu-item>
                    </el-submenu>-->
                </el-menu>
            </el-col>
            <el-col :span="20" style="height: 100%;overflow: auto;">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        computed: {
            defaultActive: function () {
                return this.$route.path.replace('/', '');
            },
            role() {
                return localStorage.getItem('role')
            }
        },
    }
</script>


<style lang="less" scoped>
    @import '../style/mixin';

    .manage_page {
    }

</style>
