import Vue from 'vue'
import Lottery from './Lottery.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(Lottery)
}).$mount('#app')
