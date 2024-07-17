import { userRegion, getCache, setCache } from '$lib/store';


const usRegion = ['cle1','iad1','pdx1','sfo1'];

let apiURL;

userRegion.subscribe(value => {

  if (usRegion.includes(value)) {
    apiURL = import.meta.env.VITE_USEAST_API_URL;
  } else {
    apiURL = import.meta.env.VITE_EU_API_URL;
  }
});

let backendURL = import.meta.env.VITE_BACKEND_API_URL;

export const load = async () => {
  const Get_mutual_fund = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'Get_mutual_fund');
    if (cachedData) {
      output = cachedData;
    } else {
      const postData = {
        ticker: ''
      };

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/mutual-fund-news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'Get_mutual_fund'
      setCache('', output, 'Get_mutual_fund');
    }

    return output;
  };

  // Make sure to return a promise
  return {
    Get_mutual_fund: await Get_mutual_fund()
  };
};