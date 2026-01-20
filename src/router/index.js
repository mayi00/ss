import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/studentClassHours',
    },
    {
      path: '/studentClassHours',
      name: 'StudentClassHours',
      component: () => import('@/views/studentClassHours/index.vue'),
      meta: { title: '学生课时' },
    },
  ],
  // 每次切换路由的时候滚动到页面顶部
  scrollBehavior() {
    return { left: 0, top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面 title
  if (to.meta.title) {
    document.title = `${to.meta.title} | ss`
  } else {
    document.title = 'ss'
  }

  next()
})

router.afterEach(() => {})

export default router
