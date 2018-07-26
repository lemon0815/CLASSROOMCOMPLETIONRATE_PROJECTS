// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import HeaderAsideLayout from './layouts/HeaderAsideLayout';
import Dashboard from './pages/Dashboard';

import Page4 from './pages/Page4';

import ChangeVK from './pages/ChangeVK';
import TeacherVop from './pages/TeacherVop';
import NotFound from './pages/NotFound';

const routerConfig = [
  {
    path: '/',
    layout: HeaderAsideLayout,
    component: Dashboard,
    children: [
      {
        path: '/dashboard/analysis',
        layout: HeaderAsideLayout,
        component: Dashboard,
      },
      {
        path: '/dashboard/monitor',
        layout: HeaderAsideLayout,
        component: NotFound,
      },
      {
        path: '/dashboard/workplace',
        layout: HeaderAsideLayout,
        component: NotFound,
      },
    ],
  },
  {
    path: '/table',
    layout: HeaderAsideLayout,
    component: NotFound,
    children: [
      {
        path: '/table/basic',
        layout: HeaderAsideLayout,
        component: NotFound,
      },
      {
        path: '/table/fixed',
        layout: HeaderAsideLayout,
        component: NotFound,
      },
    ],
  },
  {
    path: '/app/:appName',
    layout: HeaderAsideLayout,
    component: Page4,
    props: true,
  },
  {
    path: '/VK/change',
    layout: HeaderAsideLayout,
    component: ChangeVK,
  },
  {
    path: '/VOP/teacher',
    layout: HeaderAsideLayout,
    component: TeacherVop,
  },
  {
    path: '*',
    layout: HeaderAsideLayout,
    component: NotFound,
  },
];

export default routerConfig;
