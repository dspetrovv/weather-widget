import { useLocationsStore } from "@/store/locationsStore";
import { storeToRefs } from "pinia";
import { ComponentPublicInstance, computed, ref, Ref } from "vue";

const MARGINBOTTOM = 10;

function useLocationsFunctions() {
  const locationStore = useLocationsStore();
  let { locationsList, locationsListCopy } = storeToRefs(locationStore);

  let locations = computed(() => {
    return [ ...locationsList.value ];
  });
  let locationsCopy = computed(() => {
    return [ ...locationsList.value ];
  });
  let initCoords = ref(0);
  let locationCardHeight = ref(0);
  let draggingElementId = ref(0);

  function getCoords(id: number) {
    let ref = locations.value.find((location) => location.id === id)!;
    locationCardHeight.value = ref.ref.location.getBoundingClientRect().height + MARGINBOTTOM;
    return ref.ref.location.getBoundingClientRect().y + (ref.ref.location.getBoundingClientRect().height / 2);
  }
  function dragHandler(id: number) {
    initCoords.value = getCoords(id);
    draggingElementId.value = id;
  }
  function dragging(id: number) {
    let newCoords = getCoords(id);
    let height = initCoords.value - newCoords;
    if (initCoords.value !== newCoords) {
      resortLocationsArray(newCoords, id);
      initCoords.value = newCoords;
    }
  }
  function setLocationRef(el: Element|null|ComponentPublicInstance, idx: number) {
    const myLocation = locations.value.find((loc) => loc.id === idx)!;
    if (myLocation) {
      myLocation.ref = el!
    }
  }
  function resortLocationsArray(coords: number, id: number) {
    const newLocation = locationsCopy.value.find((location) => coords === getCoords(location.id))!;
    locationStore.resortLocationsLists(
      id,
      draggingElementId.value,
      newLocation,
    );
  }
  function gragEnd() {
    locationStore.rewriteLocationsCopy();
  }
  
  return {
    dragHandler,
    dragging,
    setLocationRef,
    gragEnd,
    locations,
    locationsCopy,
  };
}

export default useLocationsFunctions;