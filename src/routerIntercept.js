import router from './router';
import store from './store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false });

const whiteList = ['/']; //白名单列表

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  const isToken = sessionStorage.getItem('accessToken');

  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    if (isToken) {
      let menus = await store.dispatch('common/constructRouter');
      console.log(JSON.parse(JSON.stringify(menus)));

      router.addRoute(menus); // 动态添加可访问路由表
    //   next({ ...to, replace: true })
      console.log(router);
      //   next({ ...to, replace: true }); // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
      // if (!store.getters.roleMenus.length) {
      //     let roleMenus = await store.dispatch("login/getMenu");
      //     store.commit("login/SET_ROLE_MENUES", roleMenus);
      // }

      // if (to.meta.title !== "首页") {
      //     let authoritys = await store.dispatch("login/buttonAuthority", Number(to.query.id))
      //     sessionStorage.setItem("authoritys", JSON.stringify(authoritys));
      // }
    } else {
      next('/');
    }

    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});
