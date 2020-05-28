<template>
    <div>
        <div class="attention">
        </div>
        <div class="form-container">
            <div class="form">
                <h1>New Project</h1>
                <div class="input-group">
                    <div class="w-80 d-inline-block">
                        <h4>PROJECT NAME</h4>
                        <input v-model="name" type="text" class="form-control">
                    </div>
                    <div class="w-20 d-inline-block">
                        <h4>ICON</h4>
                        <emoji-selector v-model="icon"></emoji-selector>
                    </div>
                    <div v-if="errors['name'] || errors['icon']" class="w-100 d-inline-block">
                        <label>{{getErrors(['name','icon'])}}</label>
                    </div>
                </div>
                <div class="input-group">
                    <div class="w-100 d-inline-block">
                        <h4>PROJECT ESTIMATE</h4>
                        <input v-model="estimate" type="number" class="form-control">
                    </div>
                    <div v-if="errors['estimate']" class="w-80 d-inline-block">
                        <label>{{getErrors(['estimate'])}}</label>
                    </div>
                </div>
                <br>
                <br>
                <div class="input-group text-right">
                    <router-link :to="backHref" class="btn_cancel btn_lg">Cancel</router-link>
                    <button @click="create" class="btn_submit btn_lg">Create Project</button>
                </div>
            </div>
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
                name: '',
                icon: '',
                estimate: 0,
                archived: false,
                errors: []
            }
        },
        computed: {
            backHref() {
                return '/projects/'
            }
        },
        methods: {
            create(e) {
                e.preventDefault()
                const oncreated = p => {
                    this.$hub.off(oncreated)
                    this.$router.push(`/project/${p.id}`)
                }
                this.$hub.on('created project', oncreated)
                this.$hub.emit('create project', {
                    name: this.name,
                    icon: this.icon,
                    estimate: this.estimate
                }).then((response) => {
                    if (response[0].status === 422) {
                        this.errors = response[0].data;
                    }
                })
            },
            back() {
                this.$router.push({path: '/projects'})
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
