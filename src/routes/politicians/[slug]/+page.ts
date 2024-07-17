import { userRegion, getCache, setCache } from "$lib/store";

const usRegion = ["cle1", "iad1", "pdx1", "sfo1"];

let apiURL;
let backendURL = import.meta.env.VITE_BACKEND_API_URL;
let images = {};

userRegion.subscribe((value) => {
  if (usRegion?.includes(value)) {
    apiURL = import.meta.env.VITE_USEAST_API_URL;
  } else {
    apiURL = import.meta.env.VITE_EU_API_URL;
  }
});

// Function to load images only when they are viewed
async function loadImages() {
  const imageFiles = import.meta.glob("$lib/images/senator/*.png");
  const imagesPromises = [];

  for (const [path, resolver] of Object?.entries(imageFiles)) {
    const imageNameMatch = path.match(/\/([^/]+)\.png$/);
    if (imageNameMatch && imageNameMatch[1] !== "default-avatar") {
      imagesPromises?.push(
        resolver()?.then((module) => {
          images[imageNameMatch[1]] = module.default;
        })
      );
    }
  }

  await Promise?.all(imagesPromises);
}

export const load = async ({ params }) => {
  const getInstitutionalInvestor = async () => {
    let output;

    // Get cached data for the specific tickerID
    const cachedData = getCache(params.slug, "getInstitutionalInvestor");
    if (cachedData) {
      output = cachedData;
    } else {
      const response = await fetch(
        backendURL +
          `/Get_Ready_ClientWatchlist_more?investorID=${params.slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const output = await response.json();
      await loadImages();
      setCache(params.slug, output, "getInstitutionalInvestor");
    }
    return output;
  };

  // Make sure to return a promise
  return {
    getInstitutionalInvestor: await getInstitutionalInvestor()
  };
};
