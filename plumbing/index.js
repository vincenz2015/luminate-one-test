// Import the frontend
import '../frontend'

// Vue Dev Tools
Vue.config.devtools = process.env.NODE_ENV === 'development'

// Stores via modules
// https://vuex.vuejs.org/guide/modules.html
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
Vue.use(Vuex)
const vuexLocalStorage = new VuexPersist({
    key: 'vuex', // The key to store the state on in the storage provider.
    storage: window.localStorage, // or window.sessionStorage or localForage
});
const modules = {}
for (let module of inject.many('store'))
    modules[module.name] = module
const store = new Vuex.Store({
    strict: process.env.NODE_ENV !== 'production',
    plugins: [vuexLocalStorage.plugin],
    modules
});

// Routes
import Router from 'vue-router'
Vue.use(Router)
const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL
});

// Setup axios with CSRF protection
import axios from 'axios'
window.axios = axios
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
const token = document.head.querySelector('meta[name="csrf-token"]')
if (token) window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content
else console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token')

// Setup event bus hub
import Vue from 'vue'
import Hub from 'odo-hub'
const hub = Hub()
Vue.use({
    install: (Vue, options) => {
        Vue.mixin({
            beforeCreate: function () {
                const options = this.$options
                if (options.hub)
                    this.$hub = options.hub
                else if (options.parent && options.parent.$hub)
                    this.$hub = options.parent.$hub
            }
        })
    }
})

// launch Vue
const props = {}
const scene = new Vue({
    router, store, hub, render: h =>
        h('router-view', { props: props })
})

// Unidirectional data flow
hub.on('update', (p) => {
    Object.assign(props, p)
    return scene.$forceUpdate()
})
hub.on('reset', (p) => {
    for (let k of Object.keys(props)) delete props[k]
    return hub.emit('update')
})
// an opportunity for functional components to query
router.beforeResolve((route, from, next) => {
    const queryctx = {
        state: store.state,
        route,
        hub
    }

    Promise.all(route.matched
        .filter(m => m.components.default.options && m.components.default.options.query != null)
        .map(m => m.components.default.options.query(queryctx)))
        .then(next)
})

// clear props (transient state) after link navigation
router.afterEach((to, from) => hub.emit('reset'))

// Dispatch to many pods
import inject from 'injectinto'
const podctx = { store, router, axios, hub, scene, props }
for (let pod of inject.many('pod')) pod(podctx)

// unidirectional data flow - router does not pass through
// it's props so we have to inject them
router.addRoutes(inject.many('route').map(r => {
    const p = r.props || (() => {})
    r.props = (route) => ({ ...props, ...p() })
    return r
}))

hub.emit('init').then(() => scene.$mount('#root'))
