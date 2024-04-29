import spacerightVue from '@/components/myspace/spaceright.vue'
import { message } from 'ant-design-vue'
import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      redirect: '/home/myspace',
      component: () => import('@/views/MyHome.vue'),
      children: [{
        path: 'myspace',
        name: 'myspace',
        component: () => import('@/views/myspace.vue'),
        children: [{
          path: 'spaceright',
          name: 'spaceright',
          component: spacerightVue
        }]
      },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login.vue')
    }

  ]
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // to and from are both route objects. must call `next`.
  if (to.path == '/login') next()
  if (token) {
    next()
  } else {
    next({ path: '/login' })
    message.error('token已过期请重新登陆')
  }
})
export default router
