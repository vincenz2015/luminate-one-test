<template>
<table id="project-table">
    <tbody>
        <tr class="table-header">
            <td>select</td>
            <td class="w-90">Project</td>
        </tr>
        <tr class="table-row" v-for="(project, index) in projects" :key="project.id">
            <td class="key-entry">
                <input type="checkbox" :value="project.id" @change="updateProjects" v-model="selectedProjects" class="form-control">
            </td>
            <td class="w-80">
                <span>{{project.icon}}</span>
                <span>{{project.name}}</span>
            </td>
        </tr>
    </tbody>
</table>
</template>

<style scoped>
#project-table {
    border: 1px solid #999;
    margin: 0px;
}

#project-table td {
    padding: 5px 10px
}

.table-header {
    background-color: #eee
}
</style>

<script>
export default {
    data() {
        return {
            selectedProjects: []
        }
    },
    props: [
        "projects"
    ],
    methods: {
        updateProjects() {
            let sel = this.selectedProjects;
            console.log("child sel" + sel);
            this.$emit('updateSelectedProjects', sel);
            console.log("clicked");
        }
    }
}
</script>