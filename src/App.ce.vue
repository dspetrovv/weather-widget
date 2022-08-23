<template>
  <div :class="{ widget: true, widget_closed: isSettingsOpened }">
    <settings
      :is-settings-opened="isSettingsOpened"
      @close-settings="toggleSettings"
    />
    <gear-icon
      class="settings-btn"
      @click="toggleSettings"
      :style="{ display: !isSettingsOpened ? 'block' : 'none' }"
    />
    <widget-card
      v-for="(location) in locations"
      :key="location.id"
      :place="getPlace(location.name, location.sys?.country)"
      :weather="location.weather[0]"
      :deg="location.main?.temp"
      :info="getInfo(location)"
      :wind="location.wind.speed"
      :pressure="location.main?.pressure"
      :humidity="location.main?.humidity"
      :visibility="location.visibility"
    />
    <div
      v-if="!locations.length"
      class="locations-error-block"
    >
      <button v-if="!isLoadingLocations" @click="reload">Reload</button>
      <span v-else>Loading...</span>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { defineComponent } from 'vue';
import GearIcon from './components/icons/GearIcon.vue';
import WidgetCard from './components/WidgetCard.vue';
import { useLocationsStore } from './store/locationsStore';
import { ILocation } from './types/interfaces/ILocations';
import Settings from './views/Settings.vue';

export default defineComponent({
  name: 'App',
  components: {
    WidgetCard,
    GearIcon,
    Settings
  },
  data() {
    return {
      isSettingsOpened: false,
    };
  },
  computed: {
    ...mapState(useLocationsStore, [
      'locations',
      'isLoadingLocations'
    ]),
  },
  mounted() {
    this.getLocations();
  },
  methods: {
    ...mapActions(useLocationsStore, ['getLocations']),
    toggleSettings() {
      this.isSettingsOpened = !this.isSettingsOpened;
    },
    getInfo(info: ILocation) {
      return `Feels like ${info.main?.feels_like}°C, ${info.weather[0]?.description}.`
    },
    getPlace(name: string, country: string|undefined) {
      return `${name}, ${country}`;
    },
    reload() {
      this.getLocations();
    },
  }
});
</script>
