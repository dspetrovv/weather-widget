import { createPinia } from 'pinia'
import { createApp, CreateAppFunction, h } from 'vue'
import webComponentWrapper from 'vue3-webcomponent-wrapper'
import App from './App.ce.vue'
import './style/main.scss'

const pinia = createPinia()

const createAppWrapper: CreateAppFunction<Element> = (component) => {
  return createApp(component)
  .use(pinia)
}

const WeatherWidget = webComponentWrapper(App, createAppWrapper, h,);
customElements.define('weather-widget', WeatherWidget);
