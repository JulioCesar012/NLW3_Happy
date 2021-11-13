import { fetchLocalMapBox } from '../services/apiMapBox';

const loadOptions = async (inputValue: any, callback: any) => {
  const response = await fetchLocalMapBox(inputValue);
  let places: any = [];
  if (inputValue.length < 5) return;
  response.features.map((item: any) => {
    places.push({
      label: item.place_name,
      value: item.place_name,
      coords: item.center,
      place: item.place_name,
    });
  });
  callback(places);
};

export default loadOptions;
