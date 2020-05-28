<template>
    <div>
        <div class="attention">
        </div>
        <div class="sidebyside">
            <table class="formal">
                <thead>
                <tr>
                    <th class="d heading"><router-link :to="projectsHref" class="transparent">Resources</router-link></th>
                    <th class="d" title="Scheduled Days">Sch.</th>
                    <th class="d" title="Remaining Days Unscheduled">Rem.</th>
                </tr>
                <tr class="schedule_actions">
                    <td colspan="3">
                        <router-link :to="projectsHref" class="btn_nav">View projects</router-link>
                        <router-link :to="availabilityHref" class="btn_nav">Update availability</router-link>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="r in resourceSchedule" class="table-row">
                    <td class="d"><router-link :to="resourceHref(r.resource.id)" class="transparent">{{ r.resource.name }} <span class="icon">{{ r.resource.icon }}</span></router-link></td>
                    <td class="d">{{ r.scheduled }}</td>
                    <td class="d">{{ r.remaining }}</td>
                </tr>
                </tbody>
                <tfoot>
                <tr class="schedule_actions">
                    <td>
                        <button @click="create" class="btn_icon">＋</button>
                    </td>
                </tr>
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
                        <timeline v-bind="timelineprops"></timeline>
                        <schedule v-bind="scheduleprops" v-slot="params">
                            <Cell v-bind="params"></Cell>
                        </schedule>
                    </td>
                </tr>
                <tr>
                    <td  colspan="2">
                        <key v-bind:projects="projects"></key>
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
    import Cell from './ResourceOverviewCell'
    import Timeline from './Timeline'
    import Key from './Key'
    import TimeFilter from "./TimeFilter";
    import pathie from 'pathie'

    const timezone = 'Pacific/Auckland'
    const dayOffsetEpoch = spacetime('2019-01-01', timezone)
    const daysCount = 7*13

    export default {
        components: {
            Schedule,
            Timeline,
            Key,
            Cell,
            TimeFilter
        },
        data() {
            return {
                currenttime: spacetime.today(timezone),
                days: 0
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
            projects() {
                return this.$store.state.project.projects
            },
            availabilityByResource() {
                return this.$store.state.availability.availabilityByResource
            },
            resources() {
                return this.$store.state.resource.resources
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
            timelineprops() {
                return {
                    editable: false,
                    currenttime: this.currenttime,
                    limit: this.days,
                    ...this.$attrs
                }
            },
            scheduleprops() {
                return {
                    editable: false,
                    itemcount: this.resources.length,
                    currenttime: this.currenttime,
                    limit: this.days,
                    ...this.$attrs
                }
            },
            projectsHref() {
                return '/projects'
            },
            availabilityHref() {
                return '/availability'
            }
        },
        methods: {
            resourceHref(id) {
                return `/resource/${id}`
            },
            create() {
                this.$router.push('/resource/create')
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
