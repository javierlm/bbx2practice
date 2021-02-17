import { makeGetFetch } from "./makeFetch";

const CountriesUrl = "http://localhost:8080/api/countries";

const getAllCountries = () => {
    return makeGetFetch(CountriesUrl);
  };

export default getAllCountries;
