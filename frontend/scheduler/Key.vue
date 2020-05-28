<template>
    <div class="keys">
        <router-link v-for="project in projects" :to="route(project.id)" :key="project.id" class="key-entry">
            <span>{{project.icon}}</span>
            <span>{{project.name}}</span>
        </router-link>
    </div>
</template>

<script>
    export default {
        props: [
            "projects"
        ],
        methods: {
            route(id) {
                return '/project/'+id+'/schedule';
            }
        }
    }
</script>
