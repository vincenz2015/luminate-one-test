import inject from 'injectinto'

// routes
inject('route', {
    path: '/autoschedule/create',
    component: () => import('./Create')
})
inject('route', {
    path: '/autoschedule/created',
    component: () => import('./Created')
})

// store
import './ResourceStore'
