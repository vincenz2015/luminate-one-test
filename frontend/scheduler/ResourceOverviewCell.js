import component from '../../plumbing/component'
import pathie from 'pathie'

export default component({
    name: 'ResourceOverviewCell',
    render: (h, {state, props, hub, route}) => {
        const noteOverlayPoints = (x, y, gap, cellSize) => `${gap + x * cellSize},${2 + gap + y * cellSize} ${2 + gap + x * cellSize},${gap + y * cellSize} ${10 + gap + x * cellSize},${gap + y * cellSize} ${gap + x * cellSize},${10 + gap + y * cellSize}`

        const resource = state.resource.resources[props.item_index]
        const { availabilityByResource } = state.availability
        const a = resource
            ? pathie.get(availabilityByResource, [
                props.day_index,
                resource.id])
            : null

        // special case is unavailable
        if (a && a.project_id == null) return [
            a.note
                ? h('polygon.note', { attrs: {
                    points: noteOverlayPoints(props.x, props.y, props.gap, props.cellSize)
                }})
                : null
        ]

        return [
            a
                ? h('text.day', {
                    attrs: { x: props.icon_x, y: props.icon_y }
                }, state.project.projectsById[a.project_id].icon)
                : null,
            (a && a.note)
                ? h('polygon.note', { attrs: {
                    points: noteOverlayPoints(props.x, props.y, props.gap, props.cellSize)
                }})
                : null,
            h('rect.day', {
                class: {
                    note: (a && a.note != null)
                }, attrs: {
                    x: props.day_x,
                    y: props.day_y,
                    rx: 3,
                    ry: 3,
                    width: props.cellSize - 2 * props.gap,
                    height: props.cellSize - 2 * props.gap
                }
            }, [
                (a && a.note) ? h('title', a.note) : null
            ])
        ]
    }
})

