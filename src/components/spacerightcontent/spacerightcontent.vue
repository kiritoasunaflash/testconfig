<template>
    <header>
        <ul class="nav">
            <li class="message">短链信息</li>
            <li class="href">短链接网址</li>
            <li class="num">访问次数</li>
            <li class="person">访问人数</li>
            <li class="IP">IP数</li>
            <li class="linux">操作</li>
        </ul>
    </header>
    <div class="allbox">
        <a-checkbox-group v-model:value="state.checkedList" class="group" @change="changeone($event)">
            <a-checkbox :value="item.id" v-for="(item, index) in  parentshortlist " :key="index" class="checkbox">
                <ul class="content">
                    <li class="img">
                        <img :src="item.favicon" alt="">
                        <div class="dataname">
                            <div class="name">{{ item.describe }}</div>
                            <div class="data">{{ item.createTime }}</div>
                        </div>
                    </li>
                    <li class="shortlink">
                        <div class="linkbox">
                            <a :href="'http://' + item.fullShortUrl" class="reallshort" target="_blank"
                                @click="getstart($event)">{{
            item.fullShortUrl
        }}</a>
                            <div class="href">{{ item.originUrl }}</div>
                            <!-- <div>{{ item }}</div> -->
                        </div>
                        <!-- <img src="E:\短链接\短链接\public\favicon.ico" alt="" class="code"> -->

                        <a-popover trigger="click">
                            <template #content>
                                <a-qrcode :value="item.originUrl" class="code" :size="160" />
                            </template>
                            <a-qrcode :value="item.originUrl" class="code" :size="45" :bordered="false"
                                color="#848891" />
                        </a-popover>
                        <!-- <img src="E:\短链接\短链接\public\favicon.ico" alt="" class="cv" @click="copy($event, item.originUrl)"> -->

                        <div class="cv" @click="copy($event, item.fullShortUrl)">
                            <CopyOutlined style="color:#848891" />
                        </div>
                    </li>
                    <li class="visits">
                        <div>
                            <span class="today">今日</span>
                            <span>{{ item.todayPv }}</span>
                        </div>
                        <div>
                            <span class="allday">累计</span>
                            <span>{{ item.totalPv }}</span>
                        </div>

                    </li>
                    <li class="numbervisits">
                        <div>{{ item.todayUv }}</div>
                        <div>{{ item.totalUv }}</div>
                    </li>
                    <li class="ipnumber">
                        <div>{{ item.todayUip }}</div>
                        <div>{{ item.totalUip }}</div>
                    </li>
                    <li class="operate">
                        <div class="echarts" @click="showEcharts($event, item)">
                            <DragOutlined />
                            <div>数据</div>
                        </div>
                        <div class="repeat" @click="putnewlink($event, item)" v-if="route.query.id !== 'recycle'">
                            <EditOutlined />
                            <div>修改</div>
                        </div>
                        <div class="repeat" @click="repeatlinklist($event, item)" v-else>
                            <RedoOutlined />
                            <div>恢复</div>
                        </div>
                        <a-popconfirm title="确认删除该链接?" ok-text="是" cancel-text="否" @confirm="delconfirm(item)">
                            <div class="delete" @click="deleterecycle($event, item)">
                                <DeleteOutlined />
                                <div>删除</div>
                            </div>
                        </a-popconfirm>
                    </li>
                </ul>
            </a-checkbox>
        </a-checkbox-group>
    </div>
    <!-- 二维码气泡框 -->

    <!-- Echarts -->
    <a-modal v-model:open="openEcharts" width="60%" :footer="null">
        <div class="nav1">
            <div class="content">
                <div class="img">
                    <img :src="echartitem.favicon" alt="">
                </div>
                <div class="name">{{ echartitem.describe }}</div>
            </div>
            <div class="url">
                {{ echartitem.originUrl }}
            </div>
            <ul class="changeEcharts">
                <div style="display: flex;">
                    <li @click="changeEch" :class="{ active: changeEchart === 'Echartleft' }">数据图表</li>
                    <li class="record" @click="changerecord" :class="{ active: changeEchart === 'recordright' }">访问记录
                    </li>
                </div>
                <!-- 开始以及结束时间 -->
                <div style="margin-top: -5px;">
                    <li>
                        <a-space direction="vertical">
                            <a-config-provider :locale="locale">
                                <div class="picker">
                                    <a-range-picker v-model:value="startEndTime"
                                        style="width: 220px;margin-left: 150px;background-color: #3464e0;color:#ffffff;border-radius:2px;"
                                        :disabled-date="disabledDate" :disabled-time="disabledRangeTime"
                                        :locale="locale" @change='changeStartEnd(echartitem)'
                                        @ok='okStartEnd(echartitem)' :allowClear="false" />
                                </div>
                            </a-config-provider>
                        </a-space>
                    </li>
                </div>
            </ul>
        </div>
        <div class="leftchart" style="width:100%" v-show="changeEchart === 'Echartleft'">
            <leftchart :EchartData="EchartData" :startEndTime="startEndTime" />
        </div>
        <div class="leftchart" style="width:100%" v-show="changeEchart === 'recordright'">
            <rightrecord :rightData="rightData" :echartitem="echartitem" :EchartData="EchartData"
                :startEndTime="startEndTime" />
        </div>

    </a-modal>
    <!-- 编辑的短链接 -->
    <div class="popbox">
        <a-modal v-model:open="open" title="编辑短链接" @ok="handleOk" cancelText="取消" okText="确认">
            <div class="tipnav">
                <span class="icon">
                    <InfoCircleOutlined />
                </span>
                该短链正在被修改
            </div>
            <div class="purshortlink">
                <strong class="link">被编辑的短链</strong>
                <div>{{ purshort }}</div>
            </div>
            <a-form :model="formState" name="basic" autocomplete="off" :rules="rules">
                <!-- 跳转链接 -->
                <div class="herf">
                    <strong class="link">跳转链接</strong>
                    <a-form-item label="" name="herf">
                        <a-input v-model:value="formState.herf" placeholder="请输入 http:// 或 https:// 开头的链接或应用跳转链接" />
                    </a-form-item>
                </div>
                <!-- 短链标题 -->
                <div class="tip">
                    <strong class="shorttip">短链标题</strong>
                    <a-form-item label="" name="tip">
                        <a-textarea v-model:value="formState.tip" placeholder="请输入短链标题" />
                    </a-form-item>
                </div>
                <!-- 短链分组 -->
                <div class="group" width="100%">
                    <strong class="shortgroup">短链分组</strong><br>
                    <a-form-item label="" name="group">
                        <a-space>
                            <a-select ref="select" v-model:value="formState.group" style="width: 472px">
                                <a-select-option v-for="( item, index ) in  grouplist " :key="index"
                                    :value="item.gid">{{
            item.name
        }}</a-select-option>
                            </a-select>
                        </a-space>
                    </a-form-item>
                </div>
                <!-- 有效选择 -->
                <div class="validity">
                    <strong class="shortvalidity">有效期</strong><br>
                    <a-form-item label="" name="validity">
                        <a-radio-group v-model:value="formState.radiovalue" name="radioGroup">
                            <a-radio value="永久有效">永久有效</a-radio>
                            <a-radio value="自定义">自定义</a-radio>
                            <a-config-provider :locale="locale">
                                <a-space direction="vertical" :size="12" v-show="formState.radiovalue === '自定义'">
                                    <a-date-picker show-time placeholder="请选择到期时间" @change="onChange" @ok="onOk"
                                        :disabled-date="disabledDate" :disabled-time="disabledDateTime" />
                                </a-space>
                            </a-config-provider>
                        </a-radio-group>
                    </a-form-item>
                </div>
            </a-form>
        </a-modal>
    </div>
