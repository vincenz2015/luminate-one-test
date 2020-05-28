import inject from 'injectinto'
import pathie from 'pathie'

const availability = {
    name: 'availability',
    namespaced: true,
    state: {
        availability: [
            // { resource_id: 1, day_index: 264, project_id: null, note: null},
        ],
        availabilityByResource: {},
        availabilityByProject: {}
    },
    mutations: {
        loaded: (state, availability) => {
            state.availability = availability.map(a => a)
            state.availabilityByResource = {}
            state.availabilityByProject = {}
            for (let a of state.availability) {
                const resource_path = [a.day_index, a.resource_id]
                // dedupe bad data TODO: remove when data is better
                if (pathie.get(state.availabilityByResource, resource_path)) continue
                pathie.set(state.availabilityByResource, resource_path, a)
                if (a.project_id == null) continue
                const project_path = [a.day_index, a.project_id]
                pathie.getorset(state.availabilityByProject, project_path, []).push(a)
            }
        },
        updateavailability: (state, changes) => {
            for (let change of changes) {
                const { resource_id, day_index, status } = change
                const availabilityindex = state.availability.findIndex(a => a.resource_id == resource_id && a.day_index == day_index)
                if (change.status == 'unavailable') {
                    if (availabilityindex != -1) {
                        const a = state.availability[availabilityindex]
                        pathie.visit(state.availabilityByProject, [day_index, a.project_id], (object, key) => {
                            if (!object[key]) return
                            const projectindex = object[key].findIndex(a => a.resource_id == resource_id)
                            object[key].splice(projectindex, 1)
                        })
                        a.project_id = null
                    }
                    else {
                        const a = {resource_id, day_index, project_id: null, note: null}
                        state.availability.push(a)
                        pathie.set(state.availabilityByResource, [day_index, resource_id], a)
                    }
                }
                else if (availabilityindex != -1) {
                    const a = state.availability[availabilityindex]
                    const { project_id } = a
                    state.availability.splice(availabilityindex, 1)
                    pathie.del(state.availabilityByResource, [day_index, resource_id])
                    pathie.visit(state.availabilityByProject, [day_index, project_id], (object, key) => {
                        if (!object[key]) return
                        const projectindex = object[key].findIndex(a => a.resource_id == resource_id)
                        object[key].splice(projectindex, 1)
                    })
                }
            }
        },
        scheduleproject: (state, p) => {
            for (let change of p.changes) {
                const { resource_id, day_index, status } = change
                const availabilityindex = state.availability.findIndex(a => a.resource_id == resource_id && a.day_index == day_index)
                if (status == 'assign') {
                    if (availabilityindex != -1) {
                        const a = state.availability[availabilityindex]
                        const project_path = [day_index, a.project_id]
                        pathie.visit(state.availabilityByProject, project_path, (object, key) => {
                            if (!object[key]) return
                            const projectindex = object[key].findIndex(a => a.resource_id == resource_id)
                            object[key].splice(projectindex, 1)
                        })
                        a.project_id = p.project_id
                        pathie.getorset(state.availabilityByProject, project_path, []).push(a)
                    }
                    else {
                        const a = { resource_id, day_index, project_id: p.project_id, note: null }
                        state.availability.push(a)
                        pathie.set(state.availabilityByResource, [day_index, resource_id], a)
                        pathie.getorset(state.availabilityByProject, [day_index, a.project_id], []).push(a)
                    }
                }
                else if (availabilityindex != -1) {
                    const a = state.availability[availabilityindex]
                    const { project_id } = a
                    state.availability.splice(availabilityindex, 1)
                    pathie.del(state.availabilityByResource, [day_index, resource_id])
                    pathie.visit(state.availabilityByProject, [day_index, project_id], (object, key) => {
                        if (!object[key]) return
                        const projectindex = object[key].findIndex(a => a.resource_id == resource_id)
                        object[key].splice(projectindex, 1)
                    })
                }
            }
        },
        set: (state, updates) => {
            // can only update project_id or note
            // e.g. day_index and resource_id are indicies
            // if it doesn't exist create it
            for (let action of updates) {
                const {resource_id, day_index, project_id, note} = action
                const availabilityindex = state.availability.findIndex(a => a.resource_id == resource_id && a.day_index == day_index)
                let a = null
                if (availabilityindex != -1) {
                    a = state.availability[availabilityindex]
                    const project_availability = pathie.getorset(state.availabilityByProject, [a.day_index, a.project_id], [])
                    const projectindex = project_availability.findIndex(a => a.resource_id == resource_id)
                    project_availability.splice(projectindex, 1)
                    a.project_id = project_id
                    a.note = note
                }
                else {
                    a = {resource_id, day_index, project_id, note}
                    state.availability.push(a)
                    pathie.set(state.availabilityByResource, [day_index, resource_id], a)
                }
                // for both update and delete we re-add it to the project lookup as this is the only lookup that can change
                pathie.getorset(state.availabilityByProject, [a.day_index, a.project_id], []).push(a)
            }
        },
        clear: (state, updates) => {
            for (let action of updates) {
                const {resource_id, project_id, day_index} = action
                const availabilityindex = state.availability.findIndex(a => a.resource_id == resource_id && a.day_index == day_index)
                if (availabilityindex == -1) continue
                const a = state.availability[availabilityindex]
                state.availability.splice(availabilityindex, 1)
                pathie.del(state.availabilityByResource, [day_index, resource_id])
                pathie.visit(state.availabilityByProject, [day_index, project_id], (object, key) => {
                    if (!object[key]) return
                    const projectindex = object[key].findIndex(a => a.resource_id == resource_id)
                    object[key].splice(projectindex, 1)
                })
            }
        }
    }
}

inject('store', availability)
inject('pod', ({hub, store}) => {
    hub.on('update availability', (changes) =>
        window.axios.patch('/api/availability', changes)
            .then((res) => {
                store.commit('availability/updateavailability', changes)
                return hub.emit('updated availability', changes)
            })
            .catch(err => console.error(err)))
    hub.on('schedule project', (p) =>
        window.axios.patch('/api/availability/projects', p)
            .then((res) => {
                store.commit('availability/scheduleproject', p)
                return hub.emit('project scheduled', p)
            })
            .catch(err => console.error(err)))
    hub.on('load availability', () =>
        window.axios.get('/api/availability')
          .then((response) =>
              store.commit('availability/loaded', response.data))
          .catch(err => console.error(err)))
})
