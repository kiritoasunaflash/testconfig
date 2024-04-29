<template>
    <!-- 头部 -->
    <header>
        <ul>
            <li class="logo">
                <img src="" alt="">
                <span>mortal短链接</span>
            </li>
            <li class="my">我的空间</li>
            <li class="my">协作空间</li>
            <li class="my">插件应用</li>
            <li class="my">自定义域名</li>
            <li class="my">开放API</li>
            <li class="my">跳转小程序</li>
            <li class="search">
                <a-input-search placeholder="请输入关键字查找" style="width: 250px;" autosize="true" :bordered=true
                    size="middle" />
            </li>
            <li class="message">意见反馈</li>
            <li class="more">更多产品</li>
            <li class="login" @click="gologin" v-if="!token">登录</li>
            <li v-else class="login"> <a-popconfirm title="是否退出?" ok-text="是" cancel-text="否" @confirm="confirm"
                    @cancel="cancel">
            <li>账号：{{ username }} ∨</li>
            </a-popconfirm></li>

        </ul>
    </header>
    <!-- 内容 -->
    <router-view></router-view>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { emitter } from "@/utils/mitt.js";
import { message } from 'ant-design-vue';
const router = useRouter()
const username = ref()
const gologin = () => {
    router.replace('/login')
}
const token = ref()
onMounted(async () => {
    emitter.on('getusername', (res) => {
        localStorage.setItem('username', res)
    })
    username.value = localStorage.getItem('username')
    token.value = localStorage.getItem('token')
})
// 确定退出账号
const confirm = () => {
    localStorage.setItem('oldtoken', localStorage.getItem('token'))
    localStorage.removeItem('username')
    localStorage.removeItem('token')
    router.replace('/login')
    message.success('退出成功')
}
// 取消退出账号
const cancel = () => {
    message.warning('取消退出账号')
}
</script>

<style lang="less" scoped>
header {
    width: 100%;
    background-color: #2651cf;
}

ul {
    display: flex;
    height: 40px;
    width: 100%;
    align-items: center;
    color: #f2f4fc;
    line-height: 60px;
    flex-wrap: nowrap;

    .my:hover {
        cursor: pointer;
        background-color: #102a75;
    }

    li {
        height: 100%;
        line-height: 40px;
        white-space: nowrap;
        cursor: pointer;
    }

    .logo {
        width: 9%;
        padding-left: 40px;
        font-size: 18px;

        height: 100%;
        line-height: 40px;
    }

    .my {
        padding-right: 10px;
        padding-left: 10px;
        font-size: 13px;
    }

    .search {
        margin-left: 350px;
        margin-top: 8px;
    }

    .message {
        padding-left: 30px;
        font-size: 13px;
    }

    .more {
        padding-left: 30px;
        font-size: 13px;
    }

    .login {
        padding-left: 30px;
        font-size: 13px;
    }

}
</style>