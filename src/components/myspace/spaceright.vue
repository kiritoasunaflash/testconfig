<template>
    <!-- 输入页 -->
    <div class="input" v-if="deletedata || changerecycle === 1 && route.query.id !== 'recycle'">
        <a-input v-model:value="urlvalue" placeholder="请输入 http:// 或 https:// 开头的链接或应用跳转链接"
            style="width: 70%; height: 35px;" />
        <a-button type="primary" style="width: 100px; margin-left: 10px;" @click="createshortlink">创建短链</a-button>
        <a-button style="width: 100px; background-color: #e9ebf0;  margin-left: 10px;"
            @click="createmorelink">批量创建</a-button>
        <a-button style="width: 100px; background-color: #e9ebf0;  margin-left: 10px;">小程序链接</a-button>
    </div>
    <!-- 多选框 -->
    <div class="checkbox" v-else-if="changerecycle === 3">
        <a-checkbox v-model:checked="state.checkAll" :indeterminate="state.indeterminate" @change="onCheckAllChange">
            全选
        </a-checkbox>
        <div class="delnum"> 已选择{{ state.checkedList.length }}条</div>
        <a-button type="primary" danger class="danger" :disabled="state.checkedList.length <= 0" @click="removealllink">
            <DeleteOutlined />
            移动至回收站
        </a-button>
    </div>
    <!-- 删除页 -->
    <div class="recycle" v-else>
        <div class="name">回收站</div>
        <div class="num">共{{ total }}个短链接</div>
    </div>
    <!-- 内容 -->
    <div v-if="rightshortlist?.length < 1 && leftshortlist?.length < 1 && parentshortlist?.length < 1 && recyclelist?.records < 1"
        class="novalue">
        <a-empty description="暂无数据" />
    </div>
    <div v-else>
        <spacerightcontent
            :parentshortlist="leftshortlist?.length >= 1 ? leftshortlist : rightshortlist?.length >= 1 ? rightshortlist : parentshortlist?.length >= 1 ? parentshortlist : recyclelist?.records"
            :grouplist="grouplist" @getchangedelete="getchangedelete" @getchecklist="getchecklist"
            :getallchecklist="state.checkedList" />
    </div>
    <footer>
        <a-pagination v-model:current="current" v-model:pageSize="pageSize" :total="total || parenttotal"
            @change="showshort" />
    </footer>
    <!-- 创建单条短链接 -->
    <div class="popbox">
        <a-modal v-model:open="open" title="创建短链接" @ok="handleOk" cancelText="取消" okText="确认">
            <a-form :model="formState" name="basic" autocomplete="off" :rules="rules">
                <!-- 跳转链接 -->
                <div class="herf">
                    <strong class="link">跳转链接</strong>
                    <a-form-item label="" name="herf">
                        <a-input v-model:value="formState.herf" placeholder="请输入 http:// 或 https:// 开头的链接或应用跳转链接"
                            @input="inputHttp" />
                    </a-form-item>
                </div>
                <!-- 短链标题 -->
                <div class="tip">
                    <strong class="shorttip">短链标题</strong>
                    <a-form-item label="" name="tip">
                        <a-textarea v-model:value="formState.tip" placeholder="请输入短链标题" style="height: 100px;" />
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
    <!-- 创建多条短链接 -->
    <div class="popbox">
        <a-modal v-model:open="moreopen" title="创建短链接" @ok="handlemoreOk" cancelText="取消" okText="确认">
            <a-form :model="formmoreState" name="basic" autocomplete="off" :rules="ruling">
                <!-- 跳转链接 -->
                <div class="herf">
                    <strong class="link">跳转链接</strong>
                    <a-form-item label="" name="herf">
                        <a-textarea v-model:value="formmoreState.herf" style="height: 100px;"
                            placeholder="请输入http://或https://开头的链接或应用跳转链接，一行一个，每次最多输入100行" />
                    </a-form-item>
                </div>
                <!-- 短链标题 -->
                <div class="tip">
                    <strong class="shorttip">短链标题</strong>
                    <a-form-item label="" name="tip">
                        <a-textarea v-model:value="formmoreState.tip" style="height: 100px;"
                            placeholder="根据链接顺序输入锻炼名称，每行提供，不超过64个汉字或英母" />
                    </a-form-item>
                </div>
                <!-- 短链分组 -->
                <div class="group" width="100%">
                    <strong class="shortgroup">短链分组</strong><br>
                    <a-form-item label="" name="group">
                        <a-space>
                            <a-select ref="select" v-model:value="formmoreState.group" style="width: 472px">
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
                        <a-radio-group v-model:value="formmoreState.radiovalue" name="radioGroup">
                            <a-radio value="永久有效">永久有效</a-radio>
                            <a-radio value="自定义">自定义</a-radio>
                            <a-config-provider :locale="locale">
                                <a-space direction="vertical" :size="12" v-show="formmoreState.radiovalue === '自定义'">
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
    <!-- <div v-else>111</div> -->
