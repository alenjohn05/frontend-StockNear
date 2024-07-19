import { getCache, setCache } from "$lib/store";

let backendURL = import.meta.env.VITE_BACKEND_API_URL;
export const load = async () => {
  const GetForthcomingCorporateActionResults = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache("", "GetForthcomingCorporateActionResults");
    if (cachedData) {
      output = cachedData;
    } else {
      // make the POST request to the endpoint
      const response = await fetch(
        backendURL + "/latest/get_forthcoming_corporateAction_Results",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      output = await response.json();
      console.log(output);

      // Cache the data for this specific tickerID with a specific name 'GetForthcomingCorporateActionResults'
      setCache("", output, "GetForthcomingCorporateActionResults");
    }

    return output;
  };

  const GetRecentReleasedResults = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache("", "GetRecentReleasedResults");
    if (cachedData) {
      output = cachedData;
    } else {
      // make the POST request to the endpoint
      const response = await fetch(
        backendURL +
          "/latest/get_Recent_Released_Results",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      output = await response.json();
      console.log(output);

      // Cache the data for this specific tickerID with a specific name 'GetRecentReleasedResults'
      setCache("", output, "GetRecentReleasedResults");
    }

    return output;
  };

  // Make sure to return a promise
  return {
    GetForthcomingCorporateActionResults:
      await GetForthcomingCorporateActionResults(),
    GetRecentReleasedResults: await GetRecentReleasedResults()
  };
};
