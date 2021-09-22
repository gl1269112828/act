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
      console.log(JSON.parse(JSON.stringify(menus)));
      // {
      //   path: '/configManage',
      //   component: Layout,
      //   children: [
      //     {
      //       path: '/automatedConfiguration',
      //       name: 'automatedConfiguration',
      //       component: () => import('@/views/configManage/automatedConfiguration/index'),
      //       meta: { title: '配置页面' }
      //     }
      //   ]
      // },

      // const getRouters = (array, parentObj, parentPath) => {
      //   let defaultRouters = [];
      //   let dynamicConfigurations = [{ path: '/configPage', component: Layout, children: [] }];
      //   for (let i = 0; i < array.length; i++) {
      //     let item = array[i];
      //     let purePath;
      //     let currentPath;
      //     if (item.path.indexOf('?') > -1) {
      //       purePath = item.path.substring(0, item.path.indexOf('?'));
      //     } else {
      //       purePath = item.path;
      //     }
      //     if (parentPath) {
      //       currentPath = `${parentPath}${purePath}`;
      //     } else {
      //       currentPath = item.path;
      //     }

      //     console.log(purePath);
      //     console.log(currentPath);

      //     let currentObj = {
      //       path: purePath,
      //       meta: {
      //         title: item.title,
      //         icon: item.icon,
      //         key: item.key,
      //         id: item.id
      //       },
      //       children: []
      //     };
      //     if (!!item.key) {
      //       if (parentObj) {
      //         currentObj['component'] = resolve => require([`@/views${currentPath}/index.vue`], resolve);
      //         parentObj.children.push(currentObj);
      //       } else {
      //         currentObj['component'] = resolve => require(['@/components/configPage/pages/index.vue'], resolve);
      //         dynamicConfigurations[0].children.push(currentObj);
      //       }
      //     } else {
      //       currentObj['component'] = Layout;
      //       defaultRouters.push(currentObj);
      //     }
      //     if (item.children && item.children.length) {
      //       getRouters(item.children, currentObj, purePath);
      //     }
      //   }
      //   return [...defaultRouters, ...dynamicConfigurations];
      // };

      // const a = getRouters(menus);
      // commit('SET_DYNANICROUTER', a);
      // resolve(a);
      // console.log(JSON.parse(JSON.stringify(a)));

      let arr = new Array();
      let brr = [{ path: '/configPage', component: Layout, children: [] }];
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
      brr.push({ path: '*', redirect: '/404' });

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
