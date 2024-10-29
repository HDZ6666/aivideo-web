import { getApiClient } from '@aivideo/rest';
import { RulesForm, type RulesQuery } from '@/api/model/alarm/eventsModel';

const apiClient = getApiClient();

const url = '/api/alarm/v2/events/';

export function addRules(data: RulesForm) {
  return apiClient.POST(url, { body: data });
}

export function delRules(ids: number[]) {
  return apiClient.POST('/api/alarm/v2/events/delete', { body: { ids: ids } });
}

export function listRules(params: RulesQuery) {
  return apiClient.GET(url, {
    params: {
      query: {
        ...params,
        levelStart: params?.alarmLevel,
      },
    },
  });
}

export function getRules(id: number) {
  return apiClient.GET('/api/alarm/v2/events/{id}', { params: { path: { id: id } } });
}

export function updateRules(obj: RulesForm) {
  return apiClient.PUT(url + obj.pkey, { body: obj });
}
