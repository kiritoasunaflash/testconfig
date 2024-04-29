
import instance from "../utils/requests";
// 短链监控渲染页面
export const statsApi = (params) => {
    return instance({
        method: 'Get',
        url: `/api/shortlink/admin/v1/stats?fullShortUrl=${params.fullShortUrl}&gid=${params.gid}&startDate=${params.startDate}&endDate=${params.endDate}`,
    })
}
// 获取单个短链接的监控访问记录
export const onestatsApi = (params) => {
    return instance({
        method: 'Get',
        url: `/api/shortlink/admin/v1/stats/access-record?fullShortUrl=${params.fullShortUrl}&gid=${params.gid}&startDate=${params.startDate}&endDate=${params.endDate}&current=${params.current}&size=${params.size}`,
    })
}
