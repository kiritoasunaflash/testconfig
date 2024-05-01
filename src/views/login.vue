<template>
    <div class="box">
        <!-- 公共部分 -->
        <div class="tips"> <strong>mortal短链接</strong></div>
        <div class="Handover">
            <span class="wx" @click="gologin" :class="{ active: point === 1 ? 1 : 0 }"
                :style="{ borderBottom: point === 1 ? '2px solid #3464e0' : '' }"> <i class="iconfont icon-wodezhanghao"
                    :style="{ color: point === 1 ? '#3464e0' : '' }"></i>
                <span>账号登录</span></span>
            <span class="emil" @click="goregist" :class="{ active: point === 2 ? 1 : 0 }"
                :style="{ borderBottom: point === 2 ? '2px solid #3464e0' : '' }"> <i class="iconfont  icon-zhanghao1"
                    :style="{ color: point === 2 ? '#3464e0' : '' }"></i><span>手机注册</span></span>
        </div>
        <!-- 邮箱登录 -->
        <div class="emilbox" v-if="point === 1">
            <div class="tip">
                <div class="icon">
                    <InfoCircleOutlined />
                </div>
                <span> 如果是第一次使用，请先通过手机注册</span>
            </div>
            <a-form ref="EmailformRef" name="custom-validation-email" :model="EmailformState" :rules="rules">
                <strong class="email">用户名</strong>
                <a-form-item has-feedback name="emailvalue">
                    <a-input placeholder="请输入您的用户名" v-model:value="EmailformState.emailvalue"
                        style="width: 80%; margin-left:48px;margin-top:20px" />
                </a-form-item>
                <div class="passwordbox">
                    <strong class="password">密码</strong>
                    <span class="nopassword">忘记密码?</span>
                </div>
                <a-form-item has-feedback name="emailpassword">
                    <a-input-password placeholder="请输入密码" v-model:value="EmailformState.emailpassword"
                        style="width: 80%; margin-left: 48px;margin-top:20px" />
                </a-form-item>
                <div class="remeber">
                    <input type="checkbox" name="" id="">记住密码
                </div>
                <div class="button" @click="getlogin">
                    <a-button>登录</a-button>
                </div>
            </a-form>
        </div>
        <!-- 手机注册 -->
        <div class="wxbox" v-if="point === 2">
            <a-form ref="registformRef" name="custom-validation-regist" :model="RegistformState" :rules="ruling">
                <strong class="name">姓名</strong>
                <a-form-item has-feedback name="name">
                    <a-input placeholder="请输入您的真实姓名" v-model:value="RegistformState.name"
                        style="width: 80%; margin-left:48px;margin-top:5px" />
                </a-form-item>
                <strong class="username">用户名</strong>
                <a-form-item has-feedback name="username">
                    <a-input placeholder="请输入您的用户名" v-model:value="RegistformState.username"
                        style="width: 80%; margin-left:48px;margin-top:5px" />
                </a-form-item>
                <strong class="password">密码</strong>
                <a-form-item has-feedback name="password">
                    <a-input-password placeholder="请输入您的密码" v-model:value="RegistformState.password"
                        style="width: 80%; margin-left:48px;margin-top:5px" />
                </a-form-item>
                <strong class="phone">电话号码</strong>
                <a-form-item has-feedback name="phone">
                    <a-input placeholder="请输入您的电话号码" v-model:value="RegistformState.phone"
                        style="width: 80%; margin-left:48px;margin-top:5px" />
                </a-form-item>
                <strong class="email">邮箱</strong>
                <a-form-item has-feedback name="email">
                    <a-input placeholder="请输入您的邮箱" v-model:value="RegistformState.email"
                        style="width: 80%; margin-left:48px;margin-top:5px" />
                </a-form-item>
            </a-form>
            <div class="button" @click="getregist">
                <a-button>注册</a-button>
            </div>

        </div>
    </div>
    {{ data }}
</template>

<script setup>
import { InfoCircleOutlined } from '@ant-design/icons-vue';
import { ref, reactive, onMounted, computed } from 'vue'
import { regist, login } from '@/Api/regist'
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import { emitter } from "@/utils/mitt.js";
import { userState } from '@/stores/userInfo';
import { getOther } from '@/stores/other';
// import { mapState, mapActions } from 'pinia'
import { setToken, getToken } from '@/utils/cookie'
const useStore = userState()
const otherStore = getOther()
const data = ref(0)
onMounted(() => {
    useStore
    otherStore
    console.log(useStore.tokenTest);
    console.log(otherStore.time.value);
    console.log(getToken('token'));
})
computed(() => {
    data.value = mapState(getOther, ['time'])
})
const router = useRouter()
// 设置初始登录值为1，微信为1，邮箱为2
let point = ref(1)
const gologin = () => {
    point.value = 1
}
const goregist = () => {
    point.value = 2
}
//设置邮箱登录里面的
const EmailformRef = ref();
const EmailformState = reactive({
    emailvalue: '',
    emailpassword: ''
});

