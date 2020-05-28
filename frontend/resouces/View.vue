<template>
    <div>
        <div class="attention">
        </div>
        <div class="form-container">
            <div class="back">
                <router-link :to="closeHref" class="btn_nav">✕ Close</router-link>
            </div>
            <div class="form">
                <h1>{{ resource.name }}</h1>
                <router-link :to="changeHref" class="btn_nav">Change {{ resource.name }}</router-link>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                resource: {
                    id: this.$route.params.id,
                    name: '',
                    icon: ''
                }
            }
        },
        beforeCreate() {
            this.$hub.emit('load resources').then(() =>
                this.resource = this.resourcesById[this.resource.id])
        },
        computed: {
            resourcesById() {
                return this.$store.state.resource.resourcesById
            },
            closeHref() {
                return `/resources`
            },
            changeHref() {
                return `/resource/${this.resource.id}/change`
            }
        }
    }
</script>
