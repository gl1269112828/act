import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
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
      if (!store.getters.dynamicRouter.length) {
        const routers = await store.dispatch('common/constructRouter');
        // await store.dispatch('login/getButtonAuthority', to.query.id);
        routers.forEach(item => {
          router.addRoute(item);
        });
        router.addRoute({ path: '*', redirect: '/404', hidden: true });
        next({ ...to }); // hack方法 确保addRoutes已完成
        next();
      } else {
        // await store.dispatch('login/getButtonAuthority', to.query.id);
        next();
      }
    } else {
      next('/');
    }
    NProgress.done();
  }
});

router.afterEach(() => {
  NProgress.done();
});
