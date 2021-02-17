const CountryReducer = (
    state = {
      countries: []
    },
    action
  ) => {
    switch (action.type) {
      case "GET_COUNTRIES":
        return {
          ...state,
          countries: [...action.data],
        };
      default:
        return {
          ...state,
        };
    }
  };
  
  export default CountryReducer;
  