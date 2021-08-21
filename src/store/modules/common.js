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
      let arr = new Array();
      let brr = [{ path: '/configPage', component: Layout, children: [] }];
      let index = 0;
      const recursionFn = (gObj, parentPath, array) => {
        let crr = new Array();
        for (let j = 0; j < array.length; j++) {
          const itemJ = array[j];
          const pcPath = `${parentPath}${itemJ.path}`;
          let cObj = new Object();
          cObj['children'] = new Array();
          cObj['path'] = itemJ.path;
          cObj['meta'] = new Object();
          cObj.meta['title'] = itemJ.title;
          cObj.meta['icon'] = itemJ.icon;
          cObj.meta['id'] = itemJ.id;
          if (itemJ.children && itemJ.children.length) {
            recursionFn(cObj, pcPath, itemJ.children);
          } else {
            if (!!itemJ.key) {
              cObj.meta['key'] = itemJ.key;
              cObj.meta['expansioneMenu'] = [`/configPage`];
              cObj['component'] = resolve => require(['@/components/configPage/pageChild/index.vue'], resolve);
              brr[0].children[index] = cObj;
              index++;
            } else {
              cObj.meta['key'] = null;
              cObj['component'] = resolve => require([`@/views${pcPath}/index.vue`], resolve);
              crr.push(cObj);
            }
          }
        }
        return crr;
      };

      for (let i = 0; i < menus.length; i++) {
        const item = menus[i];
        if (item.path !== '/home') {
          let pObj = new Object();
          pObj['path'] = item.path;
          pObj['component'] = Layout;
          pObj['children'] = new Array();
          pObj['meta'] = new Object();
          pObj.meta['title'] = item.title;
          pObj.meta['icon'] = item.icon;
          pObj.children = recursionFn(pObj, item.path, item.children);
          arr.push(pObj);
        }
      }
      console.log(JSON.parse(JSON.stringify([...arr, ...brr])));
      commit('SET_DYNANICROUTER', [...arr, ...brr]);
      resolve([...arr, ...brr]);
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
