import component from '../../plumbing/component'
import spacetime from 'spacetime'
import range from '../util/range'
import 'array-flat-polyfill'

const timezone = 'Pacific/Auckland'
// Convert day of week to first letter
const abbr = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
// how many days to display at once
const daysCount = 7*13

// gap around each cell
const gap = 3
// space above cells for month, day of month and day of week
const actionsOffset = 73
// width and height of each cell
const cellSize = 27
// days are stored as an index offset from 2019-01-01
// e.g. 0 is 2019-01-01
const dayOffsetEpoch = spacetime('2019-01-01', timezone)

export default component({
    name: "Timeline",
    render: (h, {state, props, hub, route}) => {
        const isdown = props.isdown !== null ? props.isdown : true

        const current = props.currenttime
        const visibleOffset = dayOffsetEpoch.diff(current, 'days')
        const days = current.subtract(1, 'day')
            .every('day', current.add(props.limit, 'days'))
        const calculateOffset = (offsetX) =>
            Math.min(daysCount - 1,
                Math.max(0,
                    Math.floor(offsetX / cellSize)))

        const calculateParams = (e) => {
            const day_offset = calculateOffset(e.offsetX)
            const day_index = day_offset + visibleOffset
            const day_indicies = props.day_index != day_index
                ? range(props.day_index, day_index)
                : [day_index]
            return {
                day_offset,
                day_index,
                day_indicies
            }
        }

        // get all months
        let months = days.filter((d, i) => {
            d.index = i;
            return d.date() == 1;
        });

        return h('svg.timeline', {
            class: {
                editable: props.editable
            },
            attrs: {
                width: `${daysCount * cellSize}`,
                height: `${actionsOffset}`
            },
            on: props.editable
            ? {
                mousedown: (e) => {
                    if (e.target !== e.currentTarget) return
                    if (e.button != 0) return
                    const params = calculateParams(e)
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
            ...months.map((d) => {
                return h('text.month',
                    {
                        attrs: {
                            x: 10 + d.index * cellSize,
                            y: 24
                        }
                    }, days[d.index].format('{month} {year}')
                )
            }),
            ...days.map((d, x) =>
                h('text.day',
                    {
                        attrs: {
                            x: 13.5 + x * cellSize,
                            y: 43
                        }
                    }, d.date()
                )),
            ...days.map((d, x) =>
                h('text.day',
                    {
                        attrs: {
                            x: 13.5 + x * cellSize,
                            y: 60
                        }
                    }, abbr[d.day()]
                ))
        ])
    }
})
