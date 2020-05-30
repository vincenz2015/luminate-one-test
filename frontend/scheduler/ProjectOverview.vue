<template>
    <div>
        <div class="attention">
        
        </div>
        <div class="sidebyside">
            <table class="formal">
                <thead>
                <tr>
                    <th class="d heading"><router-link :to="resourcesHref" class="transparent">Projects</router-link></th>
                    <th class="d" title="Scheduled Days">Sch.</th>
                    <th class="d" title="Remaining Days Unscheduled">Rem.</th>
                </tr>
                <tr class="schedule_actions">
                    <td colspan="3">
                        <router-link :to="resourcesHref" class="btn_nav">View schedule</router-link>
                    </td>
                </tr>
                </thead>
                <tbody>
                <tr v-for="p in projectSchedule" class="table-row">
                    <td class="d"><router-link :to="projectHref(p.project.id)" class="transparent">{{ p.project.name }} <span class="icon">{{ p.project.icon }}</span></router-link></td>
                    <td class="d">{{ p.scheduled }}</td>
                    <td class="d">{{ p.remaining }}</td>
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
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import spacetime from 'spacetime'
    import Schedule from './schedule'
    import Cell from './ProjectOverviewCell'
    import Timeline from './Timeline'
    import TimeFilter from './TimeFilter'
    import pathie from 'pathie'

    const timezone = 'Pacific/Auckland'
    const dayOffsetEpoch = spacetime('2019-01-01', timezone)
    const daysCount = 7*13

    export default {
        components: {
            Schedule,
            Timeline,
            Cell,
            TimeFilter
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
            availabilityByProject() {
                return this.$store.state.availability.availabilityByProject
            },
            projects() {
                return this.$store.state.project.projects
            },
            projectSchedule() {
                const result = {}
                const visibleOffset = dayOffsetEpoch.diff(this.currenttime, 'days')
                for (const project of this.projects)
                    result[project.id] = {
                        project,
                        remaining: project.estimate,
                        scheduled: 0
                    }
                for (const a of pathie.flat(this.availabilityByProject, 2)) {
                    if (a[0] < visibleOffset) continue
                    if (a[0] >= visibleOffset + daysCount) continue
                    result[a[1]].remaining -= a[2].length
                    result[a[1]].scheduled += a[2].length
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
                    itemcount: this.$store.state.project.projects.length,
                    currenttime: this.currenttime,
                    limit: this.days,
                    ...this.$attrs
                }
            },
            resourcesHref() {
                return '/'
            }
        },
        methods: {
            create() {
                this.$router.push('/project/create')
            },
            projectHref(id) {
                return `/project/${id}`
            },
            update(project) {
                hub.emit('update project', project)
            },
            remove(id) {
                hub.emit('delete project', r.id)
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
