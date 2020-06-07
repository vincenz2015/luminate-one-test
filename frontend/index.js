import Vue from 'vue'
Vue.config.devtools = false
Vue.config.productionTip = false

// domains
import './projects'
import './resouces'
import './scheduler'
import './autoschedule'

// make sure this is last (otherwise the wildcards will catch other defined routes)
import './routes'
