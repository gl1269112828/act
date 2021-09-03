import router from './router';
import store from './store';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false });

const whiteList = ['/']; //白名单列表

const isToken = sessionStorage.getItem('accessToken');

router.beforeEach(async (to, from, next) => {
  NProgress.start();

  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    if (isToken) {
      console.log(store.getters.dynamicRouter.length);
      if (!store.getters.dynamicRouter.length) {
        const routers = await store.dispatch('common/constructRouter');
        router.addRoutes([...routers]);
        if (to.meta.title !== '首页') {
          await store.dispatch('login/getButtonAuthority', to.query.id);
        }
        next({ ...to, replace: true });
        next();
      } else {
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
