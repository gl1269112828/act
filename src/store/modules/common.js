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
  constructRouter({ dispatch, commit }) {
    return new Promise(async (resolve, reject) => {
      let roleMenus = await dispatch('login/getMenu', null, { root: true });
      const dynamicRouter = roleMenus.map(item => {
        let pObj = new Object();
        pObj['path'] = item.path;
        pObj['component'] = Layout;
        pObj['children'] = new Array();
        if (item.children.length) {
          pObj['meta'] = new Object();
          pObj.meta['title'] = item.title;
          pObj.meta['id'] = item.id;
          pObj.meta['icon'] = item.icon;
          item.children.forEach((itemJ, index) => {
            let cObj = new Object();
            cObj['path'] = itemJ.path;
            cObj['component'] = resolve => require([`@/views/${item.resource_dir_path}/index.vue`], resolve);
            cObj['meta'] = new Object();
            cObj.meta['title'] = itemJ.title;
            cObj.meta['id'] = itemJ.id;
            cObj.meta['icon'] = itemJ.icon;
            pObj.children[index] = cObj;
          });
        } else {
          let cObj = new Object();
          cObj['path'] = '/';
          cObj['component'] = resolve => require([`@/views${item.path}/index.vue`], resolve);
          cObj['meta'] = new Object();
          cObj.meta['title'] = item.title;
          cObj.meta['id'] = item.id;
          cObj.meta['icon'] = item.icon;
          pObj.children[0] = cObj;
        }
        return pObj;
      });
      commit('SET_DYNANICROUTER', dynamicRouter);
      resolve(dynamicRouter);

      //   {
      //     path: '/home',
      //     component: Layout,
      //     children: [
      //       {
      //         path: '/',
      //         name: 'home',
      //         component: () => import('@/views/home/index'),
      //         meta: { title: '首页' }
      //       }
      //     ]
      //   },
      //   store.commit('login/SET_ROLE_MENUES', roleMenus);
      // const roleId = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleId);
      // getRoleMenu({ roleId, roleId }).then(response => {
      //   const roleMenus = response.data;
      //   resolve(roleMenus);
      // });
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
