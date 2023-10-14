export default [
  { path: '/login', layout: false, component: './Login' },
  { path: '/profile', component: './Profile', wrappers: ['@/components/Auth'] },

  {
    path: '/userManage',
    icon: 'team',
    name: '用户管理',
    component: './User',
    wrappers: ['@/components/Auth'],
  },
  {
    path: '/orderManage',
    icon: 'tool',
    name: '维修单管理',
    component: './Order',
    wrappers: ['@/components/Auth'],
  },
  {
    path: '/addressManage',
    icon: 'environment',
    name: '建筑管理',
    component: './Address',
    wrappers: ['@/components/Auth'],
  },
  {
    path: '/noticeManage',
    icon: 'notification',
    name: '公告管理',
    component: './Notice',
    wrappers: ['@/components/Auth'],
  },
  {
    path: '/feedbackManage',
    icon: 'mail',
    name: '反馈管理',
    component: './Feedback',
    wrappers: ['@/components/Auth'],
  },

  { path: '/', redirect: '/userManage' },
  { path: '*', layout: false, component: './404' },
];
