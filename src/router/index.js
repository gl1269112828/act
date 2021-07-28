import Vue from 'vue'
import VueRouter from 'vue-router'


import layout from '@/layout/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('@/views/login/index'),
    isMenu: true,
  },
  {
    path: "/home",
    component: layout,
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index"),
        meta: { title: '首页' },
      }
    ],
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
