import instance from "../utils/requests";
//移动到回收站
export const removerecycleApi = (data) => {
    return instance({
        method: "Post",
        url: `/api/shortlink/admin/v1/recycle-bin/save`,
        data: data
    })
}
// 分页获取回收站信息
export const getrecycleApi = (params) => {
    return instance({
        method: "Get",
        url: `/api/shortlink/admin/v1/recycle-bin/page?current=${params.current}&size=${params.size}`,
    })
}
// 恢复短链接
export const recoverrecycleApi = (data) => {
    return instance({
        method: "Post",
        url: `/api/shortlink/admin/v1/recycle-bin/recover`,
        data: data
    })
}
// 彻底删除短链接
export const delrecycleApi = (data) => {
    return instance({
        method: "Post",
        url: `/api/shortlink/admin/v1/recycle-bin/del`,
        data: data
    })
}
// 批量移动至回收站
export const removeallrecycleApi = (data) => {
    return instance({
        method: "Post",
        url: `/api/shortlink/admin/v1/recycle-bin/batch/save`,
        data: data
    })
}
