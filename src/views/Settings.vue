<template>
  <div :class="{ settings: true, settings_show: isSettingsOpened }">
    <div class="settings__title">Settings</div>
    <close-icon @click="closeSettings" />
    <div>
      <label for="new-location" class="settings__new-location">Add Location:</label>
      <div class="search-location">
        <input
          id="new-location"
          type="text"
          v-model="search"
          @click="clearError"
        >
        <search-icon />
        <div v-if="searchLocations.length" class="search-list">
          <div
            v-for="(location, idx) in searchLocations"
            :key="idx"
            class="search-list__item"
            @click="addLocation(idx)"
          >
            {{ location.name }}, {{ location.country }}
          </div>
        </div>
      </div>
      <span class="search-error">{{ searchError }}</span>
      <div class="settings__new-locations-list"></div>
    </div>
    <locations-list />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import SearchIcon from '../components/icons/SearchIcon.vue';
import LocationsList from './LocationsList.vue';
import CloseIcon from '@/components/icons/CloseIcon.vue';
import { useLocationsStore } from '@/store/locationsStore';
import { storeToRefs } from 'pinia';

export default defineComponent({
  components: { SearchIcon, LocationsList, CloseIcon },
  props: {
    isSettingsOpened: {
      type: Boolean as PropType<boolean>,
      required: true,
    },
  },
  emits: ['closeSettings'],
  setup(_, { emit }) {
    const locationsStore = useLocationsStore();
    let { searchLocations, addingLocationError: searchError } = storeToRefs(locationsStore);
    let search = ref<string>('');

    function closeSettings() {
      emit('closeSettings');
    }
    function addLocation(idx: number) {
      locationsStore.addLocation(idx);
      locationsStore.clearSearchLocations();
      search.value = '';
    }
    function clearError() {
      locationsStore.clearSearchLocationsError();
    }

    watch(search, (val) => {
      val = val.trim();
      if (val) {
        locationsStore.findLocations(val);
      } else {
        locationsStore.clearSearchLocations();
      }
    });

    return {
      search,
      searchError,
      searchLocations,
      closeSettings,
      clearError,
      addLocation,
    };
  },
})
</script>
