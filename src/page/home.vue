<template>
    <div>
        <head-top></head-top>
        <div class="container">
            <img src="../assets/img/musiclogo.png" alt="logo" width="170" height="46">
            <br/>
            <p>单曲数量:{{countList.songCount}}</p>
            <p>歌单数量:{{countList.songListCount}}</p>
            <p>专辑数量:{{countList.albumCount}}</p>
            <p>注册用户数量:{{countList.userCount}}</p>
            <p>累计动态数量:{{countList.shareCount}}</p>
            <p>累计评论数量:{{countList.commentCount}}</p>
            <p>累计回复数量:{{countList.replyCount}}</p>
        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import tendency from '../components/tendency'

    export default {
        data() {
            return {
                countList: {
                    songCount: 0,
                    songListCount: 0,
                    albumCount: 0,
                    userCount: 0,
                    shareCount: 0,
                    commentCount: 0,
                    replyCount: 0,
                },
                sevenDay: [],
                sevenDate: [[], [], []],
            }
        },
        components: {
            headTop,
            tendency,
        },
        mounted() {
            let url = '/api/admin/home';
            this.axios.get(url).then(data => {
                if (data.data.errorCode === 0) {
                    this.countList = data.data.result;
                }
            })
        },
        computed: {},
        methods: {}
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .container {
        padding: 20px;
    }
</style>
