const locationsInfoUrl = (latitude: number, longitude: number) => `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.VUE_APP_API_KEY}&units=metric`;
const locationsFindUrl = (search: string) => `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=3&appid=${process.env.VUE_APP_API_KEY}`;

export default { locationsInfoUrl, locationsFindUrl }