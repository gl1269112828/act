import { login, getRoleMenu, getOperateAuthority } from '@/api/login';
import { resetRouter } from '@/router';

const getDefaultState = () => {
  return {};
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: state => {
    Object.assign(state, getDefaultState());
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
        const roleMenus = response.data;
        resolve(roleMenus);
      });
    });
  },

  buttonAuthority({ dispatch, commit }, menuId) {
    return new Promise((resolve, reject) => {
      const roleId = parseInt(JSON.parse(sessionStorage.getItem('userInfo')).roleId);
      getOperateAuthority({ roleId: roleId, menuId: menuId }).then(response => {
        const { datas } = response.data;
        resolve(datas);
      });
    });
  },

  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
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
