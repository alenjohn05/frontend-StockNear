import { userRegion, getCache, setCache } from "$lib/store";
import defaultAvatar from "$lib/images/senator/default-avatar.png";
import { getPartyForPoliticians } from "$lib/utils";

const usRegion = ["cle1", "iad1", "pdx1", "sfo1"];

let apiURL;
let backendURL = import.meta.env.VITE_BACKEND_API_URL;
userRegion.subscribe((value) => {
  if (usRegion?.includes(value)) {
    apiURL = import.meta.env.VITE_USEAST_API_URL;
  } else {
    apiURL = import.meta.env.VITE_EU_API_URL;
  }
});

let images = {};
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

  await Promise.all(imagesPromises);
}

function filterInvalidEntries(data: any[]) {
  return data?.filter(
    (item) =>
      item.ClientCount != null &&
      item.HoldingValue != null &&
      item.ActiveStockCount != null &&
      item.TopPeformingC3MZG != null
  );
}

export const load = async () => {
  const GetIndividualInvestors = async () => {
    let output:any;

    // Get cached data for the specific tickerID
    const cachedData = getCache("", "GetIndividualInvestors");
    if (cachedData) {
      output = cachedData;
    } else {
      const response = await fetch(
        backendURL + "/investor/Get-individual-invester-list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      output = await response.json();
      await loadImages();
      setCache("", output, "GetIndividualInvestors");
    }

    console.log(output?.results);

    return output?.results;
  };

  // Make sure to return a promise
  return {
    GetIndividualInvestors: await GetIndividualInvestors()
  };
};
