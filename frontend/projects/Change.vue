<template>
    <div>
        <div class="attention">
        </div>
        <div class="form-container">
            <form class="form" @submit="update">
                <h1>Change {{ project.name }}</h1>
                <div class="input-group">
                    <div class="w-80 d-inline-block">
                        <h4>PROJECT NAME</h4>
                        <input v-model="project.name" type="text" class="form-control">
                    </div>
                    <div class="w-20 d-inline-block">
                        <h4>ICON</h4>
                        <emoji-selector v-model="project.icon"></emoji-selector>
                    </div>
                    <div v-if="errors['name'] || errors['icon']" class="w-100 d-inline-block">
                        <label>{{getErrors(['name','icon'])}}</label>
                    </div>
                </div>
                <div class="input-group">
                    <div class="w-80 d-inline-block">
                        <h4>PROJECT ESTIMATE</h4>
                        <input v-model="project.estimate" type="number" class="form-control">
                    </div>
                    <div v-if="errors['estimate']" class="w-100 d-inline-block">
                        <label>{{getErrors(['estimate'])}}</label>
                    </div>
                </div>
                <div class="input-group">
                    <div class="w-100 d-inline-block">
                        <h4>ARCHIVE PROJECT</h4>
                        <input type="checkbox" v-model="project.archived" class="form-control">
                    </div>
                </div>
                <br>
                <br>
                <div class="input-group text-right">
                    <router-link :to="backHref" class="btn_cancel btn_lg">Cancel</router-link>
                    <button @click="update" class="btn_submit btn_lg">Save changes</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    import EmojiSelector from '../util/EmojiSelector'

    export default {
        components: {
            EmojiSelector
        },
        data() {
            return {
                project: {
                    id: this.$route.params.id,
                    name: '',
                    icon: '',
                    estimate: null,
                    archived: false
                },
                errors: []
            }
        },
        beforeCreate() {
            this.$hub.emit('load projects').then(() =>
                this.project = Object.assign({},
                    this.projectsById[this.project.id]))
        },
        computed: {
            projectsById() {
                return this.$store.state.project.projectsById
            },
            backHref() {
                return `/project/${this.project.id}`
            }
        },
        methods: {
            update(e) {
                e.preventDefault()
                this.$hub.emit('update project', this.project)
                    .then((response) => {
                        if (response[0].status === 422) {
                            this.errors = response[0].data;
                        } else {
                            this.$router.push(this.backHref)
                        }
                    })
            },
            insert(emoji) {
                this.input += emoji
            },
            getErrors(labels) {
                if (Array.isArray(labels)) {
                    return labels.map(label => this.errors[label]).join(' ');
                } else {
                    return this.errors[labels].join(' ');
                }
            }
        }
    }
</script>
