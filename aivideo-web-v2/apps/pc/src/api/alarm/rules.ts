import {getApiClient} from '@aivideo/rest';
import {RulesForm, type RulesQuery} from "@/api/model/alarm/rulesModel";

const apiClient = getApiClient();

const url = '/api/alarm/v2/rules/'

export function addRules(data: RulesForm) {
  return apiClient.POST(
    url, {body: data}
  );
}

export function delRules(ids: number[]) {
  return apiClient.POST(
    '/api/alarm/v2/rules/delete', {body: {ids: ids}}
  );
}

export function listRules(params: RulesQuery) {
  return apiClient.GET(
    url, {params: {query: params}},
  );
}

export function getRules(id: number) {
  return apiClient.GET(
    url + id,
  );
}

export function listUserByRulesId() {
  return apiClient.GET(
    url
  );
}

export function updateRules(obj: RulesForm) {
  return apiClient.PUT(
    url + obj.id, {body: obj}
  );
}
