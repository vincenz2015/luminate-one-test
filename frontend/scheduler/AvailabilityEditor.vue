<template>
    <div class="unselectable">
        <div class="attention">
            <span class="info">Updating resource availability</span>
            <router-link :to="resourcesHref" class="btn_cancel">Cancel</router-link>
            <button @click="update" class="btn_submit">Update</button>
        </div>
        <div class="sidebyside">
            <table class="formal">
                <thead>
                <tr>
                    <th class="d heading">Resources</th>
                    <th class="d" title="Scheduled Days">Sch.</th>
                    <th class="d" title="Remaining Days Unscheduled">Rem.</th>
                </tr>
                <tr class="schedule_actions">
                    <td colspan="3">
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="r in resourceSchedule" class="table-row">
                    <td class="d">{{ r.resource.name }} <span class="icon">{{ r.resource.icon }}</span></td>
                    <td class="d">{{ r.scheduled }}</td>
                    <td class="d">{{ r.remaining }}</td>
                </tr>
                </tbody>
                <tfoot>
                </tfoot>
            </table>

            <table class="formal">
                <thead>
                <tr>
                    <th class="heading">Schedule</th>
                    <td class="heading_actions">
                        <time-filter></time-filter>
                        <button @click="backward" class="btn_icon"><</button>
                        <button @click="today" class="btn_icon">T</button>
                        <button @click="forward" class="btn_icon">></button>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colspan="2">
                        <timeline v-bind="timelineProps"></timeline>
                        <schedule v-bind="scheduleProps" v-slot="params">
                            <Cell v-bind="params"></Cell>
                        </schedule>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import spacetime from 'spacetime'
    import Schedule from './schedule'
    import Cell from './AvailabilityEditorCell'
    import Timeline from './Timeline'
    import TimeFilter from './TimeFilter'
    import pathie from 'pathie'

    const timezone = 'Pacific/Auckland'
    const dayOffsetEpoch = spacetime('2019-01-01', timezone)
    const daysCount = 7*13

    const changeapi = (availabilityByResource, changes) => {
        const getcell = (day_index, resource_id) =>
            pathie.get(availabilityByResource, [day_index, resource_id])

        const getchange = (day_index, resource_id) =>
            pathie.get(changes, [day_index, resource_id])

        const getstatus = (day_index, resource_id) => {
            const change = getchange(day_index, resource_id)
            if (change != null) return change
            const existing = getcell(day_index, resource_id)
            if (existing == null) return 'available'
            if (existing.project_id == null) return 'unavailable'
            return 'assigned'
        }

        const invertstatus = (status) =>
            status == 'unavailable'
            ? 'available'
            : 'unavailable'

        const applychanges = (status, coordinates) => {
            let res = changes
            for (let c of coordinates) {
                const change = getchange(c.day_index, c.resource_id)
                const existing = getcell(c.day_index, c.resource_id)
                if (change) {
                    if (change != status) {
                        res = JSON.parse(JSON.stringify(res))
                        pathie.del(res, [c.day_index, c.resource_id])
                    }
                }
                else if (status == 'unavailable') {
                    if (existing == null || existing.project_id != null) {
                        res = JSON.parse(JSON.stringify(res))
                        pathie.set(res,
                            [c.day_index, c.resource_id],
                            'unavailable')
                    }
                }
                else if (status == 'available' && existing && existing.project_id == null) {
                    res = JSON.parse(JSON.stringify(res))
                    pathie.set(res,
                        [c.day_index, c.resource_id],
                        'available')
                }
            }
            return res
        }

        return {
            getcell,
            getchange,
            getstatus,
            invertstatus,
            applychanges
        }
    }

    export default {
        components: {
            Schedule,
            Timeline,
            TimeFilter,
            Cell
        },
        data() {
            return {
                currenttime: spacetime.today(timezone),
                days: 31
            }
        },
        mounted() {
            this.days = this.$store.state.timefilter.days;
            this.$on('update days', (days) => {
                this.days = days;
            })
        },
        beforeCreate() {
            Promise.all([
                this.$hub.emit('load resources'),
                this.$hub.emit('load projects')
            ])
            .then(() => this.$hub.emit('load availability'))
            .then(() => this.$hub.emit('update'))
        },
        computed: {
            availabilityByResource() {
                return this.$store.state.availability.availabilityByResource
            },
            resources() {
                return this.$store.state.resource.resources
            },
            changes() {
                return this.$attrs.changes || {}
            },
            resourceSchedule() {
                const result = {}
                const visibleOffset = dayOffsetEpoch.diff(this.currenttime, 'days')
                for (const resource of this.resources)
                    result[resource.id] = {
                        resource,
                        remaining: daysCount,
                        unavailable: 0,
                        scheduled: 0
                    }
                for (const a of pathie.flat(this.availabilityByResource, 2)) {
                    if (a[0] < visibleOffset) continue
                    if (a[0] >= visibleOffset + daysCount) continue
                    result[a[1]].remaining--
                    if (a[2].project_id)
                        result[a[1]].scheduled++
                    else
                        result[a[1]].unavailable++
                }
                return result
            },
            timelineProps() {
                const api = changeapi(this.availabilityByResource, this.changes)

                return {
                    editable: true,
                    isdown: this.$attrs.isdown_timeline,
                    currenttime: this.currenttime,
                    limit: this.days,
                    hub: this.$hub.child({
                        mousedown: (params) => {
                            const resource_id = this.resources[0].id
                            const applyingstatus = api.invertstatus(api.getstatus(params.day_index, resource_id))
                            this.$hub.emit('update', {
                                isdown_timeline: true,
                                applyingstatus: applyingstatus,
                                day_index: params.day_index,
                                changes: api.applychanges(applyingstatus,
                                    this.resources.map(r => ({
                                        day_index: params.day_index,
                                        resource_id: r.id
                                    }))
                                )
                            })
                        },
                        mousemove: (params) => {
                            this.$hub.emit('update', {
                                day_index: params.day_index,
                                changes: api.applychanges(this.$attrs.applyingstatus, params.day_indicies.map(d =>
                                    this.resources.map(r => ({
                                        day_index: d,
                                        resource_id: r.id
                                    }))).flat())
                            })
                        },
                        mouseup: (params) => {
                            this.$hub.emit('update', {
                                isdown_timeline: false,
                                applyingstatus: null,
                                day_index: null
                            })
                        }
                    }),
                    ...this.$attrs
                }
            },
            scheduleProps() {
                const api = changeapi(this.availabilityByResource, this.changes)

                return {
                    editable: true,
                    isdown: this.$attrs.isdown_schedule,
                    itemcount: this.resources.length,
                    currenttime: this.currenttime,
                    limit: this.days,
                    hub: this.$hub.child({
                        mousedown: (params) => {
                            if (params.item_index == null) return
                            const resource_id = this.resources[params.item_index].id
                            const applyingstatus = api.invertstatus(api.getstatus(params.day_index, resource_id))
                            this.$hub.emit('update', {
                                isdown_schedule: true,
                                applyingstatus: applyingstatus,
                                item_index: params.item_index,
                                day_index: params.day_index,
                                changes: api.applychanges(applyingstatus, [{
                                    day_index: params.day_index,
                                    resource_id
                                }])
                            })
                        },
                        mousemove: (params) => {
                            if (params.item_index == null) return
                            const resource_id = this.resources[params.item_index].id
                            this.$hub.emit('update', {
                                day_index: params.day_index,
                                item_index: params.item_index,
                                changes: api.applychanges(this.$attrs.applyingstatus, params.day_indicies.map(d => ({
                                    day_index: d,
                                    resource_id
                                })))
                            })
                        },
                        mouseup: (params) => {
                            this.$hub.emit('update', {
                                isdown_schedule: false,
                                applyingstatus: null,
                                day_index: null,
                                item_index: null
                            })
                        }
                    }),
                    ...this.$attrs
                }
            },
            resourcesHref() {
                return '/'
            }
        },
        methods: {
            update() {
                const changes = this.$attrs.changes || {}
                this.$hub.emit('update availability',
                    pathie.flat(changes, 2).map(c => ({
                        day_index: c[0],
                        resource_id: c[1],
                        status: c[2]
                    })))
                .then(() => this.$router.push({ path: '/' }))
            },
            backward() {
                this.currenttime = this.currenttime.subtract(1, 'week')
            },
            forward() {
                this.currenttime = this.currenttime.add(1, 'week')
            },
            today() {
                this.currenttime = spacetime.now()
            }
        }
    }
</script>
