import component from '../../plumbing/component'
import pathie from 'pathie'

export default component({
    name: 'ProjectOverviewCell',
    render: (h, {state, props, hub, route}) => {
        const project = state.project.projects[props.item_index]
        if (!project) return [null]
        const { availabilityByProject } = state.availability
        const count = pathie.visit(availabilityByProject, [
            props.day_index,
            project.id
        ], (object, key) => object[key] ? object[key].length : 0)

        return [
            count > 0
            ? h('text.day', { attrs: { x: props.icon_x, y: props.icon_y } }, count.toString())
            : null
        ]
    }
})

