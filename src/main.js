import Vue from 'vue'
import App from './app/App.vue'
// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import './app/components'
import './styles/app.scss'
import './app/plugins'
import './app/plugins/vue'

// Vue.use(BootstrapVue)
// Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
