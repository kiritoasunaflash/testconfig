import instance from "../utils/requests";
//用户注册（注册）
export const regist = (data) => {
    return instance({
        method: "Post",
        url: `/api/shortlink/admin/v1/user/register`,
        data: data
    })
}
// 用户登录
export const login = (data) => {
    return instance({
        method: 'Post',
        url: '/api/shortlink/admin/v1/user/login',
        data: data
    })
}