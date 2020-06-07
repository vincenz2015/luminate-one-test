import inject from 'injectinto'

// routes
inject('route', {
    path: '/autoschedule/create',
    component: () => import('./Create')
})

// store
import './ResourceStore'
