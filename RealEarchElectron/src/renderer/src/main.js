import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { lazyLoad } from './directive/directives'

createApp(App).directive('lazy', lazyLoad).mount('#app')
