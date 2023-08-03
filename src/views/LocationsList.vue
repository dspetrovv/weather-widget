<template>
  <div class="locations">
    <div
      v-for="location of locations"
      :key="location.id"
      :class="{
        'locations__card-wrapper': true,
        'locations__card-wrapper_border': location === null
      }"
    >
      <location-card
        :ref="(el) => setLocationRef(el, location.id)" 
        :name="location.name"
        :id="location.id"
        @dragstart="dragHandler(location.id)"
        @dragover.prevent="dragging(location.id)"
        @dragend="gragEnd"
      />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import LocationCard from '@/components/LocationCard.vue';
import useLocationsFunctions from '@/functions/locations-functions';

export default defineComponent({
  components: { LocationCard },
  setup() {
    let {
      dragHandler,
      dragging,
      setLocationRef,
      gragEnd,
      locations,
      locationsCopy,
    } = useLocationsFunctions()

    return {
      locations,
      locationsCopy,
      dragHandler,
      dragging,
      gragEnd,
      setLocationRef,
    };
  },
})
</script>
