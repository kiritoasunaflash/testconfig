import instance from "../utils/requests";
//根据url获取标题
export const geturltipApi = (params) => {
    return instance({
        method: 'Get',
        url: `/api/shortlink/admin/v1/title`,
        params: params
    })
}
// 分页获取短链接
export const getpageshortApi = (data) => {
    return instance({
        method: 'Post',
        url: `/api/sortlink/admin/v1/link/page`,
        data: data
    })
}
// 查询短链接分组内数量
export const getshortnumApi = (params) => {
    return instance({
        method: 'Get',
        url: `/api/shortlink/admin/v1/link/g-count?params=${params}`,
    })
}
// 修改短链接
export const reputshortnumApi = (data) => {
    return instance({
        method: 'Put',
        url: `/api/sortlink/admin/v1/link/update`,
        data: data
    })
}
// 保存分组排序
export const savesort = (data) => {
    return instance({
        method: 'Post',
        url: '/api/shortlink/admin/v1/group/sort',
        data: data
    })
}