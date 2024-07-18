import { userRegion, getCache, setCache } from '$lib/store';


const usRegion = ['cle1','iad1','pdx1','sfo1'];

let apiURL;
let backendURL = import.meta.env.VITE_BACKEND_API_URL;
userRegion.subscribe(value => {

  if (usRegion.includes(value)) {
    apiURL = import.meta.env.VITE_USEAST_API_URL;
  } else {
    apiURL = import.meta.env.VITE_EU_API_URL;
  }
});



export const load = async () => {
  const getStockSplitsCalendar = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'getStockSplitsCalendar');
    if (cachedData) {
      output = cachedData;
    } else {
      

      // make the POST request to the endpoint
      const response = await fetch(apiURL + '/stock-splits-calendar', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'getStockSplitsCalendar'
      setCache('', output, 'getStockSplitsCalendar');
    }

    return output;
  };
  const getStockSplitsCalendarMain = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'getStockSplitsCalendarMain');
    if (cachedData) {
      output = cachedData;
    } else {
      

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/get_daily_corporate_actions?EventType=12', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'getStockSplitsCalendarMain'
      setCache('', output, 'getStockSplitsCalendarMain');
    }

    return output;
  };

  // Make sure to return a promise
  return {
    getStockSplitsCalendar: await getStockSplitsCalendar(),
    getStockSplitsCalendarMain: await getStockSplitsCalendarMain()
  };
};