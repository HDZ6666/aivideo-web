/*
 * @Description:
 * @Autor: ZCR
 * @Date: 2023-11-29 16:21:05
 * @LastEditors: ZCR
 * @LastEditTime: 2023-12-18 17:44:28
 */
import request from '@/utils/request';

// 查询企业活跃自动化报告分析列表
export function listAutoTemplate(query) {
    return request({
        url: '/bss/autoTemplate/list',
        method: 'get',
        params: query,
    });
}

// 查询企业活跃自动化报告分析详细
export function getAutoTemplate(id) {
    return request({
        url: '/bss/autoTemplate/' + id,
        method: 'get',
    });
}

// 新增企业活跃自动化报告分析
export function addAutoTemplate(data) {
    return request({
        url: '/bss/autoTemplate',
        method: 'post',
        data: data,
    });
}

// 修改企业活跃自动化报告分析
export function updateAutoTemplate(data) {
    return request({
        url: '/bss/autoTemplate',
        method: 'put',
        data: data,
    });
}

// 删除企业活跃自动化报告分析
export function delAutoTemplate(id) {
    return request({
        url: '/bss/autoTemplate/' + id,
        method: 'delete',
    });
}

// 批量修改企业活跃自动化报告分析上下线状态
export function batchUpdateState(data) {
    return request({
        url: '/bss/autoTemplate/batchUpdateState',
        method: 'put',
        data: data,
    });
}

// 导入
export function upload(data) {
    return request({
        url: '/bss/autoTemplate/upload',
        method: 'post',
        data: data,
    });
}
