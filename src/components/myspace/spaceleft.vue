<template>
    <header>
        短链分组
        <span> 共{{ grouplist.length }}组</span>
        <span class="add" @click="showModal">
            <PlusSquareOutlined style="color: #3464e0; font-size:16px " />
        </span>
    </header>
    <div>
        <a-modal v-model:open="open" title="新建分组链接" @ok="handleOk" cancelText="取消" okText="确认">
            <div class="name"><strong>分组名称</strong></div>
            <a-input :value="value" @input="inputtext" placeholder="请输入分组名称"></a-input>
        </a-modal>
    </div>
    <ul class="shortlinkbox">
        <draggable :list="grouplist" ghost-class="ghost" chosen-class="chosenClass" animation="300" @start="onStart"
            @end="onEnd(grouplist, index)">
            <template #item="{ element, index }">
                <li class="linkli" style="background: #ffffff" @click="getnewright(element.name, index, element.gid)"
                    draggable="true" @mouseenter="changenum(element.name, index)" @mouseleave="numradio = ''"
                    @dragstart="start($event, element.gid)" @dragend="end">
                    <div class="everylink" :class="{ active: index === indexvalue ? true : false }"
                        :style="{ color: index === indexvalue ? '#3464e0' : '#464b57' }">
                        <span class="linkname"> {{ element.name }}</span>
                        <span class="linknum" v-if="index !== numradio"> {{ lefttotalnnum.findIndex(itemleft =>
            itemleft.gid === element.gid) == '-1' ? 0 :
            lefttotalnnum[lefttotalnnum.findIndex(itemleft => itemleft.gid ===
                element.gid)].shortLinkCount }}</span>
                        <span class="linkmore" v-else @mouseenter="changemore" @mouseleave="more = false">
                            <EllipsisOutlined />
                            <ul class="more" v-if="more && index == numradio" @mouseleave="editor = ''">
                                <li class="editor" @mouseenter="changeeditor"
                                    :class="{ active1: editor === 'editor' ? true : false }"
                                    @click="editorname(element)">编辑
                                </li>
                                <li class="delete" @mouseenter="changedelete"
                                    :class="{ active1: editor === 'delete' ? true : false }"
                                    @click="deletename(element)">删除
                                </li>
                            </ul>
                        </span>
                    </div>
                </li>

            </template>
        </draggable>
    </ul>
    <a-modal v-model:open="newopen" title="编辑短链分组" @ok="newhandleOk" cancelText="取消" okText="确认">
        <div style="margin-top:20px;margin-bottom: 6px;">分组名称</div>
        <a-input v-model:value="newlinkname" placeholder="请输入新的分组名称" />
    </a-modal>
    <a-modal v-model:open="deleteopen" title="确认删除" @ok="deletehandleOk" cancelText="取消" okText="删除" okType="danger">
        <div style="margin-top:20px;margin-bottom: 6px;font-size: 12px; line-height: 3cap;">
            删除分组后，分组内的短链接将会被移至回收站，移至回收站后依然可以跳转和统计数据，是否删除？</div>
    </a-modal>
    <footer @dragover="over" @drop="drop" @click="changedel" :class="{ active: delvalue ? true : false }"
        :style="{ color: delvalue ? '#3464e0' : '#464b57' }">
        <span class="rabish">
            <RestOutlined :style="{ color: delvalue ? '#3464e0' : '#464b57' }" />
        </span>
        <span style="font-size: 12px;">
            回收站
        </span>
    </footer>
</template>

<script setup>
import { PlusSquareOutlined, RestOutlined, EllipsisOutlined } from '@ant-design/icons-vue';
import { ref, defineEmits, watch } from 'vue'
import { groupApi, editorlinknameApi, deletelinknameApi } from '@/Api/shortlink'
import { getpageshortApi, savesort } from '@/Api/rightlink'
import { getrecycleApi } from '@/Api/recycle'
import { useRoute, useRouter } from 'vue-router';
import { emitter } from "@/utils/mitt.js";
import { message } from 'ant-design-vue';
import draggable from "vuedraggable";
// 左边的移动框架
const onStart = () => {

}
//拖拽结束的事件
const onEnd = async (grouplist, index) => {
    for (let key in grouplist) {
        grouplist[key].sortOrder = grouplist.length - key
    }


    let res = await savesort(grouplist.map(item => { return { gid: item.gid, sortOrder: Number(item.sortOrder) } }))


}
//移动事件
const onMove = (e) => {

}




const router = useRouter()
const route = useRoute()
const emit = defineEmits(['getspaceright', 'getleftshortlist'])
const props = defineProps({
    grouplist: { type: Array, default: [] },
    lefttotalnnum: { type: Array, default: [] }
})
let newlinkname = ref()
// 切换回收站并改变背景颜色
let changerecycle = ref(1)
let delvalue = ref(false)
let recyclelist = ref()
emitter.emit("getchangerecycle", changerecycle.value)
const changedel = async () => {
    changerecycle.value = 2
    delvalue.value = true
    indexvalue.value = false
    emitter.emit("getchangerecycle", changerecycle.value)
    router.push({ path: `/home/myspace`, query: { id: 'recycle' } })
    let res = await getrecycleApi({
        current: 1,
        size: 10
    })

    if (res.data.success) {
        recyclelist.value = res.data.data
        emitter.emit('getrecyclelist', recyclelist.value)
    } else {
        message.error('未知错误')
    }
}


const value = ref()
const inputtext = (e) => {
    value.value = e.target.value
}

