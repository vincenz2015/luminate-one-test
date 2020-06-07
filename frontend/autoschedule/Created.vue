<template>
<div>
    <div class="attention"></div>
    <div class="form-container">
        <form class="form">
            <h1>Resources Scheduled</h1>
            <div class="input-group">
                <div class="w-80 d-inline-block">
                    <p>Your resources were auto-schedule</p>
                    <p><b>{{ scheduled.totalItemsCreated }}</b> assignments were auto created</p>
                </div>
            </div>
            <br>
            <br>
            <div class="input-group text-right">
                <router-link :to="backHref">
                <button class="btn_submit btn_lg">OK</button>
                </router-link>
            </div>
        </form>
    </div>
</div>
</template>

<script>
import pathie from 'pathie'
import Key from './Key'
export default {
    components: {
        Key
    },
    data() {
        return {
            scheduled: this.$store.state.autoschedule.totals,
            errors: []
        };
    },
    computed: {
        backHref() {
            return "/resources/";
        }
    },
    methods: {
        back() {
            this.$router.push(this.backHref);
        }
    }
};
</script>
