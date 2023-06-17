import layout from '@/layout'
export default {
  path: '/employee',
  component: layout,
  meta: {
    name: 'employee'
  },
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path: 'detail/:id?', // ?表示id可传可不传
    name: 'employeeDetail',
    component: () => import('@/views/employee/detail'),
    hidden: true
  }
  ]
}