let indexvalue = ref(0)
// 是否显示编辑和删除
let more = ref(false)
const changemore = () => {
    more.value = true
}
// 改变编辑和删除的背景
let editor = ref()
const changeeditor = () => {
    editor.value = 'editor'
}
const changedelete = () => {
    editor.value = 'delete'
}
// 点击修改短链姓名editorname
const newopen = ref(false);
let origngroup = ref()
const editorname = (item) => {
    newopen.value = true;
    origngroup.value = item

}
const newhandleOk = async () => {

    if (newlinkname.value) {
        const res = await editorlinknameApi({
            gid: origngroup.value.gid,
            name: newlinkname.value
        })
        try {
            if (res.data.success) {
                message.success({
                    content: '修改成功',
                    duration: .5
                })
                setTimeout(() => {
                    router.go(0)
                }, 800);
            }
        }
        catch (err) {
            message.error('修改失败')
        }
    } else {
        message.warning('分组名不能为空')
    }
    newopen.value = false;
};
// 点击删除短链分组
let deleteopen = ref(false)
let deletegid = ref()
const deletename = (item) => {
    deleteopen.value = true
    deletegid.value = item.gid
}
const deletehandleOk = async () => {
    let res = await deletelinknameApi(deletegid.value)
    try {
        if (res.data.success) {
            message.success({
                content: '删除成功',
                duration: .5
            })
            setTimeout(() => {
                router.go(0)
            }, 800);
        }
    } catch (err) {
        message.error('删除失败')
    }
    deleteopen.value = false
}
// 数量改变为三个点
let numradio = ref()
// 对话框
const open = ref(false);
const showModal = () => {
    open.value = true;
};
const handleOk = async (e) => {
    open.value = false;
    let newgroup = await groupApi({ name: value.value })
    try {
        if (newgroup.data.success) {
            message.success({
                content: '添加成功',
                duration: .5
            })
            setTimeout(() => {
                router.go(0)
            }, 800);
        }
    } catch (err) {
        message.error('添加失败')
    }
};
// 点击左边改变右边图形&&获取短链接
let leftshortlist = ref()
const getnewright = async (name, index, gid) => {
    changerecycle.value = 1
    leftshortlist.value = []
    emit('getspaceright', name)
    emitter.emit("getchangerecycle", changerecycle.value)
    emitter.emit("getshortname", name)
    emitter.emit("getgid", gid)
    indexvalue.value = index
    router.push({ path: `/home/myspace`, query: { id: name } })
    emitter.emit('query', route.query)
    delvalue.value = false
    // 点击左边获取默认短链接
    let respage = await getpageshortApi({
        gid: gid,
        current: 1,
        size: 10,
        orderTag: ''
    })
    try {
        if (respage.data.success) {
            leftshortlist.value = respage.data.data.records
            emitter.emit('leftshortlist', leftshortlist.value)
            emitter.emit('totalsize', respage.data.data.total)
            // emit.on('leftshortlist')
            emit('getleftshortlist', leftshortlist.value)
        }
        else { message.error(respage.data.message) }
    } catch (err) {
        message.error(err)
    }
}
const changenum = (name, index) => {
    numradio.value = index
}
// 传递给spaceright作比较

// 将短链分组拖进回收站删除
let temp = ref(null)
let nodegid = ref()
const start = (e, gid) => {
    //                保持当前拖拽的元素
    temp.value = e.target;
    nodegid.value = gid
}
const end = function () {
    //               当拖拽结束 ，清空temp
    temp.value = null;
}
const over = function (e) {
    //            阻止拖拽的默认行为
    e.preventDefault();
}
const drop = async (e) => {
    //            将拖拽的元素追加到 two里面来
    e.target.appendChild(temp.value);
    e.target.removeChild(temp.value)
    let res = await deletelinknameApi(nodegid.value)
    try {
        if (res.data.success) {
            message.success({
                content: '删除成功',
                duration: .5
            })
            setTimeout(() => {
                router.go(0)
            }, 800);
        }
    } catch (err) {
        message.error('删除失败')
    }
}
</script>

<style lang="less" scoped>
.name {
    margin-top: 30px;
    margin-bottom: 8px
}



header {
    width: 100%;
    height: 60px;
    line-height: 40px;
    margin-left: 4%;
    white-space: nowrap;
    display: flex;
    align-items: center;

    span {
        font-size: 10px;
        margin-left: 5px;
    }

    .add {
        margin-left: 15px;
        margin-top: 6px;
        font-weight: bolder;
        cursor: pointer;
    }

}

footer {
    border-top: 1px solid #ccc;
    height: 40px;
    width: calc(100% + 40px);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #464b57;
    cursor: pointer;
    padding-top: 8px;
}

.shortlinkbox {
    height: 83%;
    width: calc(100% + 40px);
    overflow-y: scroll;
    overflow-x: hidden;


    .everylink {
        padding-left: 15px;
        font-size: 13px;
        width: 100%;
        height: 40px;
        display: flex;
        align-items: center;
        color: #464b57;
        position: relative;

        .more {
            background-color: #ffffff;
            position: absolute;
            left: 50%;
            top: 90%;
            z-index: 999;
            box-shadow: 2px 2px 7px rgba(0, 0, 0, .1);
            border-radius: 2px;
            color: #60687e;

            li {
                width: 70px;
                height: 20px;
                margin: 6px 0px;
                padding: 2px 0 2px 5px
            }

            .delete {
                padding-top: 5px;
            }


        }

        .linkname {
            display: block;
            width: 80%;
        }

        .linknum {
            display: block;
        }

        .linkmore {
            display: block;
            height: 100%;
            display: flex;
            align-items: center;

        }
    }


}

.everylink:hover {
    background-color: #ebeffa;
    // color: #3464e0;
    font-weight: 700;
}

.active {
    background-color: #ebeffa;
}

.active1 {
    background-color: #eceff7;
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