</template>

<script setup>
import moment from 'moment';
import { ref, defineProps, reactive, defineEmits, toRefs, watch, h, computed } from 'vue'
import { EditOutlined, InfoCircleOutlined, DeleteOutlined, RedoOutlined, DragOutlined, CopyOutlined } from '@ant-design/icons-vue';
import { reputshortnumApi } from '@/Api/rightlink'
import { removerecycleApi, recoverrecycleApi, delrecycleApi } from '@/Api/recycle'
import { statsApi, onestatsApi } from '@/Api/monitor'
import { message } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router'
import leftchart from './Echarts/leftchart.vue';
import rightrecord from './Echarts/rightrecord.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
const locale = ref(zhCN)
let changeEchart = ref("Echartleft")
const route = useRoute()
const router = useRouter()
// 时间选择
// let startEndTime = ref();
// let nowEnd = ref()
const startEndTime = ref();
// onMounted(() => {

// })
// 获取时间
const changeStartEnd = async (item) => {
    let res = await statsApi({
        fullShortUrl: item.fullShortUrl,
        gid: item.gid,
        startDate: dayjs(startEndTime.value?.[0].$d).format('YYYY-MM-DD'),
        endDate: dayjs(startEndTime.value?.[1].$d).format('YYYY-MM-DD')
    })
    console.log(res.data);
    if (res.data.success) {
        EchartData.value = res.data.data
    } else {
        message.error('加载失败')
    }

    let rightres = await onestatsApi({
        fullShortUrl: item.fullShortUrl,
        gid: item.gid,
        startDate: dayjs(startEndTime.value?.[0].$d).format('YYYY-MM-DD '),
        endDate: dayjs(startEndTime.value?.[1].$d).format('YYYY-MM-DD '),
        current: 1,
        size: 10
    })

    if (rightres.data.success) {
        rightData.value = rightres.data.data
    } else {
        rightData.value = []
    }

}
const okStartEnd = async (item) => {
    console.log(startEndTime.value?.[0].$d);
    console.log(startEndTime.value?.[1].$d);
    let res = await statsApi({
        fullShortUrl: item.fullShortUrl,
        gid: item.gid,
        startDate: dayjs(startEndTime.value?.[0].$d).format('YYYY-MM-DD'),
        endDate: dayjs(startEndTime.value?.[1].$d).format('YYYY-MM-DD')
    })
    console.log(res.data);
    if (res.data.success) {
        EchartData.value = res.data.data
    } else {
        message.error('加载失败')
    }

    let rightres = await onestatsApi({
        fullShortUrl: item.fullShortUrl,
        gid: item.gid,
        startDate: dayjs(startEndTime.value?.[0].$d).format('YYYY-MM-DD'),
        endDate: dayjs(startEndTime.value?.[1].$d).format('YYYY-MM-DD'),
        current: 1,
        size: 10
    })

    if (rightres.data.success) {
        rightData.value = rightres.data.data
    } else {
        rightData.value = []
    }
}
const disabledDate = current => {
    // Can not select days before today and today
    return current && current > dayjs().endOf('day');
};
// 禁止选择时间
const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};
const disabledRangeTime = (_, type) => {
    if (type === 'start') {
        return {
            disabledHours: () => range(0, 60).splice(4, 20),
            disabledMinutes: () => range(30, 60),
            disabledSeconds: () => [55, 56],
        };
    }
    return {
        disabledHours: () => range(0, 60).splice(20, 4),
        disabledMinutes: () => range(0, 31),
        disabledSeconds: () => [55, 56],
    };
};
const disabledDateTime = () => {
    return {
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    };
};


