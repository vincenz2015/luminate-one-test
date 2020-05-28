import inject from 'injectinto'

const store = {
    name: 'resource',
    namespaced: true,
    state: {
        resources: [
            // { id: 1, name: 'Jate', icon: '🚀' },
        ],
        resourcesById: {}
    },
    mutations: {
        loaded: (state, resources) => {
            state.resources = resources.map(r => r)
            state.resourcesById = {}
            for (let r of state.resources) state.resourcesById[r.id] = r
        },
        create: (state, r) => {
            state.resources.push(r)
            state.resourcesById[r.id] = r
        },
        update: (state, r) => {
            const resource = state.resources.find(r => r.id == r.id)
            Object.assign(resource, r)
        },
        delete: (state, id) => {
            const index = state.resources.findIndex(r => r.id == id)
            if (index == -1) return
            state.resources.splice(index, 1)
            delete state.resourcesById[id]
        }
    }
}

inject('store', store)
inject('pod', ({hub, store}) => {
    hub.on('create resource', resource =>
        window.axios.post('/api/resources', resource)
            .then((res) => {
                store.commit('resource/create', res.data)
                return hub.emit('created resource', res.data)
            })
            .catch(err => {
                return err.response
            }))
    hub.on('update resource', resource =>
        window.axios.patch('/api/resources', resource)
            .then((res) => {
                store.commit('resource/update', res.data)
                return hub.emit('updated resource', res.data)
            })
            .catch(err => {
                return err.response
            }))
    hub.on('delete resource', id =>
        window.axios.delete(`/api/resources/${id}`)
            .then(() => {
                store.commit('resource/delete', id)
                return hub.emit('deleted resource', id)
            })
            .catch(err => console.error(err)))
    hub.on('load resources', () =>
        window.axios.get('/api/resources')
            .then((res) => {
                store.commit('resource/loaded', res.data)
                return hub.emit('loaded resource', res.data)
            })
            .catch(err => console.error(err)))
})
