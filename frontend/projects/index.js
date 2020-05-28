import inject from 'injectinto'

// routes
inject('route', {
    path: '/project/create',
    component: () => import('./Create')
})
inject('route', {
    path: '/project/:id',
    component: () => import('./View')
})
inject('route', {
    path: '/project/:id/change',
    component: () => import('./Change')
})

//store
import './ProjectStore'
