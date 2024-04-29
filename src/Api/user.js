
import instance from "../utils/requests";
// 用户登录
export const login = (username) => {
    return instance({
        method: 'Get',
        url: `/api/shortlink/admin/v1/actual/user/${username}`,
    })
}