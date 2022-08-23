<template>
  <div class="widget-card">
    <div class="widget-card__title">{{ place }}</div>
    <div class="widget-card__general">
      <img :src="imgSrc" :alt="weather.icon">
      <h1>{{ deg }}°C</h1>
    </div>
    <span class="widget-card__main">{{ info }}</span>
    <table class="widget-card__info">
      <tbody>
        <tr>
          <td><wind-icon /> <span>{{ wind }}</span> m/s</td>
          <td><pressure-icon /> <span>{{ pressure }} hPa</span></td>
        </tr>
        <tr>
          <td>Humidity: {{ humidity }}%</td>
          <td>Visibility: {{ visibilityInKms }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import WindIcon from './icons/WindIcon.vue'
import PressureIcon from './icons/PressureIcon.vue'
import { IWeather } from '@/types/interfaces/ILocations';

export default defineComponent({
  components: { WindIcon, PressureIcon },
  props: {
    place: {
      type: String as PropType<string>,
      required: true,
    },
    weather: {
      type: Object as PropType<IWeather>,
      required: true,
    },
    deg: {
      type: Number as PropType<number>,
      required: true,
    },
    info: {
      type: String as PropType<string>,
      required: true,
    },
    wind: {
      type: Number as PropType<number>,
      required: true,
    },
    pressure: {
      type: Number as PropType<number>,
      required: true,
    },
    humidity: {
      type: Number as PropType<number>,
      required: true,
    },
    visibility: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  
  setup(props) {
    let visibilityInKms = ref(`${(props.visibility/1000).toFixed(2)}km`);
    let imgSrc = ref(`http://openweathermap.org/img/wn/${props.weather.icon}@2x.png`);

    return {
      visibilityInKms,
      imgSrc,
    };
  },
})
</script>
