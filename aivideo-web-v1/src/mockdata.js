import UserService from "./components/service/UserService";

export async function getUserInfo(err) {
    if( err.response.status !== 404){
        return await reject(err);
    }
    let user = UserService.getUser()
    if(!user){
        return await reject("未登录");
    }
    return {
        data: {
            data: {
                user: user,
                roles: [user.roles],
                permissions: []
            }
        }
    }
}


export async function getTestTopMenu(err) {
    if( err.response.status !== 404){
        return await reject(err);
    }
    return {
        data: {
            code: 0,
            data: [
                {
                    id: 0, path: '/',
                    component: "Layout",
                    meta: { title: '测试' },
                    children: [
                        { id: 1, path: '/videoCockpit', component: "videoCockpit.vue", meta: { title: '数据大屏' } },
                        { id: 2, path: '/live', component: "live.vue", meta: { title: '分屏监控' } },
                        { id: 3, path: '/deviceList', component: "DeviceList.vue", meta: { title: '国标设备列表' } },
                        { id: 4, path: '/deviceGroup', component: "DeviceGroup.vue", meta: { title: '国标设备分组' } },
                        { id: 5, path: '/streamProxyList', component: "StreamProxyList.vue", meta: { title: '非国标对接' } },
                        { id: 6, path: '/v2/datav', component: "v2/datavV2.vue", meta: { title: '大屏V2' } }
                    ]
                }
            ]
        }
    }
}