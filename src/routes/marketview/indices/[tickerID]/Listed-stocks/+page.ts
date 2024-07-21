import { getCache, setCache } from "$lib/store";
import { displayCompanyName, stockTicker, assetType, isOpen, isAfterMarketClose, isBeforeMarketOpen, isWeekend, stockSecurity } from '$lib/store';


const backendURL = import.meta.env.VITE_BACKEND_API_URL;

const periodTypes = [
  { ID: 1, Label: "1D", ChartPeriodCode: "1D" },
  { ID: 7, Label: "1W", ChartPeriodCode: "1W" },
  { ID: 30, Label: "1M", ChartPeriodCode: "1M" },
  { ID: 90, Label: "3M", ChartPeriodCode: "3M" },
  { ID: 180, Label: "6M", ChartPeriodCode: "6M" },
  { ID: 365, Label: "1Y", ChartPeriodCode: "1Y" },
  { ID: 730, Label: "2Y", ChartPeriodCode: "2Y" },
  { ID: 1825, Label: "5Y", ChartPeriodCode: "5Y" }
];

const fetchSecurityDetails = async (url: string) => {
  let output;
  const cachedData = getCache(url, 'getListStockDetails');
  if (cachedData) {
    output = cachedData;
  } else {
    const response = await fetch(backendURL + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    output = await response.json();
    setCache(url, output, 'getListStockDetails');

  }
  return output;
}

export const load = async ({ params }) => {
  const [Get_Composed_IndexParts, Get_Composed_Index_Part_Gainers, Get_Composed_Index_Part_losers] = await Promise.all([
    fetchSecurityDetails(`/index/Get_Composed_IndexParts?SecurityID=${params.tickerID}`),
    fetchSecurityDetails(`/index/Get_Composed_Index_Part_Gainers?SecurityID=${params.tickerID}&priceChangePeriodType=1`),
    fetchSecurityDetails(`/index/Get_Composed_Index_Part_losers?SecurityID=${params.tickerID}&priceChangePeriodType=1`),
  ]);

  return {
    Get_Composed_IndexParts,
    Get_Composed_Index_Part_Gainers,
    Get_Composed_Index_Part_losers,
    periodTypes
  };
};