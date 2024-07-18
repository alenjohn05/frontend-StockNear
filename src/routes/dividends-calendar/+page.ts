import { getCache, setCache } from '$lib/store';



let backendURL = import.meta.env.VITE_BACKEND_API_URL;
export const load = async () => {
  const getDividendCalenderDetails = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'getDividendCalenderDetails');
    if (cachedData) {
      output = cachedData;
    } else {
      

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/latest/get_daily_corporate_actions?EventType=9', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'getDividendCalenderDetails'
      setCache('', output, 'getDividendCalenderDetails');
    }

    return output;
  };

  // Make sure to return a promise
  return {
    getDividendCalenderDetails: await getDividendCalenderDetails()
  };
};