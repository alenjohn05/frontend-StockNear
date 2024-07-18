import { userRegion, getCache, setCache } from '$lib/store';


const usRegion = ['cle1','iad1','pdx1','sfo1'];
let apiKey = import.meta.env.VITE_STOCKNEAR_API_KEY;
let apiURL;

userRegion.subscribe(value => {

  if (usRegion.includes(value)) {
    apiURL = import.meta.env.VITE_USEAST_API_URL;
  } else {
    apiURL = import.meta.env.VITE_EU_API_URL;
  }
});



export const load = async () => {
  const getCryptoNews = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'getCryptoNews');
    if (cachedData) {
      output = cachedData;
    } else {
      const postData = {
        ticker: ''
      };

      // make the POST request to the endpoint
      const response = await fetch(apiURL + '/crypto-news', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json", "X-API-KEY": apiKey
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'getCryptoNews'
      setCache('', output, 'getCryptoNews');
    }

    return output;
  };

  // Make sure to return a promise
  return {
    getCryptoNews: await getCryptoNews()
  };
};