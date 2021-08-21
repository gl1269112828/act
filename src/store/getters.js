const getters = {
  isCollapse: state => state.setting.isCollapse,
  menus: state => state.login.menus,
  dynamicRouter: state => state.common.dynamicRouter,
  conditionList: state => state.common.conditionList
};
export default getters;
