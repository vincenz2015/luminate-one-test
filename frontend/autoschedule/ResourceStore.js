import inject from 'injectinto'

const store = {
    name: 'autoschedule',
    namespaced: true,
    state: {
        resources: [
        ],
        resourcesById: {}
        ,
        totals: {}
    },
    mutations: {
        create: (state, r) => {
            state.resources.push(r)
            state.resourcesById[r.id] = r
            state.totals = r.totals
        }
    }
}

inject('store', store)
inject('pod', ({hub, store}) => {
    hub.on('create autoschedule', resource =>
        window.axios.post('/api/schedules', resource)
            .then((res) => {
                store.commit('autoschedule/create', res.data)
                return hub.emit('created schedule', res.data)
            })
            .catch(err => {
                return err.response
            }))
})
