import { getCache, setCache } from '$lib/store';



let backendURL = import.meta.env.VITE_BACKEND_API_URL;
export const load = async () => {
  const getBounsCalenderDetails = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'getBounsCalenderDetails');
    if (cachedData) {
      output = cachedData;
    } else {
      

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/latest/get_daily_corporate_actions?EventType=8', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'getBounsCalenderDetails'
      setCache('', output, 'getBounsCalenderDetails');
    }

    return output;
  };
  const getRightsCalenderDetails = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'getRightsCalenderDetails');
    if (cachedData) {
      output = cachedData;
    } else {
      

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/latest/get_daily_corporate_actions?EventType=10', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'getRightsCalenderDetails'
      setCache('', output, 'getRightsCalenderDetails');
    }

    return output;
  };

  // Make sure to return a promise
  return {
    getBounsCalenderDetails: await getBounsCalenderDetails(),
    getRightsCalenderDetails: await getRightsCalenderDetails()
  };
};