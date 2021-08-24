import { login, getRoleMenu, getOperateAuthority } from '@/api/login';
import { resetRouter } from '@/router';

const getDefaultState = () => {
  return {
    menus: []
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus;
  }
};

const actions = {
  login({ commit }, userInfo) {
    const { userName, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ name: userName, password: password })
        .then(response => {
          const { data } = response;
          sessionStorage.setItem('accessToken', data.accessToken);
          sessionStorage.setItem('userInfo', JSON.stringify(data));
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },

  getMenu({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      const roleId = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleId);
      getRoleMenu({ roleId, roleId }).then(response => {
        const forFn = array => {
          array.map(item => {
            item.path = `${item.path}?id=${item.id}&key=${item.key}`;
            return item;
          });
          return array;
        };
        const roleMenus = response.data.map(item => {
          if (item.title !== '首页') {
            if (item.children && item.children.length) {
              forFn(item.children);
            } else {
              item.path = `${item.path}?id=${item.id}&key=${item.key}`;
            }
          }
          return item;
        });
        console.log(JSON.parse(JSON.stringify(roleMenus)));

        commit('SET_MENUS', roleMenus);
        resolve(roleMenus);
      });
    });
  },

  getButtonAuthority({ dispatch, commit }, menuId) {
    return new Promise((resolve, reject) => {
      const roleId = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleId);
      getOperateAuthority({ roleId: roleId, menuId: menuId }).then(response => {
        const { datas } = response.data;
        sessionStorage.setItem('authoritys', JSON.stringify(datas));
        resolve(datas);
      });
    });
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      this.commit('common/SET_DYNANICROUTER', []);
      sessionStorage.clear();
      commit('RESET_STATE');
      resetRouter();
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
