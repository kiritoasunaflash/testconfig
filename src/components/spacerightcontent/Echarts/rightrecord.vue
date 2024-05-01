<template>
    <div class="allbox">
        <div v-if="EchartData === null" style="height: 550px;">
            <a-empty
                style="display: flex; align-items: center; height: 100%;justify-content: center;flex-direction: column;"
                description="暂无访问记录" />
        </div>
        <div v-else>
            <ul class="record">
                <li style="margin-left: 10px;">访问时间</li>
                <li>访问Ip</li>
                <li>访客地区</li>
                <li class="equipment">信息设备</li>
                <li>访客类型</li>
            </ul>
            <!-- (item, index) in resourcelist === null ? rightData?.records : resourcelist.records -->
            <ul class="content"
                v-for=" (item, index) in resourcelist?.records?.length >= 1 ? resourcelist.records : rightData?.records?.length >= 1 ? rightData?.records : []  "
                :key="index">
                <li style="margin-left: 10px;">{{ item.createTime }}</li>
                <li>{{ item.ip }}</li>
                <li>{{ item.locale }}</li>
                <li class="equipment">
                    <span style="margin-left: 0;">{{ item.os }}</span>
                    <span>{{ item.browser }}</span>
                    <span>{{ item.network === 'Mobile' ? '移动数据' : 'WIFI' }}</span>
                    <span>{{ item.device === 'PC' ? '电脑' : '手机' }}</span>
                </li>
                <li>{{ item.uvType }}</li>
            </ul>
            <footer>
                <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total" @change="changeright"
                    class="page" />
            </footer>
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue'
import { onestatsApi } from '@/Api/monitor'
const props = defineProps(['rightData', 'echartitem', 'EchartData'])
const current = ref(1)
const pageSize = ref(10)
const total = ref(props.rightData?.total)
const resourcelist = ref([])
const changeright = async () => {
    let date = Date.now(),
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate() // 获取当前日(1-31)
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = `0${strDate}`
    let today = `${year}-${month}-${strDate} ${hour}:${minute}:${second}`
    let res = await onestatsApi({
        fullShortUrl: props.echartitem.fullShortUrl,
        gid: props.echartitem.gid,
        startDate: props.echartitem.createTime,
        endDate: props.echartitem.validDate || today,
        current: current.value,
        size: pageSize.value
    })
    if (res.data.success) {
        resourcelist.value = res.data.data
    } else {
        resourcelist.value = []
    }
}

</script>

<style lang="less" scoped>
.allbox {
    height: 550px;
    overflow-y: scroll;
    overflow-x: hidden;
}

.record {
    width: 100%;
    margin-top: 40px;
    display: flex;
    height: 40px;
    align-items: center;
    background-color: #f7f8fa;
    font-size: 12px;
    font-weight: 700;
    border-bottom: 1px solid #e9ebf0;

    li {
        flex: 0 1 15%
    }

    .equipment {
        flex: 0 1 40%
    }

}

.content {
    display: flex;
    width: 100%;
    height: 40px;
    align-items: center;
    font-size: 12px;
    border-bottom: 1px solid #e9ebf0;

    li {
        flex: 0 1 15%
    }

    .equipment {
        flex: 0 1 40%;

        span {
            display: inline-block;
            margin-left: 10px;
        }
    }
}

footer {
    position: absolute;
    height: 80px;
    bottom: 0;
    line-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    margin-left: -25px;
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

::-webkit-scrollbar {
    display: none;
}
</style>