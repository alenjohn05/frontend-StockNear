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
  const Get_results_News = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'Get_results_News');
    if (cachedData) {
      output = cachedData;
    } else {
      const postData = {
        ticker: ''
      };

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/results-announcements-news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'Get_results_News'
      setCache('', output, 'Get_results_News');
    }

    return output;
  };

  // Make sure to return a promise
  return {
    Get_results_News: await Get_results_News()
  };
};