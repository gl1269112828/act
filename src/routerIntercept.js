import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false });

const whiteList = ['/']; //白名单列表

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const isToken = sessionStorage.getItem('user_token');
  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    // console.log(isToken);

    if (isToken) {
      // console.log(store.getters.routers.length);
      // console.log(to.path);
      // console.log(from.path);
      // const routers = await store.dispatch('common/constructRouter');
      // console.log(123)
      next();
      // routers.forEach(item => {
      //   router.addRoute(item);
      // });
      // router.addRouter({ path: '*', redirect: '/404', hidden: true });

      // const routers = await store.dispatch('common/constructRouter');
      // routers.forEach(item => {
      //   router.addRoute(item);
      // });
      // next();
      // if (to.path === '/home') {
      //   console.log(123);
      //   const routers = await store.dispatch('common/constructRouter');
      //   console.log(router);
      //   // router.addRouter({ path: '*', redirect: '/404', hidden: true });
      //   // next({ ...to }); // hack方法 确保addRoutes已完成
      //   next();
      // } else {
      //   console.log(456);
      //   next();
      // }

      // if (!store.getters.dynamicRouter.length) {
      //   // console.log(123);
      //   const routers = await store.dispatch('common/constructRouter');
      //   routers.forEach(item => {
      //     router.addRoute(item);
      //   });
      //   router.addRoute({ path: '*', redirect: '/404', hidden: true });
      //   next({ ...to }); // hack方法 确保addRoutes已完成
      // } else {
      //   // console.log(456);
      //   next();
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
