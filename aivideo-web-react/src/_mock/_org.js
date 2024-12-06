import { rest } from 'msw';

import { ORG_LIST } from '@/_mock/assets';
import { OrgApi } from '@/api/services/orgService';

let count = 0;

const orgList = rest.get(`/api${OrgApi.Org}`, async (req, res, ctx) => {
  count += 1;

  // const { status } = await req.json();

  // const list = ORG_LIST.find((item) => item.status === status);

  if (count > 2) {
    return res(
      ctx.status(200),
      ctx.json({
        status: 0,
        message: '',
        data: ORG_LIST,
      }),
    );
  }
  return res(
    ctx.status(200),
    ctx.json({
      status: 0,
      message: '',
      data: ORG_LIST,
    }),
  );
});

export default [orgList];
