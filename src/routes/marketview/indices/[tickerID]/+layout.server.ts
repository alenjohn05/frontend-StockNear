import { getCache, setCache } from '$lib/store.js';
import fs from 'fs/promises';
import path from 'path';
import { format } from 'date-fns';

const usRegion = ['cle1', 'iad1', 'pdx1', 'sfo1'];

let companyName;
let DefaultListingID;
let DefaultExchange;
let basicIndexDetails;
let apiKey = import.meta.env.VITE_STOCKNEAR_API_KEY;
let backendURL = import.meta.env.VITE_BACKEND_API_URL;



function cleanString(input) {
  // Define a list of substrings to remove (case insensitive)
  const substringsToRemove = [
    'Depositary',
    'Inc.',
    'Incorporated',
    'Holdings',
    'Corporation',
    'Corporations',
    'LLC',
    'Holdings plc American Depositary Shares',
    'Holding Corporation',
    'Oyj',
    'Company',
    'The',
    'plc',
  ];

  // Create a regular expression pattern that matches any of the substrings surrounded by word boundaries
  const pattern = new RegExp(`\\b(${substringsToRemove?.join('|')})\\b|,`, 'gi');

  // Use the replace method to remove the specified substrings and commas, then trim the result
  return input?.replace(pattern, '')?.trim();
}

