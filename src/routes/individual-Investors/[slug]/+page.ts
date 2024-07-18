import { getCache, setCache } from "$lib/store";

const usRegion = ["cle1", "iad1", "pdx1", "sfo1"];
let backendURL = import.meta.env.VITE_BACKEND_API_URL;
export const load = async ({ params }) => {
  const getIndividualInstitutionalInvestor = async () => {
    let output;
    const cachedData = getCache(
      params.slug,
      "getIndividualInstitutionalInvestor"
    );
    if (cachedData) {
      output = { ...cachedData };
    } else {
      const response = await fetch(
        backendURL +
          `/investor/Get-individual-invester-details?individual_slug=${params.slug}&quater=202312`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      output = await response.json();
      setCache(params.slug, output, "getIndividualInstitutionalInvestor");
      console.log(output)
    }
    return { ...output };
  };

  return {
    getIndividualInstitutionalInvestor:
      await getIndividualInstitutionalInvestor()
  };
};
