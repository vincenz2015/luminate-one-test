<template>
    <div class="emoji__container">
        <div class="emoji__input" @click="open">
            <input type="text" v-model="icon" class="form-control" disabled />
        </div>
        <div v-if="visible" class="emoji__overlay">
            <div class="attention">
                <button @click="close" class="btn_cancel">Cancel</button>
            </div>
            <div class="emoji__search">
                <input type="search" v-model="search" class="form-control" placeholder="Type to search e.g. car…">
            </div>
            <div class="emoji__category" v-for="(group, category) in emoji" :key="category">
                <h5>{{ category }}</h5>
                <ul>
                    <li
                        v-for="(icon, name) in group"
                        :key="name"
                        @click="select(icon)"
                        :title="name"
                    >{{ icon }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import emoji from './emoji'

    export default {
        props: ['value'],
        data() {
            return {
                icon: this.value,
                search: '',
                visible: false
            }
        },
        computed: {
            emoji() {
                if (this.search == '') return emoji
                const res = {}

                for (const category in emoji) {
                    res[category] = {}

                    for (const e in emoji[category]) {
                        if (!new RegExp(`.*${this.search}.*`).test(e)) continue
                        res[category][e] = emoji[category][e]
                    }

                    if (Object.keys(res[category]).length === 0)
                        delete res[category]
                }

                return res
            }
        },
        watch: {
            value(icon) { this.icon = icon },
            // this updates the v-model attribute
            icon(icon) { this.$emit('input', icon) }
        },
        methods: {
            open() {
                this.visible = true
            },
            close() {
                this.visible = false
            },
            select(icon) {
                this.icon = icon
                this.visible = false
            }
        }
    }
</script>