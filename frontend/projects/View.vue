<template>
    <div>
        <div class="attention">
        </div>
        <div class="form-container">
            <div class="back">
                <router-link :to="closeHref" class="btn_nav">✕ Close</router-link>
            </div>
            <div class="form">
                <h1>{{ project.name }}</h1>
                <router-link :to="changeHref" class="btn_nav">Change {{ project.name }}</router-link>
                <router-link :to="scheduleHref" class="btn_nav">Schedule resources</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                project: {
                    id: this.$route.params.id,
                    name: '',
                    icon: '',
                    archived: false
                }
            }
        },
        beforeCreate() {
            this.$hub.emit('load projects').then(() =>
                this.project = this.projectsById[this.project.id])
        },
        computed: {
            projectsById() {
                return this.$store.state.project.projectsById
            },
            closeHref() {
                return '/projects'
            },
            changeHref() {
                return `/project/${this.project.id}/change`
            },
            scheduleHref() {
                return `/project/${this.project.id}/schedule`
            }
        }
    }
</script>
