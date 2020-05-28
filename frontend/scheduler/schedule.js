import component from '../../plumbing/component'
import spacetime from 'spacetime'
import range from '../util/range'
import 'array-flat-polyfill'

const timezone = 'Pacific/Auckland'

// gap around each cell
const gap = 3
// width and height of each cell
const cellSize = 27
// days are stored as an index offset from 2019-01-01
// e.g. 0 is 2019-01-01
const dayOffsetEpoch = spacetime('2019-01-01', timezone)

export default component({
    name: "Schedule",
    render: (h, {state, props, hub, route, scopedSlots}) => {
        const isdown = props.isdown !== null ? props.isdown : true
        const daysCount = props.limit

        const current = props.currenttime
        const visibleOffset = dayOffsetEpoch.diff(current, 'days')
        // given pixel coordinates map to item day coordinates
        const calculateGrid = (offsetX, offsetY) => ({
            day_offset:
                Math.min(daysCount - 1,
                    Math.max(0,
                        Math.floor(offsetX / cellSize))),
            item_index:
                Math.min(props.itemcount - 1,
                    Math.max(0,
                        Math.floor((offsetY) / cellSize)))
        })

        const calculateParams = (e) => {
            const { day_offset, item_index } = calculateGrid(e.offsetX, e.offsetY)
            const day_index = day_offset + visibleOffset
            const day_indicies = props.item_index == item_index
                && props.day_index != day_index
                ? range(props.day_index, day_index)
                : [day_index]
            return {
                day_offset,
                day_index,
                item_index,
                day_indicies
            }
        }

        return h('svg.schedule', {
            class: {
                editable: props.editable
            },
            attrs: {
                width: `${daysCount * cellSize}`,
                height: `${props.itemcount * cellSize}`
            },
            on: props.editable
            ? {
                mousedown: (e) => {
                    if (e.target !== e.currentTarget) return
                    if (e.button != 0) return
                    const params = calculateParams(e)
                    if (params.item_index == null) return
                    hub.emit('mousedown', params)
                },
                mousemove: (e) => {
                    if (e.target !== e.currentTarget) return
                    if (!isdown) return
                    const params = calculateParams(e)
                    if (e.buttons == 0)
                        hub.emit('mouseup', params)
                    else
                        hub.emit('mousemove', params)
                },
                mouseup: (e) => {
                    if (e.target !== e.currentTarget) return
                    const params = calculateParams(e)
                    hub.emit('mouseup', params)
                },
                mouseleave: (e) => {
                    if (e.target !== e.currentTarget) return
                    if (!isdown) return
                    const params = calculateParams(e)
                    hub.emit('mousemove', params)
                }
            }
            : null
        }, [

            //Something in the params here is causing the issue
            ...range(0, props.itemcount - 1).map((y) => range(0, daysCount - 1).map((x) => {
                const params = {
                    ...props,
                    x, y, gap, cellSize,
                    icon_x: 10.5 + gap + x * cellSize,
                    icon_y: 17.5 + gap + y * cellSize,
                    day_x: gap + x * cellSize,
                    day_y: gap + y * cellSize,
                    day_offset: x,
                    day_index: x + visibleOffset,
                    item_index: y
                }
                return [
                    scopedSlots.default(params)
                ]
            })).flat()
        ])
    }
})