const props = defineProps({
    parentshortlist: { type: Array, default: [] },
    grouplist: { type: Array, default: [] },
    getallchecklist: { type: Array, default: [] },
})
// 复制链接
const copy = async (event, val) => {
    event.preventDefault()
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard 向剪贴板写文本
        message.success('复制成功')
        // console.log(navigator.clipboard.writeText(val));
        return navigator.clipboard.writeText(val)
    } else {
        // 创建text area
        const textArea = document.createElement('textarea')
        textArea.value = val
        // 使text area不在viewport，同时设置不可见
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        message.success('复制成功')
        return new Promise((res, rej) => {
            // 执行复制命令并移除文本框
            document.execCommand('copy') ? res() : rej()
            textArea.remove()
        })
    }
}
// 切换到Echarts
const changeEch = () => {
    changeEchart.value = "Echartleft"
}
const changerecord = () => {
    changeEchart.value = "recordright"
}

const emit = defineEmits(['getchangedelete', 'getchecklist'])
// 监控短链链接
const getstart = async (event) => {
    // event.preventDefault()
}

const open = ref(false)
// 目标短链
let purshort = ref()
let everyshort = ref()
// 时间选择
let createtime = ref()
const onChange = (value, dateString) => {
    createtime.value = dateString
};
// 打开Echarts
const openEcharts = ref(false)
let EchartData = ref()
let echartitem = ref()
let rightData = ref([])
const showEcharts = async (event, item) => {
    event.preventDefault()
    openEcharts.value = true
    echartitem.value = item
    // EchartData.value = item
    // 获取日期
    // let date = new Date(),
    //     year = date.getFullYear(), //获取完整的年份(4位)
    //     month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    //     strDate = date.getDate() // 获取当前日(1-31)
    // if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
    // if (strDate < 10) strDate = `0${strDate}`
    // let today = `${year}-${month}-${strDate} `

    // 获取今天的时间
    // console.log(new Date(item.createTime));
    startEndTime.value = [dayjs(new Date(item.createTime)), dayjs()]
    console.log(startEndTime.value);

    let res = await statsApi({
        fullShortUrl: item.fullShortUrl,
        gid: item.gid,
        startDate: dayjs(startEndTime.value?.[0].$d).format('YYYY-MM-DD'),
        endDate: dayjs(startEndTime.value?.[1].$d).format('YYYY-MM-DD'),
    })
    console.log(res.data);
    if (res.data.success) {
        EchartData.value = res.data.data
    } else {
        message.error('加载失败')
    }

    let rightres = await onestatsApi({
        fullShortUrl: item.fullShortUrl,
        gid: item.gid,
        startDate: dayjs(startEndTime.value?.[0].$d).format('YYYY-MM-DD'),
        endDate: dayjs(startEndTime.value?.[1].$d).format('YYYY-MM-DD'),
        current: 1,
        size: 10
    })

    if (rightres.data.success) {
        rightData.value = rightres.data.data
    } else {
        rightData.value = []
    }
}


