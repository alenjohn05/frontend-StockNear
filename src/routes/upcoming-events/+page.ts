import { getCache, setCache } from '$lib/store';



let backendURL = import.meta.env.VITE_BACKEND_API_URL;
export const load = async () => {
  const GetDailyEvents = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'GetDailyEvents');
    if (cachedData) {
      output = cachedData;
    } else {
      

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/latest/get_daily_events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'GetDailyEvents'
      setCache('', output, 'GetDailyEvents');
    }

    return output;
  };
  const GetDailyBSEAnnouncements = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'GetDailyBSEAnnouncements');
    if (cachedData) {
      output = cachedData;
    } else {
      

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/latest/bse-Announcements', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'GetDailyBSEAnnouncements'
      setCache('', output, 'GetDailyBSEAnnouncements');
    }

    return output;
  };

  const GetDailyNSEAnnouncements = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'GetDailyNSEAnnouncements');
    if (cachedData) {
      output = cachedData;
    } else {
      

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/latest/nse-Announcements', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'GetDailyNSEAnnouncements'
      setCache('', output, 'GetDailyNSEAnnouncements');
    }

    return output;
  };



  // Make sure to return a promise
  return {
    GetDailyEvents: await GetDailyEvents(),
    GetDailyBSEAnnouncements: await GetDailyBSEAnnouncements(),
    GetDailyNSEAnnouncements: await GetDailyNSEAnnouncements(),
  };
};