import instance from "../utils/requests";
// 创建短链接分组
export const groupApi = (data) => {
    return instance({
        method: "Post",
        url: `/api/shortlink/admin/v1/group`,
        data: data
    })
}
// 获取用户分组列表
export const getgroupApi = () => {
    return instance({
        method: 'Get',
        url: '/api/shortlink/admin/v1/group'
    })
}
// 创建短链接
export const putnewshortlinkApi = (data) => {
    return instance({
        method: 'Post',
        url: '/api/shortlink/admin/v1/link/create',
        data: data
    })
}
// 修改短链接名称
export const editorlinknameApi = (data) => {
    return instance({
        method: 'Put',
        url: '/api/shortlink/admin/v1/group',
        data: data
    })
}
// 删除链接
export const deletelinknameApi = (gid) => {
    return instance({
        method: 'Delete',
        url: `/api/shortlink/admin/v1/group/${gid}`,
    })
}
// 批量创建短链接
export const createmorenewshortlinkApi = (data) => {
    return instance({
        method: 'Post',
        url: '/api/shortlink/admin/v1/create/batch',
        data: data
    })
}