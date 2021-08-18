import Layout from '@/layout/index';

const getDefaultState = () => {
  return {
    dynamicRouter: [],
    conditionList: [
      { name: '等于', value: 'Equal' },
      { name: '不等于', value: 'NotEqual' },
      { name: '包含', value: 'Like' },
      { name: '大于', value: 'GreaterThan' },
      { name: '大于等于', value: 'GreaterThanOrEqual' },
      { name: '小于', value: 'LessThan' },
      { name: '小于等于', value: 'LessThanOrEqual' }
    ]
  };
};
const state = getDefaultState();
const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_DYNANICROUTER: (state, dynamicRouter) => {
    state.dynamicRouter = dynamicRouter;
  }
};
const actions = {
  initObj({}, parm) {
    return new Promise((resolve, reject) => {
      Object.keys(parm).forEach(key => {
        parm[key] = undefined;
      });
      resolve(parm);
    });
  },
  //构建路由
  constructRouter({ dispatch, commit }) {
    return new Promise(async (resolve, reject) => {
      const menus = await this.dispatch('login/getMenu');
      // console.log(JSON.parse(JSON.stringify(menus)));
      const recursionFn = (gObj, parentPath, array) => {
        const brr = array.forEach((itemJ, index) => {
          const pcPath = `${parentPath}/${itemJ.resource_dir_path}`;
          let obj = new Object();
          obj['path'] = '/' + itemJ.resource_dir_path;
          obj['children'] = new Array();
          obj['meta'] = new Object();
          obj.meta['title'] = itemJ.perm_name;
          obj.meta['icon'] = itemJ.resource_icon;
          obj.meta['expansioneMenu'] = [`/${parentPath}`];
          gObj.children[index] = obj;
          if (itemJ.child_perms && itemJ.child_perms.length) {
            obj['component'] = {
              render(c) {
                return c('router-view');
              }
            };
            recursionFn(obj, pcPath, itemJ.child_perms);
          } else {
            obj['component'] = resolve => require([`@/views/${pcPath}/index.vue`], resolve);
            return obj;
          }
        });
        return brr;
      };

      const routers = menus.map(item => {
        let pObj = new Object();
        pObj['path'] = `/${item.resource_dir_path}`;
        pObj['component'] = Layout;
        pObj['children'] = new Array();
        if (item.child_perms && item.child_perms.length) {
          pObj['meta'] = new Object();
          pObj.meta['title'] = item.perm_name;
          pObj.meta['icon'] = item.resource_icon;
          recursionFn(pObj, item.resource_dir_path, item.child_perms);
        } else {
          let cObj = new Object();
          cObj['path'] = '/';
          cObj['component'] = resolve => require([`@/views${item.resource_dir_path}/index.vue`], resolve);
          cObj['meta'] = new Object();
          cObj.meta['title'] = item.perm_name;
          cObj.meta['icon'] = item.resource_icon;
          cObj.meta['expansioneMenu'] = [`/${item.resource_dir_path}`];
          pObj.children[0] = cObj;
        }
        return pObj;
      });
      console.log(JSON.parse(JSON.stringify(routers)));
      commit('SET_DYNANICROUTER', routers);
      resolve(routers);
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
