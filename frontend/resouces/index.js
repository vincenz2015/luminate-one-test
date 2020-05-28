import inject from 'injectinto'

// routes
inject('route', {
    path: '/resource/create',
    component: () => import('./Create')
})
inject('route', {
    path: '/resource/:id',
    component: () => import('./View')
})
inject('route', {
    path: '/resource/:id/change',
    component: () => import('./Change')
})

// store
import './ResourceStore'
