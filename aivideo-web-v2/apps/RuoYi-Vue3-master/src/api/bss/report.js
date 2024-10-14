import request from '@/utils/request';

// 查询报告列表
export function listReport(query) {
    return request({
        url: '/bss/report/list',
        method: 'get',
        params: query,
    });
}

// 查询报告详细
export function getReport(id) {
    return request({
        url: '/bss/report/' + id,
        method: 'get',
    });
}

// 新增报告
export function addReport(data) {
    return request({
        url: '/bss/report',
        method: 'post',
        data: data,
    });
}

// 修改报告
export function updateReport(data) {
    return request({
        url: '/bss/report',
        method: 'put',
        data: data,
    });
}

// 删除报告
export function delReport(id) {
    return request({
        url: '/bss/report/' + id,
        method: 'delete',
    });
}
// 导出 下载
export function downloadLocal(params) {
    return request({
        url: '/bss/report/downloadLocal2',
        method: 'GET',
        params,
        responseType: 'blob',
    });
}

// 文件导入
export function upload(data) {
    return request({
        url: '/bss/report/upload',
        method: 'post',
        data: data,
    });
}
// 文件导入
export function reportExportRecord(params) {
    return request({
        url: '/bss/reportExportRecord/list',
        method: 'get',
        params: params,
    });
}
