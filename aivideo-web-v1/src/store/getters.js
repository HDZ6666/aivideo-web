const getters = {
roles: state => state.user.roles,
permissions: state => state.user.permissions,
topbarRouters:state => state.permission.topbarRouters,
defaultRoutes:state => state.permission.defaultRoutes,
sidebarRouters:state => state.permission.sidebarRouters,
}
export default getters
  