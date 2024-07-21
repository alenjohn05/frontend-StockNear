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



export const load = async ({ params, ...data }) => {


  return {

  };
};