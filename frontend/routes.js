import inject from 'injectinto'

inject('route', {
    path: '/notfound',
    component: () => import('./RouteNotFound')
})

inject('route', {
    path: '/*',
    redirect: '/notfound'
})

// inject('route', {
//     path: '/user/:id',
//     props: (route) => ({ userid: route.query.id }),
//     component: () => import(
//         /* webpackChunkName: "group-foo" */
//         './schedule')
// })
