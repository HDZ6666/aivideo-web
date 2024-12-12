import { getApiClient } from '@aivideo/rest';
import { RulesForm, type RulesQuery } from '@/api/model/alarm/notifierTargetsModel';

const apiClient = getApiClient();

const url = '/api/alarm/v2/notifier-targets/';

export function addRules(data: RulesForm) {
  return apiClient.POST(url, { body: data });
}

export function delRules(ids: number[]) {
  return apiClient.POST('/api/alarm/v2/notifier-targets/delete', { body: { ids: ids } });
}

export function listRules(params: RulesQuery) {
  return apiClient.GET(url, { params: { query: params } });
}

export function getRules(id: number) {
  return apiClient.GET('/api/alarm/v2/notifier-targets/{id}', { params: { path: { id: id } } });
}

export function updateRules(obj: RulesForm) {
  return apiClient.PUT(url + obj.id, { body: obj });
}
