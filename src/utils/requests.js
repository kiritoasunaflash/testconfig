import axios from 'axios'
// import { config } from '@vue/test-utils';
const instance = axios.create({
    baseURL: '/api',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'token': localStorage.getItem('token') || ''
    }
});
//请求拦截器
// requests.interceptors.request.use(config => {
//     在发送请求之前做些什么
//     if (localStorage.getItem('user_token')) {
//         config.headers.token = localStorage.getItem('user_token');
//     } else if (localStorage.getItem('patien_token')) {
//         config.headers.token = localStorage.getItem('patien_token');
//     } else if (localStorage.getItem('doc_token')) {
//         config.headers.token = localStorage.getItem('doc_token');
//     } else {
//         console.log('token不存在哦');
//     }
//     const getusertoken = getTokenStore()
//     const usertoken = getusertoken.userToken

//     return config;
// }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
// });

// // 添加响应拦截器
// requests.interceptors.response.use(function (response) {
//     // 2xx 范围内的状态码都会触发该函数。
//     // 对响应数据做点什么
//     return response;
// }, function (error) {
//     // 超出 2xx 范围的状态码都会触发该函数。
//     // 对响应错误做点什么
//     ElMessage({
//         message: error.response.data.errMessage,
//         type: 'error',
//     })
//     return Promise.reject(error);
// });
export default instance