// 打开修改盒子
const putnewlink = (event, item) => {
    event.preventDefault();
    open.value = true
    purshort.value = item.fullShortUrl
    everyshort.value = item
}
// 多选框
const state = ref({
    indeterminate: true,
    checkedList: props.getallchecklist
})

const handleOk = async () => {
    if (formState.group && formState.herf && formState.tip && formState.radiovalue) {
        let res = await reputshortnumApi({
            domain: everyshort.value.domain,
            originUrl: everyshort.value.originUrl,
            gid: formState.group,
            createdType: 1,
            validDateType: formState.radiovalue === '自定义' ? 1 : 0,
            validDate: formState.radiovalue === '自定义' ? "" : createtime.value,
            describe: formState.tip,
            fullShortUrl: everyshort.value.fullShortUrl,
            originGid: everyshort.value.gid
        })
        if (res.data.success) {
            if (res.data.success) {
                message.success({
                    content: '更新成功',
                    duration: .5
                })
                setTimeout(() => {
                    router.go(0)
                }, 800);
            } else {
                message.error('更新失败')
            }
        }
        open.value = false
    } else {
        message.warning('请输入完整信息！');
    }

}
// 从回收站中恢复链接
const repeatlinklist = async (event, item) => {

    event.preventDefault();
    let res = await recoverrecycleApi({
        gid: item.gid,
        fullShortUrl: item.fullShortUrl
    })
    try {
        if (res.data.success) {
            message.success({
                content: '已恢复到原位',
                duration: .5
            })
            setTimeout(() => {
                router.go(0)
            }, 800);
        } else {
            message.error(res.data.message)
        }
    } catch (e) {
        message.error(e)
    }
}
// 切换为删除模式
let changedelete = ref()
const changeone = (e) => {
    if (e.length <= 0) {
        if (route.query.id !== 'recycle') {
            changedelete.value = 1
        } else {
            changedelete.value = 2
        }
    } else {
        changedelete.value = 3
        emit('getchecklist', { checked: e, deletedata: false })
    }
    emit('getchangedelete', changedelete.value)
}
// 移动至回收站
const deleterecycle = async (e, item) => {
    e.preventDefault()
}
const delconfirm = async (item) => {
    if (route.query.id !== 'recycle') {
        let res = await removerecycleApi({
            fullShortUrl: item.fullShortUrl,
            gid: item.gid
        })
        try {
            if (res.data.success) {
                message.success({
                    content: '成功移动至回收站',
                    duration: .5
                })
                setTimeout(() => {
                    router.go(0)
                }, 800);
            } else {
                message.error('移动失败')
            }
        } catch (e) {
            message.error(e)
        }
    }
    else {
        let res = await delrecycleApi({
            gid: item.gid,
            fullShortUrl: item.fullShortUrl
        })
        try {
            if (res.data.success) {
                message.success({
                    content: '删除成功',
                    duration: .5
                })
                setTimeout(() => {
                    router.go(0)
                }, 800);
            } else {
                message.error(res.data.message)
            }
        } catch (e) {
            message.error(e)
        }
    }
}
// 整个表单
const formState = reactive({
    radiovalue: '',
    group: '',
    tip: '',
    herf: ''
});
// 必须为http以及https为开头的规则
function httpOrhttps(value) {
    let reg = /(http|https):\/\/([\w.]+\/?)\S*/
    return reg.test(value);
}
const validateHttpmust = async (_rule, value) => {
    if (httpOrhttps(value)) {
        return Promise.resolve()
    } else {
        return Promise.reject('请输入 http:// 或 https:// 开头的链接或应用跳转链接')
    }
}
const validateTip = async (_rule, value) => {
    if (value.length > 0 && value.length <= 50) {
        return Promise.resolve()
    } else {
        return Promise.reject('短链标题长度为0-50之间')
    }
}
const validateGroup = async (_rule, value) => {
    if (value) {
        return Promise.resolve()
    } else {
        return Promise.reject('请选择短链分组')
    }
}
const validateRadio = async (_rule, value) => {
    if (value) {
        return Promise.resolve()
    } else {
        return Promise.reject('请自定义选择保存时长')
    }
}
// 创建短链接的规则
const rules = {
    herf: [
        {
            required: true,
            validator: validateHttpmust,
            trigger: 'change',
        },
    ],
    tip: [{
        required: true,
        validator: validateTip,
        trigger: 'change',
    }],
    group: [{
        required: true,
        validator: validateGroup,
        trigger: 'change',
    }],
    radiovalue: [{
        required: true,
        validator: validateRadio,
        trigger: 'change',
    }]
};
watch(
    () => props.getallchecklist,
    (newvalue, oldvalue) => {
        state.value.checkedList = props.getallchecklist
        if (newvalue.length <= 0) {
            emit('getchangedelete', changedelete.value = 1)
        }
    }
)

