import component from '../plumbing/component'

export default component({
    query: ({state, route, hub}) =>
        hub.emit('load resources'),
    render: (h, {state, props, hub, route}) => {
        return h('#root', ['404'])
    }
})
