import Vue from 'vue'
import hyperscript from 'vue-hyperscript-terse'

// https://vuejs.org/v2/guide/render-function.html
export default ({query, name, render}) => Vue.extend({
    name: name,
    functional: true,
    query: query,
    render: (h, ctx) => {
        return render(hyperscript(h), {
            state: ctx.parent.$store.state,
            route: ctx.parent.$route,
            router: ctx.parent.$router,
            hub: ctx.props.hub || ctx.data.hub || ctx.parent.$hub,
            ...ctx
        })
    }
})