</template>

<script setup>
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';
import { getrecycleApi } from '@/Api/recycle'
import { ref, reactive, defineProps, watch, defineEmits, h } from 'vue'
import { emitter } from "@/utils/mitt.js";
import { useRouter, useRoute } from 'vue-router';
import { putnewshortlinkApi, createmorenewshortlinkApi } from '@/Api/shortlink'
import { geturltipApi, getpageshortApi } from '@/Api/rightlink'
import { removeallrecycleApi } from '@/Api/recycle'
import { statsApi } from '@/Api/monitor'
import { DeleteOutlined, CloseCircleOutlined } from '@ant-design/icons-vue';
import spacerightcontent from '@/components/spacerightcontent/spacerightcontent.vue'
import { notification } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
const locale = ref(zhCN)
const urlvalue = ref()
const queryvalue = ref()
const router = useRouter()
const route = useRoute()
const props = defineProps({
    grouplist: { type: Array, default: [] },
    parentshortlist: { type: Array, default: [] },
    parenttotal: { type: Number, default: 1 },
})
const emit = defineEmits(['getrightshortlist'])
const state = ref({
    // indeterminate: true,
    checkAll: false,
    checkedList: []
})
const current = ref(1);
const pageSize = ref(10)
let createtime = ref()
let total = ref()
let deletedata = ref(true)