</script>

<style lang="less" scoped>
// /deep/ .ant-checkbox-wrapper {
//     display: flex;
// }
/deep/ .ant-checkbox {
    display: block;
    width: 0;
    margin-left: 1.3%;
}

/deep/ .ant-checkbox-inner {
    margin-left: 1.5%;
}

// /deep/ .ant-picker-range {
//     background: #3464e0;
//     color: #ffffff;
// }
/deep/ .ant-picker-input>input {
    color: #ffffff;

    &::placeholder {
        color: #FFFFFF;
    }
}

/deep/ .anticon-swap-right {
    color: #ffffff;
    margin-left: -10px
}

/deep/.ant-picker-suffix {
    color: #ffffff
}

.allbox {
    width: 100%;

    .group {
        display: flex;


        .checkbox {
            width: 100%;
            display: block;
        }
    }
}

header {
    margin-top: 20px;

    .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-left: 50px;
        padding-right: 140px;
        font-size: 13px;
        height: 40px;
        background-color: #f7f8fa;
        border-top: 1px solid #e9ebf0;
        border-bottom: 1px solid #e9ebf0;

        .href {
            padding-right: 300px;
            padding-left: 130px;
        }

        .IP {
            padding-right: 50px;
        }
    }
}

.nav1 {
    height: 150px;
    background: #3464e0;
    width: 100%;
    margin: -20px -24px;
    padding-right: 8px;
    padding-top: 100px;
    padding-left: 40px;
    position: relative;

    .content {
        display: flex;
        align-items: center;
        border: none;

        .img {
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 35px;
            background-color: #ffffff;

            img {
                width: 25px;
                height: 25px;
            }
        }

        .name {
            margin-left: 10px;
            font-size: 28px;
            color: #ffffff;
            font-weight: 700;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;
            white-space: nowrap;
            width: 70%;
        }
    }

    .url {
        margin-left: 75px;
        color: #ffffff;
        width: 70%;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        white-space: nowrap;
    }

    .changeEcharts {
        position: absolute;
        bottom: 0;
        display: flex;
        height: 30px;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        width: 62%;


        .record {
            margin-left: 20px;

        }

        li {
            width: 90px;
            text-align: center;

        }
    }
}

