import inject from 'injectinto'

//routes
inject('route', {
    path: '/',
    component: () => import('./ResourceOverview')
})
inject('route', {
    path: '/resources',
    component: () => import('./ResourceOverview')
})
inject('route', {
    path: '/projects',
    component: () => import('./ProjectOverview')
})
inject('route', {
    path: '/project/:id/schedule',
    component: () => import('./ProjectSchedule')
})
inject('route', {
    path: '/availability',
    component: () => import('./AvailabilityEditor')
})

//stores
import './AvailabilityStore'
import './TimeFilterStore'