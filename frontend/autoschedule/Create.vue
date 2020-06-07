<template>
<div>
    <div class="attention"></div>
    <div class="form-container">
        <form class="form" @submit="create">
            <h1>Auto schedule resources</h1>
            <div class="input-group">
                <div class="w-80 d-inline-block">
                    <h2>Select Resources</h2>
                    <table id="resource-table">

                        <tbody>
                            <tr class="table-header">
                                <td>select</td>
                                <td class="w-80">Name</td>
                                <td>Scheduled</td>
                                <td>Remaining</td>
                            </tr>
                            <tr v-for="r in resourceData" class="table-row">
                                <td>
                                    <input type="checkbox" :value="r.resource.id" v-model="selectedResources" class="form-control">
                                </td>
                                <td class="d">
                                    <router-link :to="`/resource/${r.resource.id}`" class="transparent">
                                        {{ r.resource.name }}
                                        <span class="icon">{{ r.resource.icon }}</span>
                                    </router-link>
                                </td>
                                <td class="d">{{ r.scheduled }}</td>
                                <td class="d">{{ r.remaining }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <br />
            <div class="input-group">
                <div class="w-80 d-inline-block">
                    <h2>Select Projects to assign Resources to</h2>
                    <key :projects="projects" @updateSelectedProjects="updateProjects"></key>
                </div>
            </div>
            <br />
            <div class="input-group text-right">
                <router-link :to="backHref" class="btn_cancel btn_lg">Cancel</router-link>
                <button @click="create" class="btn_submit btn_lg">Schedule Resources</button>
            </div>
        </form>
    </div>
</div>
</template>

<style scoped>
#resource-table {
    border: 1px solid #999;
    margin: 0px;
}

#resource-table td {
    padding: 5px 10px
}

.table-header {
    background-color: #eee
}
</style>

<script>
import spacetime from 'spacetime'
import pathie from 'pathie'
import Key from './Key'
const daysCount = 7 * 13;
const timezone = 'Pacific/Auckland'
const dayOffsetEpoch = spacetime('2019-01-01', timezone)
export default {
    components: {
        Key
    },
    data() {
        return {
            selectedResources: [],
            selectedProjects: [],
            errors: []
        };
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
        backHref() {
            return "/resources/";
        },
        availabilityByResource() {
            return this.$store.state.availability.availabilityByResource
        },
        resources() {
            return this.$store.state.resource.resources;
        },
        projects() {
            return this.$store.state.project.projects;
        },
        resourceData() {
            const result = {};
            const visibleOffset = dayOffsetEpoch.diff(this.currenttime, 'days')
            for (const resource of this.resources)
                result[resource.id] = {
                    resource,
                    remaining: daysCount,
                    unavailable: 0,
                    scheduled: 0
                };
            for (const a of pathie.flat(this.availabilityByResource, 2)) {
                if (a[0] < visibleOffset) continue;
                if (a[0] >= visibleOffset + daysCount) continue;
                result[a[1]].remaining--;
                if (a[2].project_id) result[a[1]].scheduled++;
                else result[a[1]].unavailable++;
            }
            return result;
        }
    },
    methods: {
        updateProjects(data) {
            this.selectedProjects = data;
            console.log(this.selectedProjects);
        },
        create(e) {
            e.preventDefault();

            console.log(this.selectedResources);
            console.log(this.selectedProjects);

            const oncreated = p => {
                this.$hub.off(oncreated);
                alert("done");
            };
            this.$hub.on("autoscheduled resources", oncreated);
            this.$hub
                .emit("autoschedule resources", {
                    resources: this.selectedResources,
                    projects: this.selectedProjects
                })
                .then(response => {
                    if (response[0].status === 422) {
                        this.errors = response[0].data;
                    }
                });
        },
        back() {
            this.$router.push(this.backHref);
        },
        getErrors(labels) {
            if (Array.isArray(labels)) {
                return labels.map(label => this.errors[label]).join(" ");
            } else {
                return this.errors[labels].join(" ");
            }
        }
    }
};
</script>
