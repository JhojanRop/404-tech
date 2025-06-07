import { colombia_locations } from "@/lib/data/colombia_locations"

const getStates = () => {
  return colombia_locations.map(state => (state.state));
}

const getCitiesByState = (state: string) => {
  const foundState = colombia_locations.find(s => s.state === state);
  return foundState ? foundState.cities : [];
}

export { getStates, getCitiesByState }