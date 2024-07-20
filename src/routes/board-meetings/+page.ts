import { getCache, setCache } from '$lib/store';



let backendURL = import.meta.env.VITE_BACKEND_API_URL;
export const load = async () => {
  const GetBoardMeetings = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache('', 'GetBoardMeetings');
    if (cachedData) {
      output = cachedData;
    } else {
      

      // make the POST request to the endpoint
      const response = await fetch(backendURL + '/latest/board-meetings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      output = await response.json();

      // Cache the data for this specific tickerID with a specific name 'GetBoardMeetings'
      setCache('', output, 'GetBoardMeetings');
    }

    return output;
  };

  // Make sure to return a promise
  return {
    GetBoardMeetings: await GetBoardMeetings(),
  };
};