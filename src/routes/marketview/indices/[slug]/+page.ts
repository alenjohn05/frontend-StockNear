import { getCache, setCache } from "$lib/store";

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

async function fetchIndicesGainersLossersData(exchange: string, period: number = 1) {
  const cacheKey = `GetMajorIndicesGainerLosser${exchange}${period}`;
  const cachedData = getCache("", cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(
    `${backendURL}/index/Get-Latest-IndexQuotes_gainers_lossers?priceChangePeriodType=${period}&exchange=${exchange}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }
  );

  const data = await response.json();
  setCache("", data, cacheKey);
  return data;
}

async function fetchIndicesData(exchange: string, period: number = 1) {
  const cacheKey = `GetMajorIndices${exchange}${period}`;
  const cachedData = getCache("", cacheKey);

  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(
    `${backendURL}/index/latest_index_quotes?price_change_period=${period}&exchange=${exchange}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    }
  );

  const data = await response.json();
  setCache("", data, cacheKey);
  return data;
}

export const load = async ({ params }) => {
  const {slug} = params
  const [nseData, bseData, nseGainerLosserData, bseGainerLosserData] = await Promise.all([
    fetchIndicesData("NSE"),
    fetchIndicesData("BSE"),
    fetchIndicesGainersLossersData("NSE"),
    fetchIndicesGainersLossersData("BSE"),
  ]);

  return {
    GetMajorIndicesNSE: nseData,
    GetMajorIndicesBSE: bseData,
    GetMajorIndicesNSEGainersLossersData: nseGainerLosserData,
    GetMajorIndicesBSEGainersLossersData: bseGainerLosserData,
    periodTypes
  };
};