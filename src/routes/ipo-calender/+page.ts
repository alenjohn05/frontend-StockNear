import { getCache, setCache } from "$lib/store";

let backendURL = import.meta.env.VITE_BACKEND_API_URL;
export const load = async () => {
  const Get_Ongoing_IPOs = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache("", "Get_Ongoing_IPOs");
    if (cachedData) {
      output = cachedData;
    } else {
      // make the POST request to the endpoint
      const response = await fetch(backendURL + "/ipo/Get_Ongoing_IPOs", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      output = await response.json();
      console.log(output);

      // Cache the data for this specific tickerID with a specific name 'Get_Ongoing_IPOs'
      setCache("", output, "Get_Ongoing_IPOs");
    }

    return output;
  };

  const Get_Upcoming_IPOs = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache("", "Get_Upcoming_IPOs");
    if (cachedData) {
      output = cachedData;
    } else {
      // make the POST request to the endpoint
      const response = await fetch(
        backendURL + "/ipo/Get_Upcoming_IPOs",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      output = await response.json();
      console.log(output);

      // Cache the data for this specific tickerID with a specific name 'Get_Upcoming_IPOs'
      setCache("", output, "Get_Upcoming_IPOs");
    }

    return output;
  };
  const Get_Listed_IPOs = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache("", "Get_Listed_IPOs");
    if (cachedData) {
      output = cachedData;
    } else {
      // make the POST request to the endpoint
      const response = await fetch(
        backendURL + "/ipo/Get_Listed_IPOs",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      output = await response.json();
      console.log(output);

      // Cache the data for this specific tickerID with a specific name 'Get_Listed_IPOs'
      setCache("", output, "Get_Listed_IPOs");
    }

    return output;
  };

  // Make sure to return a promise
  return {
    Get_Ongoing_IPOs: await Get_Ongoing_IPOs(),
    Get_Upcoming_IPOs: await Get_Upcoming_IPOs(),
    Get_Listed_IPOs: await Get_Listed_IPOs()
  };
};
