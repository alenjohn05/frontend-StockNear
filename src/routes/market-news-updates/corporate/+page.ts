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
  const Get_corporate_news = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'Get_corporate_news');
    if (cachedData) {
      output = cachedData;
    } else {
      const postData = {
        ticker: ''
      };

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/news/corporate-news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'Get_corporate_news'
      setCache('', output, 'Get_corporate_news');
    }

    return output;
  };

  // Make sure to return a promise
  return {
    Get_corporate_news: await Get_corporate_news()
  };
};