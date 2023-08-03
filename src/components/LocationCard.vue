<template>
  <div ref="location" class="locations__card">
    <burger-icon @mousedown="dragOn" @mouseleave="dragOff" />
    <div class="locations__name">{{ name }}</div>
    <div class="locations__delete">
      <delete-icon @click="deleteLocationHandler" />
    </div>
  </div>
</template>
<script lang="ts">
import { useLocationsStore } from '@/store/locationsStore';
import { defineComponent, PropType, ref } from 'vue'
import BurgerIcon from '@/components/icons/BurgerIcon.vue';
import DeleteIcon from '@/components/icons/DeleteIcon.vue';

export default defineComponent({
  props: {
    name: {
      type: String as PropType<string>,
      required: true,
    },
    id: {
      type: Number as PropType<number>,
      required: true,
    },
  },

  components: { BurgerIcon, DeleteIcon },
  setup(props) {
    const { deleteLocation } = useLocationsStore();
    const location = ref<HTMLElement | null>(null);

    function dragOn() {
      if (location.value) {
        location.value.draggable = true;
        location.value.classList.toggle('dragging');
      }
    }

    function dragOff() {
      if (location.value) {
        location.value.draggable = false;
        location.value.classList.remove('dragging');
      }
    }

    function deleteLocationHandler() {
      deleteLocation(props.id);
    }

    return {
      location,
      dragOn,
      dragOff,
      deleteLocationHandler,
    };
  }
})
</script>
