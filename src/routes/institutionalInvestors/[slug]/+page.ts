import { userRegion, getCache, setCache } from "$lib/store";
import { redirect } from "@sveltejs/kit";

const usRegion = ["cle1", "iad1", "pdx1", "sfo1"];
let backendURL = import.meta.env.VITE_BACKEND_API_URL;
export const load = async ({ params }) => {
  const getInstitutionalInvestor = async () => {
    let output;
    const cachedData = getCache(params.slug, "getInstitutionalInvestor");
    const cacheDataAllInstitutionalInvestor: any[] | undefined = getCache(
      "",
      "GetInsititutionalInvestors"
    );
    if (!cacheDataAllInstitutionalInvestor) {
      throw redirect(307, "/institutionalInvestors");
    } else {
      const investordata = cacheDataAllInstitutionalInvestor?.filter(
        (each: any) => each.ID === parseInt(params.slug)
      );
      if (cachedData) {
        output = { ...cachedData, ...investordata[0] };
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
        output = await response.json();
        setCache(params.slug, output, "getInstitutionalInvestor");
      }
      return {...output, ...investordata[0]};
    }
  };

  return {
    getInstitutionalInvestor: await getInstitutionalInvestor()
  };
};
