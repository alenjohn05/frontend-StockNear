import { getCache, setCache } from "$lib/store";

let backendURL = import.meta.env.VITE_BACKEND_API_URL;

export const load = async () => {
  const getMarketMajorNews = async () => {
    let output;
    const cachedData = getCache("", "getMarketMajorNews");
    if (cachedData) {
      output = cachedData;
    } else {
      const response = await fetch(backendURL + "/news/get-major-news", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      output = await response.json();
      setCache("", output, "getMarketMajorNews");
      console.log(output)
    }
    return output;
  };
  return {
    getMarketMajorNews: await getMarketMajorNews()
  };
};
