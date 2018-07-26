// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [];

const asideMenuConfig = [
  // {
  //   name: '应用',
  //   path: '/app',
  //   icon: 'el-icon-menu',
  //   children: [
  //     {
  //       path: '/test',
  //       name: 'test',
  //     },
  //     {
  //       path: '/invoker',
  //       name: 'invoker',
  //     },
  //   ],
  // },
  {
    name: '媒体资源管理',
    path: '/app',
    icon: 'el-icon-menu',
    children: [
      {
        path: '/',
        name: '供应商管理',
      },
      {
        path: '/',
        name: '线路管理',
      },
    ],
  },
  {
    name: '自研灰度管理',
    path: '/VOP',
    icon: 'el-icon-menu',
    children: [
      {
        path: '/teacher',
        name: '老师侧',
      },
      {
        path: '/',
        name: '学生侧',
      },
    ],
  },
  {
    name: '切课策略管理',
    path: '/VK',
    icon: 'el-icon-menu',
    children: [
      {
        path: '/change',
        name: 'VK自助切课',
      },
    ],
  },
];

export { headerMenuConfig, asideMenuConfig };
