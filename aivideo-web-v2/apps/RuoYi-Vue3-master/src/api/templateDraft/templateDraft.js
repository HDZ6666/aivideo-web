import request from '@/utils/request';

// 查询模版草稿列表
export function listTemplateDraft(query) {
    return request({
        url: '/bss/templateDraft/list',
        method: 'get',
        params: query,
    });
}

// 查询模版草稿详细
export function getTemplateDraft(id) {
    return request({
        url: '/bss/templateDraft/' + id,
        method: 'get',
    });
}

// 新增模版草稿
export function addTemplateDraft(data) {
    return request({
        url: '/bss/templateDraft',
        method: 'post',
        data: data,
    });
}

// 修改模版草稿
export function updateTemplateDraft(data) {
    return request({
        url: '/bss/templateDraft',
        method: 'put',
        data: data,
    });
}

// 删除模版草稿
export function delTemplateDraft(id) {
    return request({
        url: '/bss/templateDraft/' + id,
        method: 'delete',
    });
}
