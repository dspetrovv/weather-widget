import { ComponentPublicInstance } from "vue";

interface IWeather {
  description: string;
  icon: string;
  id: number;
  main: string;
}

interface location {
  location: ComponentPublicInstance|Element;
}

interface IWind {
  speed: number;
  deg: number;
  gust?: number;
}

interface ILocation {
  id: number;
  base?: string;
  clouds?: {
    all: number
  };
  cod?: number;
  coord: {
    lon: number,
    lat: number
  };
  dt?: number;
  main?: {
    feels_like: number,
    grnd_level: number,
    humidity: number,
    pressure: number,
    sea_level: number,
    temp: number,
    temp_max: number,
    temp_min: number,
  };
  name: string;
  sys?: {
    country: string,
    id: number,
    sunrise: number,
    sunset: number,
    type: number,
  };
  timezone?: number;
  visibility: number;
  weather: IWeather[];
  wind: IWind;
}

interface ILocationList extends ILocation {
  ref: location|ComponentPublicInstance|any;
}

interface ISearchLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
}

export { ILocation, ILocationList, ISearchLocation, IWeather, IWind };