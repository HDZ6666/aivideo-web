import { RulesForm, type RulesQuery } from "@/api/model/alarm/datapointsModel";
import { getApiClient } from '@aivideo/rest';
import { components } from "@aivideo/rest/src/openapi/schema";

const apiClient = getApiClient();

const url = '/api/alarm/v2/datapoints/'

type AlarmDataPointForm = components["schemas"]["AlarmDataPointForm"]
export function addRules(data: AlarmDataPointForm) {
  return apiClient.POST(
    url, {body: data}
  );
}

export function delRules(ids: number[]) {
  return apiClient.POST(
    '/api/alarm/v2/datapoints/delete', {body: {ids: ids}}
  );
}

export function listRules(params: RulesQuery) {
  return apiClient.GET(
    url, {params: {query: {
      ...params,
      levelStart:params?.alarmLevel
    }}},
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
