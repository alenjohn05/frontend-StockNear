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
  const getMarketMajorNews = async () => {
    let output;
    const cachedData = getCache("", "getMarketMajorNews");
    if (cachedData) {
      output = cachedData;
    } else {
      const response = await fetch(backendURL + "/get-major-news", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      output = await response.json();
      setCache("", output, "getMarketMajorNews");
    }
    return output;
  };

  // Make sure to return a promise
  return {
    getMarketMajorNews: await getMarketMajorNews()
  };
};