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
      try {
        localStorage.setItem('weather-widget', JSON.stringify(newLocation));
        this.locations = newLocation;
        this.locationsList = newLocation;
        this.locationsListCopy = newLocation;
        this.isLoadingLocations = false;
      } catch (error: any) {
        this.isLoadingLocations = false;
        throw new Error("Error while setting initial location: " + error.message);
      }
    },

    async getInitialLocation() {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        const locationRequest = await this.getLocationInfo(latitude, longitude);
        if (locationRequest.ok) {
          const json = await locationRequest.json();
          this.setInitialLocation([json]);
        } else {
          this.isLoadingLocations = false;
          throw new Error("Error while fetching initial location.");
        }
      } catch (error: any) {
        this.isLoadingLocations = false;
        throw new Error("Error while getting initial location: " + error.message);
      }
    },

    async getLocations() {
      try {
        const myLocations = localStorage.getItem('weather-widget');
        this.isLoadingLocations = true;
        if (myLocations === null || myLocations.length <= 2) {
          await this.getInitialLocation();
        } else {
          const locations: ILocationList[] = JSON.parse(myLocations);
          this.locationsList = locations;
          this.locationsListCopy = locations;
          for (const [idx, location] of locations.entries()) {
            await this.getNewLocationInfo(idx, location);
          }
          this.isLoadingLocations = false;
        }
      } catch (error: any) {
        this.isLoadingLocations = false;
        throw new Error("Error while getting locations: " + error.message);
      }
    },

    async getNewLocationInfo(id: number, location: ILocation) {
      try {
        const request = await this.getLocationInfo(location.coord.lat, location.coord.lon);
        if (request.ok) {
          const json = await request.json();
          this.locations.push(json);
        } else {
          this.isLoadingLocations = false;
          throw new Error("Error while fetching new location info.");
        }
      } catch (error: any) {
        this.isLoadingLocations = false;
        throw new Error("Error while getting new location info: " + error.message);
      }
    },

    async addLocation(idx: number) {
      try {
        const newLocation = this.searchLocations.find((_, index) => idx === index)!;
        const locationRequest = await this.getLocationInfo(newLocation.lat, newLocation.lon);
        if (locationRequest.ok) {
          const json = await locationRequest.json();
          const locationsLengthBefore = this.locations.length;
          const locationsListLengthBefore = this.locationsList.length;
          this.locations.unshift({ ...json });
          this.locationsList.unshift({ ...json });
          this.makeLocationsUnique(locationsLengthBefore, locationsListLengthBefore)
          this.locationsListCopy = [...this.locationsList];
          this.updateLocalStorage(this.locations);
        } else {
          throw new Error("Error while fetching location data.");
        }
      } catch (error: any) {
        this.addingLocationError = error.message;
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
      return await fetch(api.locationsInfoUrl(latitude, longitude));
    },

    async findLocations(search: string) {
      try {
        const response = await fetch(api.locationsFindUrl(search));
        if (response.ok) {
          const json = await response.json();
          this.searchLocations = json;
        } else {
          throw new Error("Error while searching locations.");
        }
      } catch (error: any) {
        throw new Error("Error while finding locations: " + error.message);
      }
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
      this.locationsListCopy = [...this.locationsList];
      const tmpLocationsCopy = [...this.locations];
      this.locationsList.forEach((location, idx) => {
        let index = tmpLocationsCopy.findIndex((loc) => loc.id === location.id);
        this.locations[idx] = tmpLocationsCopy[index];
      });
    },
  },
});