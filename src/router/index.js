import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)

import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/register', component: _import('register/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: '/',
      component: () => import('@/views/dashboard/editor/index')
    }]
  },
  {
    path: '/personalCenter',
    component: Layout,
    redirect: '/personalCenter',
    name: 'PersonalCenter',
    hidden: true,
    meta: { title: '个人中心', icon: 'table' },
    children: [{
      path: '/personalCenter',
      component: () => import('@/views/personal-center/index')
    }]
  },
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Table', icon: 'table' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'complexTable' }
  //     },
  //     {
  //       path: 'fullcalendar',
  //       name: 'Fullcalendar',
  //       component: () => import('@/views/fullcalendar/fullcalendar'),
  //       meta: { title: 'calendar' }
  //     }
  //   ]
  // },
  {
    path: '/video',
    component: Layout,
    redirect: '',
    name: 'Video',
    meta: { title: '视频管理', icon: 'table' },
    children: [
      {
        path: '',
        name: 'Table',
        component: () => import('@/views/table/videoTable'),
        meta: { title: '视频审核' }
      }
    ]
  },
  {
    path: '/comment',
    component: Layout,
    redirect: '',
    name: 'Label',
    meta: { title: '评论管理', icon: 'table' },
    children: [
      {
        path: '',
        name: 'Table',
        component: () => import('@/views/table/commentTable'),
        meta: { title: '评论管理' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '',
    name: 'User',
    meta: { title: '用户管理', icon: 'table' },
    children: [
      {
        path: '',
        name: 'Table',
        component: () => import('@/views/table/userTable'),
        meta: { title: '用户信息审核' }
      }
    ]
  },
  {
    path: '/managerUser',
    component: Layout,
    redirect: '',
    name: 'ManagerUser',
    meta: { title: '管理员管理', icon: 'table' },
    children: [
      {
        path: '/managerRegister/table',
        name: 'Table',
        component: () => import('@/views/table/registerTable'),
        meta: { title: '管理员注册审核' }
      },
      {
        path: '/managerUser/table',
        name: 'Table',
        component: () => import('@/views/table/managerTable'),
        meta: { title: '管理员管理' }
      }
    ]
  },
  {
    path: '/role',
    component: Layout,
    redirect: '',
    name: 'Role',
    meta: { title: '角色管理', icon: 'table' },
    children: [
      {
        path: '/managerRole/table',
        name: 'Table',
        component: () => import('@/views/table/managerRoleTable'),
        meta: { title: '管理员权限管理' }
      },
      {
        path: '/role/table',
        name: 'Table',
        component: () => import('@/views/table/roleTable'),
        meta: { title: '角色管理' }
      }
    ]
  },
  {
    path: '/partition',
    component: Layout,
    redirect: '',
    name: 'Partition',
    meta: { title: '分区管理', icon: 'table' },
    children: [
      {
        path: '',
        name: 'Table',
        component: () => import('@/views/table/partitionTable'),
        meta: { title: '分区管理' }
      }
    ]
  },
  {
    path: '/label',
    component: Layout,
    redirect: '',
    name: 'Label',
    meta: { title: '标签管理', icon: 'table' },
    children: [
      {
        path: '',
        name: 'Table',
        component: () => import('@/views/table/labelTable'),
        meta: { title: '标签管理' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '',
    name: 'Label',
    meta: { title: '公告管理', icon: 'table' },
    children: [
      {
        path: '',
        name: 'Table',
        component: () => import('@/views/table/noticeTable'),
        meta: { title: '公告管理' }
      }
    ]
  },
  {
    path: '/recover',
    component: Layout,
    redirect: '',
    name: 'Recover',
    meta: { title: '视频回收站', icon: 'table' },
    children: [
      {
        path: '',
        name: 'Table',
        component: () => import('@/views/table/recoverTable'),
        meta: { title: '视频回收站' }
      }
    ]
  },
  {
    path: '/passLog',
    component: Layout,
    redirect: '',
    name: 'PassLog',
    meta: { title: '审核记录', icon: 'table' },
    children: [
      {
        path: '/videoPassLog/table',
        name: 'Table',
        component: () => import('@/views/table/passLogTable'),
        meta: { title: '视频审核记录' }
      },
      {
        path: '/managerPassLog/table',
        name: 'Table',
        component: () => import('@/views/table/managerPassLogTable'),
        meta: { title: '管理员审核记录' }
      }
    ]
  },
  // {
  //   path: '/tab',
  //   name: 'tab',
  //   component: Layout,
  //   meta: { icon: 'example' },
  //   children: [
  //     {
  //       path: 'Tabs',
  //       name: 'Tabs',
  //       component: () => import('@/views/tab/index'),
  //       meta: { title: 'Tabs', icon: 'tab' }
  //     }
  //   ]
  // },
  // 表单
  {
    path: '/form',
    component: Layout,
    redirect: '/table/BaseForm',
    name: 'form',
    meta: {
      title: 'form',
      icon: 'form'
    },
    children: [
      {
        path: 'Form',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'BaseForm' }
      },
      {
        path: 'qiniu',
        name: 'qiniu',
        component: () => import('@/views/form/qiniu'),
        meta: { title: 'qiniu' }
      },
      {
        path: 'quillEditor',
        name: 'quillEditor',
        component: () => import('@/views/form/quillEditor'),
        meta: { title: 'quillEditor' }
      },
      {
        path: 'tinymce',
        name: 'tinymce',
        component: () => import('@/views/form/tinymce'),
        meta: { title: 'tinymce' }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/icon',
    component: Layout,
    name: 'icons',
    meta: { roles: ['admin'] },
    children: [
      {
        path: 'iconIndex',
        name: 'iconIndex',
        component: () => import('@/views/svg-icon/index'),
        meta: { title: 'svgicons', icon: 'icon', roles: ['admin'] }
      }
    ]
  },
  // 树形组件
  {
    path: '/treeMen',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: 'treeMen',
      icon: 'TreeMean'
    },
    children: [
      {
        path: 'treeMen',
        name: 'treeMen-demo',
        component: () => import('@/views/tree/index'),
        meta: { title: 'treeMen', icon: 'TreeMean' }
      }
    ]
  },
  // 组件
  {
    path: '/components',
    component: Layout,
    redirect: '/components/dragKanban',
    name: 'Components',
    meta: {
      title: 'Components',
      icon: 'component'
    },
    children: [
      {
        path: 'componentsmixin',
        name: 'mixin',
        component: () => import('@/views/components/backToTop'),
        meta: { title: 'backToTop' }
      },
      {
        path: 'mixin',
        name: 'componentMixin',
        component: () => import('@/views/components/mixin'),
        meta: { title: 'componentMixin' }
      }
    ]
  },
  {
    path: '/excel',
    component: Layout,
    redirect: '/excel/exportExcel',
    name: 'excel',
    meta: {
      title: 'excel',
      icon: 'excel'
    },
    children: [
      {
        path: 'exportExcel',
        name: 'exportExcel',
        component: () => import('@/views/excel/exportExcel'),
        meta: { title: 'exportExcel', icon: 'excel' }
      }
    ]
  },
  {
    path: '/i18n-demo',
    component: Layout,
    redirect: 'i18n-demo',
    children: [
      {
        path: 'indexLang',
        name: 'indexLang',
        component: () => import('@/views/i18n-demo/indexLang'),
        meta: { title: 'i18n', icon: 'international' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
