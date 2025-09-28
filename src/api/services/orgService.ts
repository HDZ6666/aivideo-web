import apiClient from '../apiClient';

import { Organization } from '#/entity';

export enum OrgApi {
  Org = '/org',
}

export interface GetOrgListReq {
  name: string;
  status: string;
}

const getOrgList = (params: GetOrgListReq) =>
  apiClient.get<Organization[]>({ url: OrgApi.Org, params });

export default {
  getOrgList,
};
