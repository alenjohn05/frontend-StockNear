import {userRegion, getCache, setCache } from '$lib/store';
import { redirect } from '@sveltejs/kit';


const usRegion = ['cle1','iad1','pdx1','sfo1'];

let apiURL:string;
let backendURL =  import.meta.env.VITE_BACKEND_API_URL;

userRegion.subscribe(value => {

  if (usRegion.includes(value)) {
    apiURL = import.meta.env.VITE_USEAST_API_URL;
  } else {
    apiURL = import.meta.env.VITE_EU_API_URL;
  }
});


export const load = async ({ parent}) => {
  const data = await parent();
  if (!data?.user) {
		redirect(303, '/');
	}
  
  const getDailyGainerLoserActive = async () => {
    let output;
    const cachedData = getCache('', 'getDailyGainerLoserActive');
    if (cachedData) {
      output = cachedData;
    } else {
      const response = await fetch(apiURL + '/market-movers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      output = await response.json();
      setCache('', output, 'getDailyGainerLoserActive');
    }
    return output;
  };

 
  const getlatestRssNews = async () => {
    let output;
    const cachedData = getCache('', 'getlatestRssNews');
    if (cachedData) {
      output = cachedData;
    } else {
      const response = await fetch(backendURL + '/get_live_latest_news', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      output = await response.json();
      setCache('', output, 'getlatestRssNews');
    }
    return output;
  };



  const getDailyGainerLoserActiveOcto = async () => {
    let output;
    const cachedData = getCache('', 'getDailyGainerLoserActiveOcto');
    if (cachedData) {
      output = cachedData;
    } else {
      const response = await fetch(backendURL + '/latest-market-movers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      output = await response.json();
      setCache('', output, 'getDailyGainerLoserActiveOcto');
    }
    return output;
  };
  // Make sure to return a promise
  return {
    getDailyGainerLoserActive: await getDailyGainerLoserActive(),
    getlatestRssNews: await getlatestRssNews(),
    getDailyGainerLoserActiveOcto: await getDailyGainerLoserActiveOcto(),
  };
};