const fetchMainTickerMaindata = async (tickerID: string) => {
  let output;
  const cachedData = getCache('', `GetEquityMajorDetails_${tickerID}`);
  if (cachedData) {
    output = cachedData;
  } else {
    const response = await fetch(backendURL + `/index/Get_Latest_Security_Info?SecurityID=${tickerID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    output = await response.json();
    setCache('', output, `GetEquityMajorDetails_${tickerID}`);
  }
  return output;
};
const fetchSecurityDetails = async (url: string) => {
  let output;
  const response = await fetch(backendURL + url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  output = await response.json();
  return output;
}

const loadDailyDataContent = async () => {
  try {
    let output = (await import('$lib/sample/price.json'))?.default;
    return output;
  } catch (error) {
    console.error(`Error loading data from :`, error);
    throw error;
  }
}

const fetchData = async (apiURL, endpoint, ticker) => {

  const postData = {
    ticker: ticker
  };

  const response = await fetch(apiURL + endpoint, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json", "X-API-KEY": apiKey
    },
    body: JSON.stringify(postData)
  });

  const output = await response?.json();

  if (endpoint === '/stockdeck') {
    companyName = cleanString(output?.at(0)?.companyName);
  }

  return output;
};

const fetchWatchlist = async (fastifyURL, userId) => {

  const postData = { 'userId': userId }
  const response = await fetch(fastifyURL + '/all-watchlists', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });


  const output = (await response?.json())?.items;
  return output;
}

async function fetchPortfolio(fastifyURL, userId) {
  const postData = { 'userId': userId };

  const response = await fetch(fastifyURL + '/get-portfolio-data', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });

  const output = (await response?.json())?.items;

  return output
}

async function fetchCommunitySentiment(pb, ticker, cookies) {
  let alreadyVoted;
  const cookieVote = cookies?.get('community-sentiment-' + ticker);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const startDate = today.toISOString().split('T')[0];
  const endDate = tomorrow.toISOString().split('T')[0];

  const output = await pb.collection("sentiment").getFullList({
    filter: `ticker="${ticker}" && created >= "${startDate}" && created < "${endDate}"`
  });

  if (cookieVote) {
    alreadyVoted = cookieVote;
  }

  if (output?.length !== 0) {

    return { 'alreadyVoted': alreadyVoted, 'sentimentData': output?.at(0) }
  }
  else {
    return { 'alreadyVoted': alreadyVoted, 'sentimentData': {} }
  }

}

export const load = async ({ params, locals, cookies, setHeaders }) => {

  const securityInfo = await fetchMainTickerMaindata(params.tickerID)
  const userRegion = locals?.region?.split("::")[0];


  let apiURL;

  let fastifyURL;

  if (usRegion?.includes(userRegion)) {
    apiURL = import.meta.env.VITE_USEAST_API_URL;
    fastifyURL = import.meta.env.VITE_USEAST_FASTIFY_URL;
  } else {
    apiURL = import.meta.env.VITE_EU_API_URL;
    fastifyURL = import.meta.env.VITE_EU_FASTIFY_URL;
  };
  DefaultListingID = securityInfo.DefaultListingID
  DefaultExchange = securityInfo.DefaultExchange
  companyName = securityInfo.Name
  basicIndexDetails = securityInfo
  const promises = [
    loadDailyDataContent(),
    fetchSecurityDetails(`/index/Get_Latest_Listing_Price?SecurityListingID=${DefaultListingID}`),
    fetchSecurityDetails(`/index/Get_Composed_IndexParts?SecurityID=${params.tickerID}`),
    fetchSecurityDetails(`/index/Get_Composed_Index_Part_Gainers?SecurityID=${params.tickerID}&priceChangePeriodType=1`),
    fetchSecurityDetails(`/index/Get_Composed_Index_Part_losers?SecurityID=${params.tickerID}&priceChangePeriodType=1`),
    fetchSecurityDetails(`/index/Get_Composed_Index_deliveries?SecurityID=${params.tickerID}&ExchangeID=${DefaultExchange}`),
    fetchSecurityDetails(`/index/get_news_items_by_security?SecurityID=${params.tickerID}`),
    fetchSecurityDetails(`/index/get_corporate_actions_security?SecurityID=${params.tickerID}`),
    fetchSecurityDetails(`/index/get_Technical_Performance_Benchmark?SecurityListingID=${DefaultListingID}`),
    fetchSecurityDetails(`/index/get_Technical_indicators?SecurityListingID=${DefaultListingID}`),
    fetchSecurityDetails(`/index/get_ExpiryDate_ForListing?SecurityListingID=${DefaultListingID}`),
    fetchSecurityDetails(`/index/get_Market_Lot_for_ForListing?SecurityListingID=${DefaultListingID}`),
    fetchSecurityDetails(`/index/get_CumulativeFuture_OpenInterest?SecurityListingID=${DefaultListingID}`),
    fetchSecurityDetails(`/index/GetCumulative_Future_OpenInterest_by_date?date=${format(new Date(), "yyyy-MM-dd")}&SecurityListingID=${DefaultListingID}`),
    fetchSecurityDetails(`/index/Get-OptionChain_combined?SecurityListingID=${DefaultListingID}`),
    fetchWatchlist(fastifyURL, locals?.user?.id),
    fetchPortfolio(fastifyURL, locals?.user?.id),
    fetchCommunitySentiment(locals?.pb, params.tickerID, cookies)
  ];

  const [
    Get_Price_details,
    Get_Latest_Listing_Price,
    Get_Composed_IndexParts,
    Get_Composed_Index_Part_Gainers,
    Get_Composed_Index_Part_losers,
    Get_Composed_Index_deliveries,
    get_news_items_by_security,
    get_corporate_actions_security,
    get_Technical_Performance_Benchmark,
    get_Technical_indicators,
    get_ExpiryDate_ForListing,
    get_Market_Lot_for_ForListing,
    get_CumulativeFuture_OpenInterest,
    GetCumulative_Future_OpenInterest_by_date,
    Get_OptionChain_combined,
    getUserWatchlist,
    getUserPortfolio,
    getCommunitySentiment,
  ] = await Promise.all(promises);


  setHeaders({
    'cache-control': 'public, max-age=300' //Cache data for 5 min
  });


  return {
    Get_Price_details,
    Get_Latest_Listing_Price,
    Get_Composed_IndexParts,
    Get_Composed_Index_Part_Gainers,
    Get_Composed_Index_Part_losers,
    get_news_items_by_security,
    get_corporate_actions_security,
    get_Technical_Performance_Benchmark,
    get_ExpiryDate_ForListing,
    get_Market_Lot_for_ForListing,
    get_CumulativeFuture_OpenInterest,
    GetCumulative_Future_OpenInterest_by_date,
    Get_OptionChain_combined,
    getUserWatchlist,
    getUserPortfolio,
    getCommunitySentiment,
    companyName,
    DefaultListingID,
    DefaultExchange,
    basicIndexDetails
  };


};
