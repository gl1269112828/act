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
        await store.dispatch('common/constructRouter').then(async data => {
          data.forEach(item => {
            router.addRoute(item);
          });
          if (to.meta.title !== '首页') {
            await store.dispatch('login/getButtonAuthority', to.query.id);
          }
          next({ ...to }); // hack方法 确保addRoutes已完成
        });
        next();
      } else {
        if (to.meta.title !== '首页' && store.getters.dynamicRouter.length) {
          await store.dispatch('login/getButtonAuthority', to.query.id);
        }
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
