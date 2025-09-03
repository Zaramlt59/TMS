import { createApp } from 'vue'
import * as Sentry from '@sentry/vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

if (import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [],
    tracesSampleRate: 0.1,
    environment: import.meta.env.MODE
  })
}

app.mount('#app')
