import Layout from '@/layout/index';

const getDefaultState = () => {
  return {
    dynamicRouter: []
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
      let arr = new Array();
      let brr = [{ path: '/configPage', component: Layout, children: [] }];
      const crr = [{ path: '*', redirect: '/404' }];
      let index = 0;
      const recursionFn = (gObj, parentPath, array) => {
        let drr = new Array();
        for (let j = 0; j < array.length; j++) {
          const itemJ = array[j];
          const purePath = itemJ.path.substring(0, itemJ.path.indexOf('?'));
          const pcPath = `${parentPath}${purePath}`;
          let cObj = new Object();
          cObj['path'] = '';
          cObj['meta'] = new Object();
          cObj.meta['title'] = itemJ.title;
          cObj.meta['icon'] = itemJ.icon;
          cObj['children'] = new Array();
          if (itemJ.children && itemJ.children.length) {
            recursionFn(cObj, pcPath, itemJ.children);
          } else {
            if (!!itemJ.key) {
              cObj.meta['key'] = itemJ.key || '';
              cObj.meta['id'] = itemJ.id || '';
              cObj.path = purePath;
              cObj['component'] = resolve => require(['@/components/configPage/pages/index.vue'], resolve);
              brr[0].children[index] = cObj;
              index++;
            } else {
              cObj.path = purePath;
              // cObj.meta['key'] = "";
              cObj['component'] = resolve => require([`@/views${pcPath}/index.vue`], resolve);
              drr.push(cObj);
            }
          }
        }
        return drr;
      };

      for (let i = 0; i < menus.length; i++) {
        const item = menus[i];
        if (item.path !== '/home') {
          let pObj = new Object();
          const purePath = item.path.indexOf('?') > -1 ? item.path.substring(0, item.path.indexOf('?')) : item.path;
          pObj['path'] = purePath;
          pObj['meta'] = new Object();
          pObj.meta['title'] = item.title;
          pObj.meta['icon'] = item.icon;
          pObj['children'] = new Array();
          if (!!item.key) {
            pObj.meta['key'] = item.key || '';
            pObj.meta['id'] = item.id || '';
            pObj['component'] = resolve => require(['@/components/configPage/pages/index.vue'], resolve);
            brr[0].children[index] = pObj;
            index++;
          } else {
            pObj['component'] = Layout;
            pObj.children = recursionFn(pObj, item.path, item.children);
          }
          if (item.children && item.children.length) {
            arr.push(pObj);
          }
        }
      }
      // console.log(JSON.parse(JSON.stringify([...arr, ...brr, ...crr])));
      commit('SET_DYNANICROUTER', [...arr, ...brr, ...crr]);
      resolve([...arr, ...brr, ...crr]);
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