.content {
    display: flex;
    height: 60px;
    flex-wrap: wrap;
    border-bottom: 1px solid #e9ebf0;
    width: 100%;
    margin-top: -4.5%;
    padding-left: 3.5%;

    .img {
        width: 19.5%;
        display: flex;
        align-items: center;


        img {
            width: 20px;
            height: 20px;
        }

        .dataname {
            width: 100%;
            padding-left: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 13px;

            .name {
                width: 80%;
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
                white-space: nowrap;
            }

            .data {
                color: #2e364d;
                margin-top: 5px;
            }
        }
    }

    .shortlink {
        width: 30%;
        display: flex;
        align-items: center;

        .linkbox {
            font-size: 13px;
            width: 45%;

            .reallshort {
                color: #2752cf;
            }

            .href {
                text-overflow: ellipsis;
                overflow: hidden;
                word-break: break-all;
                white-space: nowrap;
            }
        }

        img {
            width: 20px;
            height: 20px;

        }

        .code {
            margin-left: 50px;
            display: block;
        }

        // .cv {
        //     margin-left: 20px;
        // }
    }

    .visits {
        width: 13.5%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;

        .today,
        .allday {
            color: #acafb6;
            font-size: 13px;
        }

        span {
            margin-left: 10px;

        }
    }

    .numbervisits {
        width: 9.5%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
    }

    .ipnumber {
        width: 11%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 12px;
    }

    .operate {
        margin-left: 10px;
        display: flex;
        justify-content: center;
        font-size: 14px;
        align-items: center;
        height: 100%;
        color: #2651cf;

        .echarts {
            height: 100%;
            justify-content: center;
            display: flex;
            flex-direction: column;
            margin-right: 20px;
            margin-left: -2.5%;

            div {
                font-size: 10px;
            }
        }

        .repeat {
            height: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            z-index: 999;



            div {
                font-size: 10px;
            }
        }

        .delete {
            height: 100%;
            display: flex;
            flex-direction: column;
            z-index: 999;
            margin-left: 20px;
            justify-content: center;

            div {
                font-size: 10px;
            }
        }
    }
}

.operate:hover {
    cursor: pointer;
}

.popbox {
    width: 100%;


}

.tipnav {
    width: 100%;
    background-color: #fff6ec;
    height: 30px;
    display: flex;
    align-items: center;
    text-indent: 1em;
    font-size: 12px;
    border-radius: 4px;
    margin-top: 10px;


    .icon {
        color: #fea643;
    }
}

.purshortlink {
    margin-top: 20px;
    margin-bottom: -10px;
}

.herf {
    margin-top: 30px;

    .link {
        display: block;
        margin-bottom: 10px;
    }
}

.tip {
    margin-top: 30px;

    .shorttip {
        margin-bottom: 10px;
        display: block;
    }
}

.group {
    margin-top: 30px;

    .shortgroup {
        margin-bottom: 10px;
        display: inline-block;
    }
}

.validity {
    margin-top: 30px;

    .shortvalidity {
        margin-bottom: 10px;
        display: inline-block;
    }
}

.active {
    // border-bottom: 5px solid #ffffff;
    animation: getline .3s ease-out;
    animation-fill-mode: forwards;
}

@keyframes getline {
    0% {
        border-bottom: 0px;
    }

    100% {
        border-bottom: 5px solid #ffffff;
    }
}
</style>