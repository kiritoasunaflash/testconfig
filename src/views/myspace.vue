<template>
    <div class="box">
        <div class="left">
            <spaceleft :grouplist="grouplist" @getspaceright="getspaceright" @getleftshortlist="getleftshortlist"
                :lefttotalnnum="lefttotalnnum" />
        </div>
        <div class="right">
            <spaceright :grouplist="grouplist" :parentshortlist="parentshortlist" @getrightshortlist="getrightshortlist"
                :parenttotal="parenttotal" />
        </div>
    </div>
</template>

<script setup>
import spaceleft from '@/components/myspace/spaceleft.vue'
import spaceright from '@/components/myspace/spaceright.vue'
import { getgroupApi } from '@/Api/shortlink'
import { onMounted, provide, computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getpageshortApi, getshortnumApi } from '@/Api/rightlink'
const grouplist = ref([])
let newspaceright = ref()
let parentshortlist = ref()
let getleftshortlists = ref()
let getrightshortlists = ref()
let lefttotalnnum = ref()
let parenttotal = ref()
let route = useRoute()
onMounted(async () => {
    if (localStorage.getItem('token') !== localStorage.getItem('oldtoken')) {
        localStorage.setItem('oldtoken', localStorage.getItem('token'))
        location.reload()
        message.success('登陆成功')
    }
    // console.log(localStorage.getItem('token'));
    parentshortlist.value = []
    let res = await getgroupApi()
    try {
        if (res.data.success) {
            grouplist.value = res.data.data
            // provide('grouplist', grouplist)
        } else {
            message.error(res.data.message)
        }
    } catch (err) {
        message.error(err)
    }
    if (localStorage.getItem('token') === '') {
        grouplist.value = []
    }
    // 获取分页的一个值
    let pageres = await getpageshortApi({
        gid: grouplist.value[0].gid,
        current: 1,
        size: 10,
        orderTag: ''
    })
    try {
        if (!pageres.data.success) message.error(pageres.data.message)
        else {
            parentshortlist.value = pageres.data.data.records
            parenttotal.value = pageres.data.data.total
        }
    } catch (err) {

        message.error(err)
    }
    let resnum = await getshortnumApi(grouplist.value.map(item => { return item.gid }))
    lefttotalnnum.value = resnum.data.data
}
)

const getleftshortlist = (value) => {
    getleftshortlists.value = value
}
const getspaceright = (value) => {
    newspaceright = value
}
const getrightshortlist = (value) => {
    getrightshortlists.value = value
}
watch(getleftshortlists, (newvalue, oldvalue) => {
    parentshortlist.value = []
})
watch(getrightshortlists, (newvalue, oldvalue) => {
    parentshortlist.value = []
})
watch(
    () => route.query.id,
    (newvalue) => {
        if (newvalue === 'recycle') {
            parentshortlist.value = []
        }
    }
)
</script>

<style lang="less" scoped>
.box {
    display: flex;
    width: 100%;
    height: 100%;
}

.left {
    flex: 9%;
    height: calc(100% + 40px);
    background-color: #ffffff;
    padding-right: 40px;
}

.right {
    flex: 91%;
    margin: 20px;
    margin-bottom: -20px;
    background-color: #ffffff;
    border-radius: 3px;
    width: 80%;
    overflow-y: scroll;
    overflow-x: hidden;
}

::-webkit-scrollbar-track {
    border-radius: 4px;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
    /* background-color: rosybrown; */
}

::-webkit-scrollbar {
    width: 6px;
    /*对垂直流动条有效*/
    height: 6px;
    /*对水平流动条有效*/
}

::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: #DDDEE0;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3); */
}
</style>