import { createApp } from 'vue'
import App from './App.vue'

// Vant imports
import {
  Button, Cell, ConfigProvider, Empty, Field, Form,
  Picker, Popup, Radio, RadioGroup, Search,
  Stepper, SwipeCell, Tabbar, TabbarItem,
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

// Register Vant components
const vantComponents = [
  Button, Cell, ConfigProvider, Empty, Field, Form,
  Picker, Popup, Radio, RadioGroup, Search,
  Stepper, SwipeCell, Tabbar, TabbarItem,
]
vantComponents.forEach(c => app.use(c))

app.mount('#app')