// 邮箱账号
const validateEmailValue = async (_rule, value) => {
    if (value === '') {
        return Promise.reject('请输入用户名');
    } else {
        return Promise.resolve();
    }
};
// 邮箱密码
const validateEmailPassword = async (_rule, value) => {
    if (value === '') {
        return Promise.reject('请输入密码');
    } else if (value.length < 6) {
        return Promise.reject('密码至少为6位');
    } else if (value.length > 16) {
        return Promise.reject('密码至多为13位');
    } else {
        return Promise.resolve();
    }
};
//登录邮箱规则
const rules = {
    emailvalue: [
        {
            required: true,
            validator: validateEmailValue,
            trigger: 'change',
        },
    ],
    emailpassword: [{
        required: true,
        validator: validateEmailPassword,
        trigger: 'change',
    }]
};
// 注册规则
const RegistformState = reactive({
    name: '',
    email: '',
    password: '',
    phone: '',
    username: ''
});
const validatename = async (_rule, value) => {
    if (value === '') {
        return Promise.reject('请输入真实姓名');
    } else {
        return Promise.resolve();
    }
};
// 电话规则
function rulephone(phone) {
    var result = /^[1][3,4,5,7,8][0-9]{9}$/
    return result.test(phone)
}
const validatephone = async (_rule, value) => {
    if (value === '') {
        return Promise.reject('请输入电话号码');
    } else if (!rulephone(value)) {
        return Promise.reject('请输入正确的电话号码');
    } else {
        return Promise.resolve();
    }
};
const validateusername = async (_rule, value) => {
    if (value === '') {
        return Promise.reject('请输入电话号码');
    } else if (value.length > 6) {
        return Promise.reject('用户名不能超过6位');
    } else {
        return Promise.resolve();
    }
};
const ruling = {
    name: [
        {
            required: true,
            validator: validatename,
            trigger: 'change',
        },
    ],
    password: [{
        required: true,
        validator: validateEmailPassword,
        trigger: 'change',
    }],
    email: [{
        required: true,
        validator: validateEmailValue,
        trigger: 'change',
    }],
    phone: [{
        required: true,
        validator: validatephone,
        trigger: 'change',
    }],
    username: [{
        required: true,
        validator: validateusername,
        trigger: 'change',
    }]
};
// 注册的回调
const getregist = async () => {
    if (RegistformState.username && RegistformState.password && RegistformState.name && RegistformState.phone && RegistformState.email) {
        let registresult = await regist({
            username: RegistformState.username,
            password: RegistformState.password,
            realName: RegistformState.name,
            phone: RegistformState.phone,
            mail: RegistformState.email
        })
        try {
            if (!registresult.data.success) {
                throw new Error(registresult.data.message)
            } else {
                message.success('注册成功')
                setTimeout(() => {
                    point.value = 1
                }, 1000)

            }
        } catch (err) {
            message.error(registresult.data.message)
        }
    } else {
        message.error('请填写完整信息')
    }
}
// 登录的回调
const getlogin = async () => {
    if (EmailformState.emailvalue && EmailformState.emailpassword) {
        const loginresult = await login({
            username: EmailformState.emailvalue,
            password: EmailformState.emailpassword
        })
        // 登录成功后将username传给myhome里面
        emitter.emit('getusername', EmailformState.emailvalue)
        try {
            if (!loginresult.data.success) {
                throw new Error(loginresult.data.message)
            } else {
                message.success('登录成功')
                //存储token
                localStorage.setItem('token', loginresult.data.data.token)
                router.replace('/home/myspace')

            }
        }
        catch (err) {
            message.error(loginresult.data.message)
        }
    } else {
        message.error('请输入账号或密码')
    }
}



</script>

<style lang="less" scoped>
/deep/ .ant-form-item-explain-error {
    margin-left: 48px;
    font-size: 12px;

}

.box {
    height: 630px;
    width: 30%;
    background-color: #ffffff;
    margin-left: 50%;
    transform: translate(-50%);
    margin-top: 40px;

    i {
        color: #515a6e;
    }

    .tips {
        padding-top: 30px;

        strong {
            font-size: 32px;
            display: flex;
            justify-content: center;
            color: #303659;
        }
    }

    .Handover {
        margin-left: 50%;
        transform: translate(-50%);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 50px;
        width: 100%;


        .wx,
        .emil {
            display: block;
            border-bottom: 1px solid #cbcdd4;
            transition-duration: .3s;
        }

        .wx {
            margin-left: 50px;
            width: 70%;
            text-align: center;

            span {
                display: inline-block;
                margin-bottom: 5px;
                margin-left: 5px;
            }
        }

        .wx:hover,
        .emil:hover {
            cursor: pointer;
        }

        .emil {
            margin-right: 50px;
            width: 70%;
            text-align: center;

            span {
                display: inline-block;
                margin-left: 5px;
                margin-bottom: 5px;
            }
        }


    }

    .wxbox {
        transition-duration: 8s;
        height: 80%;

        .name,
        .email,
        .username,
        .password,
        .phone {
            margin-left: 48px;
            display: block;

        }

        .name {
            margin-top: 8px
        }

        .button {
            width: 80%;
            margin-left: 48px;
            margin-top: -10px;

            button {
                width: 100%;
                background-color: #3464e0;
                color: #ffffff;
            }
        }
    }

    .emilbox {

        .tip {
            width: 80%;
            transform: translate(-50%);
            margin-left: 50%;
            height: 30px;
            background-color: #eaeffc;
            margin-top: 20px;
            border-radius: 3px;
            display: flex;
            align-items: center;
            justify-content: center;


            span {
                font-size: 14px;
                margin-left: 20px;
            }

            .icon {
                margin-left: -40px;
                color: #3464e0
            }

        }

        .password,
        .email {
            display: block;
            margin-top: 7px;
            margin-left: 48px;
        }

        .passwordbox {
            display: flex;
            justify-content: space-between;

            .nopassword {
                margin-top: 12px;
                margin-right: 48px;
                font-size: 12px;
            }
        }

        .remeber {
            margin-top: 20px;
            margin-left: 48px;
            font-size: 12px;
            display: flex;
            align-items: center;
        }

        .button {
            width: 80%;
            margin-left: 48px;

            margin-top: 50px;

            button {
                width: 100%;
                background-color: #3464e0;
                color: #ffffff;
            }
        }
    }
}

.active {
    color: #3464e0;
    border-bottom: 1px solid #3464e0;
}
</style>