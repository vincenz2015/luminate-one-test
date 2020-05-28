import inject from 'injectinto'

const projects = {
    name: 'project',
    namespaced: true,
    state: {
        projects: [
            // { id: 1, name: 'Budding Fruits', icon: '👪', archived: false },
        ],
        projectsById: {}
    },
    mutations: {
        loaded: (state, projects) => {
            state.projects = projects.map(p => p)
            state.projectsById = {}
            for (let p of state.projects) state.projectsById[p.id] = p
        },
        create: (state, p) => {
            state.projects.push(p)
            state.projectsById[p.id] = p
        },
        update: (state, p) => {
            const project = state.projects.find(project => project.id == p.id)
            Object.assign(project, p)
        },
        delete: (state, id) => {
            const index = state.projects.findIndex(r => r.id == id)
            if (index == -1) return
            state.projects.splice(index, 1)
            delete state.projectsById[id]
        }
    }
}

inject('store', projects)
inject('pod', ({hub, store}) => {
    hub.on('create project', project =>
        window.axios.post('/api/projects', project)
            .then((res) => {
                store.commit('project/create', res.data)
                return hub.emit('created project', res.data)
            })
            .catch(err => {
                return err.response
            }))
    hub.on('update project', project =>
        window.axios.patch('/api/projects', project)
            .then((res) => {
                store.commit('project/update', res.data)
                return hub.emit('updated project', res.data)
            })
            .catch(err => {
                return err.response
            }))
    hub.on('delete project', id =>
        window.axios.delete(`/api/projects/${id}`)
            .then(() => {
                store.commit('project/delete', id)
                return hub.emit('deleted project', id)
            })
            .catch(err => console.error(err)))
    hub.on('load projects', () => {
        window.axios.get('/api/projects')
            .then((res) => {
                store.commit('project/loaded', res.data)
                return hub.emit('loaded project', res.data)
            })
            .catch(err => console.error(err))
    })
})
