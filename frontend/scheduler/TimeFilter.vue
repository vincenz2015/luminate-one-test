<template>
    <div class="timeline-filter">
        <h4>Showing <input v-model="days" @change="emit" type="number" min="7" max="365"> days</h4>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                days: -1
            }
        },
        mounted() {
            this.days = this.$store.state.timefilter.days;

            if(this.days === -1){
                let leftWidth = document.getElementsByClassName('formal')[0].offsetWidth;
                let rightWidth = window.innerWidth - leftWidth;
                this.days = Math.round(rightWidth / (26 + 3));
                this.emit();
            }
        },
        methods: {
            emit() {
                this.$hub.emit('update days', this.days);
                this.$parent.$emit('update days', this.days);
            }
        }
    }
</script>