// 整个表单
const formState = reactive({
    radiovalue: '',
    group: '',
    tip: '',
    herf: ''
});
// 创建多个短链接
const formmoreState = reactive({
    radiovalue: '',
    group: '',
    tip: [],
    herf: []
})
// 获取值
emitter.on("getshortname", (response) => {
    queryvalue.value = response
})
// 获取gid
let getleftgid = ref()
emitter.on("getgid", (response) => {
    getleftgid.value = response
})
// 切换到回收站
let changerecycle = ref()
emitter.on("getchangerecycle", (response) => {
    changerecycle.value = response
    deletedata.value = false
})
const getchecklist = (data) => {
    state.value.checkedList = data.checked
    deletedata.value = data.deletedata

}
// 批量移动至回收站
const removealllink = async () => {
    let removelist = state.value.checkedList.map(item => (leftshortlist.value?.length >= 1 ? leftshortlist.value : rightshortlist.value?.length >= 1 ? rightshortlist.value : props.parentshortlis?.length >= 1 ? props.parentshortlist : recyclelist.value?.records).filter(items => items.id === item))

    let res = await removeallrecycleApi({
        gid: removelist.flat()[0].gid,
        fullShortUrlList: removelist.flat().map(item => item.fullShortUrl)
    })

    try {
        if (res.data.success) {
            message.success({
                content: '批量删除成功',
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
// 切换为删除
const getchangedelete = (data) => {
    changerecycle.value = data
}
const onCheckAllChange = e => {
    Object.assign(state.value, {
        checkedList: e.target.checked ? (leftshortlist.value?.length >= 1 ? leftshortlist.value : rightshortlist.value?.length >= 1 ? rightshortlist.value : props.parentshortlist?.length >= 1 ? props.parentshortlist : recyclelist.value?.records).map(item => item.id) : [],
        indeterminate: false,
    });
};
watch(
    () => state.value.checkedList,
    val => {
        state.indeterminate = !!val.length && val.length < (leftshortlist.value?.length >= 1 ? leftshortlist.value : rightshortlist.value?.length >= 1 ? rightshortlist.value : props.parentshortlist?.length >= 1 ? props.parentshortlist : recyclelist.value?.records).map(item => item.id).length;
        state.value.checkAll = val.length === (leftshortlist.value?.length >= 1 ? leftshortlist.value : rightshortlist.value?.length >= 1 ? rightshortlist.value : props.parentshortlist?.length >= 1 ? props.parentshortlist : recyclelist.value?.records).map(item => item.id).length;
    }

);
// 创建短链接
const open = ref(false);
const createshortlink = async () => {
    // 在input输入框中有http请求时
    if (urlvalue.value && httpOrhttps(urlvalue.value)) {
        let res = await geturltipApi({ url: urlvalue.value })
        if (res.data.success) {
            formState.tip = res.data.data
            formState.herf = urlvalue.value
        }


    }
    open.value = true;
}
const inputHttp = async () => {
    if (httpOrhttps(formState.herf)) {
        let res = await geturltipApi({ url: formState.herf })
        if (res.data.success) {
            formState.tip = res.data.data || '无法识别,请手动输入'
        } else {
            formState.tip = '无法识别,请手动输入'
        }

    }
}
const handleOk = async (e) => {
    if (formState.group && formState.herf && formState.tip && formState.radiovalue) {
        let res = await putnewshortlinkApi({
            domain: '',
            originUrl: formState.herf,
            gid: formState.group,
            createType: 1,
            validDateType: formState.radiovalue === '自定义' ? 1 : 0,
            validDate: formState.radiovalue === '自定义' ? "" : createtime.value,
            describe: formState.tip
        })

        if (res.data.success) {
            message.success({
                content: '批量创建成功',
                duration: .5
            })
            setTimeout(() => {
                router.go(0)
            }, 800);
        }
        open.value = false;
    } else {
        message.warning('请输入完整信息！');
    }



};
// 创建多条短链接
const moreopen = ref(false)
const createmorelink = () => {
    moreopen.value = true;
}
const handlemoreOk = async () => {
    if (formmoreState.group && formmoreState.herf && formmoreState.tip && formmoreState.radiovalue) {
        if (formmoreState.tip.split(/\s+/)?.length === formmoreState.herf.split(/\s+/)?.length) {
            let res = await createmorenewshortlinkApi({
                domain: '',
                originUrls: formmoreState.herf.split(/\s+/),
                gid: formmoreState.group,
                createType: 1,
                validDateType: formmoreState.radiovalue === '自定义' ? 1 : 0,
                validDate: formmoreState.radiovalue === '自定义' ? "" : createtime.value,
                describes: formmoreState.tip.split(/\s+/)
            })
            moreopen.value = false
            message.success({
                content: '批量创建成功',
                duration: .5
            })
            setTimeout(() => {
                router.go(0)
            }, 800);

        } else {
            notification.open({
                message: '短链个数与短链标题数量不符',
                description:
                    '请检查短链链接个数与短链标题数量是否一致，若不一致请重新输入！',
                icon: () =>
                    h(CloseCircleOutlined, {
                        style: 'color: #fe3c41',
                    }),
            });
        }
    } else {
        notification.open({
            message: '请输入完整信息',
            description:
                '请检查是否有短链链接或标题或分组或时间限制是否填写完整！',
            icon: () =>
                h(CloseCircleOutlined, {
                    style: 'color: #fe3c41',
                }),
        });
    }
}

// 选择短链分组
// 页码改变时获取短链接
let rightshortlist = ref([])
const showshort = async () => {
    if (route.query.id !== 'recycle') {
        leftshortlist.value = []
        rightshortlist.value = []
        let respage = await getpageshortApi({
            gid: getleftgid.value || props.grouplist[0].gid,
            current: current.value,
            size: pageSize.value,
            orderTag: ''
        })
        try {
            if (!respage.data.success) message.error(respage.data.message)
            else {
                rightshortlist.value = respage.data.data.records
                emit('getrightshortlist', rightshortlist.value)
            }
        } catch (err) {
            message.error(err)
        }
    } else {
        let res = await getrecycleApi({
            current: current.value,
            size: pageSize.value
        })
        recyclelist.value = res.data.data
    }

}
let leftshortlist = ref()
// 根据左边切换leftshort
emitter.on("leftshortlist", (response) => {
    leftshortlist.value = response
})
// 总页数
emitter.on("totalsize", (response) => {
    total.value = response
})
// 时间选择
const onChange = (value, dateString) => {
    createtime.value = dateString
};
const onOk = value => {
};
// 切换到回收站后
let recyclelist = ref()
emitter.on('getrecyclelist', (response) => {
    recyclelist.value = response
    total.value = response.total
})
// 必须为http以及https为开头的规则(创建一个)
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
// 必须为http以及https为开头的规则(同时创建多个)
function morehttpOrhttps(value) {
    let reg = /(http|https):\/\/([\w.]+\/?)\S*/
    let flag = false
    let reallreg = []
    let newvalue = value.split(/\s+/)
    for (let key in newvalue) {
        reallreg.push(reg.test(newvalue[key]) && newvalue.length <= 100)
    }
    for (let key in reallreg) {
        if (!reallreg[key]) {
            flag = false
            break
        } else {
            flag = true
        }
    }
    return flag;
}
const validatemoreHttpmust = async (_rule, value) => {
    if (morehttpOrhttps(value)) {
        return Promise.resolve()
    } else {
        return Promise.reject('请输入 http:// 或 https:// 开头的链接或应用跳转链接并且链接不能超过100条')
    }
}
// 单条短链名称
const validateTip = async (_rule, value) => {
    if (value.length > 0 && value.length <= 50) {
        return Promise.resolve()
    } else {
        return Promise.reject('短链标题长度为0-50之间')
    }
}
// 多条短链名称
const moreTip = (value) => {
    let newvalue = value.split(/\s+/)
    let flag = false
    let realltip = []
    let middletip
    for (let key in newvalue) {
        if (newvalue[key].length > 0 && newvalue[key].length <= 64) {
            middletip = true
        } else {
            middletip = false
        }
        realltip.push(middletip)
    }
    for (let key in realltip) {
        if (!realltip[key]) {
            flag = false
            break
        } else {
            flag = true
        }
    }
    return flag
}
const validatemoreTip = async (_rule, value) => {
    if (value.split(/\s+/).length <= 0 && value.split(/\s+/).length > 100) {
        return Promise.reject('短链标题在1-100条内')
    }
    if (moreTip(value)) {
        return Promise.resolve()
    } else {
        return Promise.reject('每条短链不能超过64个字')
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
// 多个的条件
const ruling = {
    herf: [
        {
            required: true,
            validator: validatemoreHttpmust,
            trigger: 'change',
        },
    ],
    tip: [{
        required: true,
        validator: validatemoreTip,
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
// 禁止选择时间
const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};
const disabledDate = current => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
};
const disabledDateTime = () => {
    return {
        disabledHours: () => range(0, 24).splice(4, 20),
        disabledMinutes: () => range(30, 60),
        disabledSeconds: () => [55, 56],
    };
};
// 根据短链接获取提示
// 切换时，删除左右两边
watch(leftshortlist, () => {
    rightshortlist.value = []
})
// 如果切换到recycle(回收站),则所有数据清空
watch(
    () => route.query.id,
    (newvalue) => {
        if (newvalue === 'recycle') {
            rightshortlist.value = []
            leftshortlist.value = []
        } else {
            recyclelist.value = []
        }
    }
)
</script>

<style lang="less" scoped>
.box {
    width: 100%;
}

.input {
    display: block;
    margin-top: 15px;
    margin-left: 15px;
    width: 100%;
}

.recycle {
    display: flex;
    margin-left: 15px;
    align-items: center;
    margin-top: 15px;

    .num {
        font-size: 12px;
        margin-left: 10px;
    }
}

.novalue {
    margin-top: 10%
}

.popbox {
    width: 100%;
}

.checkbox {
    margin-top: 15px;
    margin-left: 20px;
    display: flex;
    align-items: center;

    .delnum {
        color: #3464e0;
        font-size: 12px;
        margin-left: 15px;
    }

    .danger {
        margin-left: 25px;
    }
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

footer {
    position: absolute;
    bottom: 50px;
    margin-left: 41%;
    transform: translate(-50%);
}
</style>