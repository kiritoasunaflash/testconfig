import './assets/global.css'
import './assets/iconfont/iconfont.css'
import draggable from 'vuedraggable'
import Antd from 'ant-design-vue';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Antd).use(draggable).mount('#app')
