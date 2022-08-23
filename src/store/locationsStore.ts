import { ILocation, ILocationList, ISearchLocation } from "@/types/interfaces/ILocations";
import { defineStore } from "pinia";
import api from './api';

export const useLocationsStore = defineStore('locations', {
  state: () => ({
    locations: [] as ILocationList[],
    locationsList: [] as ILocationList[],
    locationsListCopy: [] as ILocationList[],
    searchLocations: [] as ISearchLocation[],
    isLoadingLocations: true,
    addingLocationError: '',
  }),

  actions: {
    setInitialLocation(newLocation: any) {
      localStorage.setItem('weather-widget', JSON.stringify(newLocation));
      this.locations = newLocation;
      this.locationsList = newLocation;
      this.locationsListCopy = newLocation;
      this.isLoadingLocations = false;
    },

    getInitialLocation() {
      let coords: ILocation|GeolocationCoordinates|null = null;
      navigator.geolocation.getCurrentPosition(async (position) => {
        coords = position.coords;
        const locationRequest = await this.getLocationInfo(coords.latitude, coords.longitude)
        let json = await locationRequest.json();
        if (locationRequest.ok) {
          this.setInitialLocation([json]);
        } else {
          this.isLoadingLocations = false;
          throw new Error(json.message);
        }
      });
    },

    async getLocations() {
      let myLocations = localStorage.getItem('weather-widget');
      this.isLoadingLocations = true;
      if (myLocations === null || myLocations.length == 2) {
        this.getInitialLocation();
      } else {
        const locations: ILocationList[] = JSON.parse(myLocations);
        this.locationsList = locations;
        this.locationsListCopy = locations;
        for (const [idx, location] of locations.entries()) {
          await this.getNewLocationInfo(idx, location);
        }
        this.isLoadingLocations = false;
      }
    },

    async getNewLocationInfo(id: number, location: ILocation) {
      const request = await this.getLocationInfo(location.coord.lat, location.coord.lon);
      let json = await request.json();
      if (request.ok) {
        this.locations.push(json);
      } else {
        this.isLoadingLocations = false;
        throw new Error(json.message);
      }
    },

    async addLocation(idx: number) {
      try {
        const newLocation = this.searchLocations.find((_, index) => idx === index)!;
        const locationRequest = await this.getLocationInfo(newLocation.lat, newLocation.lon);
        let json = await locationRequest.json();
        if (locationRequest.ok) {
          const locationsLengthBefore = this.locations.length;
          const locationsListLengthBefore = this.locationsList.length;
          this.locations.unshift({...json});
          this.locationsList.unshift({...json});
          this.makeLocationsUnique(locationsLengthBefore, locationsListLengthBefore)
          this.locationsListCopy = [ ...this.locationsList ];
          
          this.updateLocalStorage(this.locations)
        } else {
          throw new Error(json.message);
        }
      } catch (error: any) {
        this.addingLocationError = error;
      }
    },
    
    deleteLocation(id: number) {
      this.locations = this.locations.filter((location) => location.id !== id);
      this.locationsList = this.locationsList.filter((location) => location.id !== id);
      this.locationsListCopy = this.locationsListCopy.filter((location) => location.id !== id);
      this.updateLocalStorage(this.locations);
    },

    updateLocalStorage(arr: ILocationList[]) {
      localStorage.setItem('weather-widget', JSON.stringify(arr.map((loc) => {
        delete loc.ref;
        return loc;
      })));
    },

    async getLocationInfo(latitude: number, longitude: number) {
      return await fetch(api.locationsInfoUrl(latitude, longitude))
    },

    findLocations(search: string) {
      fetch(api.locationsFindUrl(search))
        .then((resp) => resp.json())
        .then((json) => {
          this.searchLocations = json;
        })
    },

    clearSearchLocations() {
      this.searchLocations = [];
    },

    clearSearchLocationsError() {
      this.addingLocationError = '';
    },

    /**
     * There is a small chance of setting the location to arrays twice,
     * so this method delete duplicates of new location
     * @param locationsLengthBefore
     * @param locationsListLengthBefore 
     */
    makeLocationsUnique(locationsLengthBefore: number, locationsListLengthBefore: number) {
      while (locationsLengthBefore + 1 !== this.locations.length) {
        this.locations.shift();
      }
      if (locationsListLengthBefore + 1 !== this.locationsList.length) {
        this.locationsList.shift();
      }
    },

    resortLocationsLists(id: number, draggingElementId: number, location: ILocationList) {
      this.locationsList = [...this.locationsListCopy];
      const dragIdx = this.locationsList.findIndex((loc) => loc.id === draggingElementId);
      const oldElem = this.locationsListCopy[dragIdx];
      this.locationsList[dragIdx] = location;
      this.locationsList[this.locationsListCopy.findIndex((loc) => loc.id === id)!] = oldElem;
    },

    rewriteLocationsCopy() {
      this.locationsListCopy = [ ...this.locationsList ];
      const tmpLocationsCopy = [ ...this.locations ];
      this.locationsList.forEach((location, idx) => {
        let index = tmpLocationsCopy.findIndex((loc) => loc.id === location.id);
        this.locations[idx] = tmpLocationsCopy[index];
      });
    },
  },
});