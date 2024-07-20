<script lang="ts">
  import InfiniteLoading from "$lib/components/InfiniteLoading.svelte";
  import ScrollToTop from "$lib/components/ScrollToTop.svelte";
  import UpgradeToPro from "$lib/components/UpgradeToPro.svelte";
  import { numberOfUnreadNotification } from "$lib/store";
  import { abbreviateNumber } from "$lib/utils.js";
  import { format } from "date-fns";
  import { onMount } from "svelte";
  import debounce from "lodash.debounce";

  interface IPO {
    SecurityName?: string;
    [key: string]: any;
    // Add other properties as needed
  }

  interface TabItem {
    id: string;
    label: string;
  }

  export let data: {
    Get_Listed_IPOs?: IPO[];
    Get_Ongoing_IPOs?: IPO[];
    Get_Upcoming_IPOs?: IPO[];
  };

  let listedIpos: IPO[] = data?.Get_Listed_IPOs ?? [];
  let onGoing_IPOs: IPO[] = data?.Get_Ongoing_IPOs ?? [];
  let upcoming_ipos: IPO[] = data?.Get_Upcoming_IPOs ?? [];
  let displayList: IPO[] = [];
  let rawData: IPO[] = onGoing_IPOs;
  let isLoaded = false;

  async function handleScroll() {
    if (filterQuery.length === 0) {
      const scrollThreshold = document.body.offsetHeight * 0.8;
      const isBottom = window.innerHeight + window.scrollY >= scrollThreshold;
      if (isBottom && displayList.length !== rawData.length) {
        const nextIndex = displayList.length;
        const filteredNewResults = rawData.slice(nextIndex, nextIndex + 20);
        displayList = [...displayList, ...filteredNewResults];
      }
    }
  }

  let error: string | null = null;
  onMount(() => {
    const loadData = async () => {
      try {
        displayList = rawData?.slice(0, 20) ?? [];
        isLoaded = true;
      } catch (e) {
        error = "Error loading board meetings data. Please try again later.";
        console.error("Error loading data:", e);
      }
    };
    loadData();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  let filterQuery = "";
  let activeTab: string = "ONGOING";

  const tabs: TabItem[] = [
    { id: "ONGOING", label: "Ongoing IPOs" },
    { id: "LISTED", label: "Listed IPOs" },
    { id: "UPCOMING", label: "Upcoming IPOs" },
  ];

  function setActiveTab(tabId: string) {
    activeTab = tabId;
    if (tabId === "ONGOING") {
      rawData = onGoing_IPOs;
      displayList = onGoing_IPOs?.slice(0, 20) ?? [];
    } else if (tabId === "UPCOMING") {
      rawData = upcoming_ipos;
      displayList = upcoming_ipos?.slice(0, 20) ?? [];
    } else {
      rawData = listedIpos;
      displayList = listedIpos?.slice(0, 20) ?? [];
    }
  }

  const debouncedHandleInput = debounce((event: Event) => {
    filterQuery = (event.target as HTMLInputElement).value?.toLowerCase();
    filterData();
  }, 300);

  function filterData() {
    if (filterQuery.length !== 0) {
      displayList = rawData.filter((item) => {
        const compName = item?.SecurityName?.toLowerCase();
        return compName?.includes(filterQuery);
      });
    } else {
      displayList = rawData;
    }
  }

  function handleInput(event: Event) {
    debouncedHandleInput(event);
  }

  async function infiniteHandler({
    detail: { loaded, complete },
  }: {
    detail: { loaded: () => void; complete: () => void };
  }) {
    if (displayList.length === rawData.length) {
      complete();
    } else {
      if (filterQuery.length === 0) {
        const nextIndex = displayList.length;
        const newArticles = rawData.slice(nextIndex, nextIndex + 5);
        displayList = [...displayList, ...newArticles];
        loaded();
      } else {
        complete();
      }
    }
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} IPO
    Calendar · octopi
  </title>
  <meta
    name="description"
    content={`A list of IPOs on the Indian stock market, with dates, times and estimated revenue and events growth.`}
  />

  <!-- Other meta tags -->
  <meta property="og:title" content={`Events Calendar · octopi`} />
  <meta
    property="og:description"
    content={`A list of IPOs on the Indian stock market, with dates, times and estimated revenue and events growth.`}
  />
  <meta
    property="og:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <meta property="og:type" content="website" />
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Events Calendar · octopi`} />
  <meta
    name="twitter:description"
    content={`A list of IPOs on the Indian stock market, with dates, times and estimated revenue and events growth.`}
  />
  <meta
    name="twitter:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>
{#if !isLoaded}
  <div class="flex justify-center items-center h-64 min-h-screen">
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
    ></div>
  </div>
{:else if error}
  <div
    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 min-h-screen"
    role="alert"
  >
    <strong class="font-bold">Error:</strong>
    <span class="block sm:inline">{error}</span>
  </div>
{:else}
  <section
    class="w-full max-w-7xl m-auto sm:bg-[#0d1117] sm:rounded-xl h-auto pl-10 pr-10 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8"
  >
    <div class="flex flex-row items-start">
      <h1 class="text-3xl sm:text-4xl text-white text-start font-bold mb-5">
        IPO Details
      </h1>
    </div>
    <div class="flex sm:flex-row flex-col items-center justify-between">
      <h1 class="text-sm sm:text-sm text-white text-start mt-5 mb-10">
        Comprehensive Guide to Ongoing, Upcoming, and Listed IPOs
      </h1>
      <div class="bg-[#161b22] mb-10 rounded border border-[#21262d]">
        <label class="flex flex-row items-center">
          <input
            id="modal-search"
            type="search"
            class="text-slate-700 ml-2 text-sm placeholder-gray-400 border-transparent focus:border-transparent focus:ring-0 flex items-center justify-center w-full px-0 py-1 bg-inherit"
            placeholder="Find by company name"
            autocomplete="off"
            bind:value={filterQuery}
            on:input={handleInput}
          />
          <svg
            class="ml-auto mr-5 h-6 w-6 inline-block mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ><path
              fill="#fff"
              d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"
            /></svg
          >
        </label>
      </div>
    </div>
    <ul
      class="flex font-medium text-center text-gray-500 border-b border-[#161b22] dark:border-[#161b22] dark:text-[#161b22]"
    >
      {#each tabs as tab}
        <li class="me-2">
          <button
            class="rounded-t-lg inline-block p-2 text-xs sm:text-sm {activeTab ===
            tab.id
              ? 'border-b border-blue-300 text-white bg-[#161b22] active dark:bg-[#161b22] dark:text-white'
              : 'text-gray-500 bg-[#0d1117] active dark:bg-[#0d1117] dark:text-white'}"
            on:click|preventDefault={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        </li>
      {/each}
    </ul>

    <div
      class=" w-full justify-center m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0 mb-10 min-h-screen"
    >
      {#if activeTab === "ONGOING"}
        <table
          class="border border-[#2f343d] hidden sm:inline-table table-sm table-compact w-full m-auto"
        >
          <thead class="bg-[#161b22] border-b border-[#2f343d]">
            <tr>
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                >Company Name</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Offer Price</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Subscription</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >No of Shares Offered</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Total Bid</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Open Date</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Close Date</th
              >
            </tr>
          </thead>
          <tbody>
            {#each displayList as item, index}
              <!-- row -->
              <tr
                class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#0d1117] border-b border-[#161b22] shake-ticker cursor-pointer"
                ><td class=" text-[#FFBE00] text-xs border-b-[#0d1117]">
                  <a href={"/stocks/" + item?.ID}>{item?.SecurityName}</a>
                </td>
                <td class=" border-b-[#0d1117] text-xs font-bold text-end">
                  {item?.IssuePriceMin} - {item?.IssuePriceMax
                    ? item?.IssuePriceMax
                    : ""}
                </td>
                <td class=" text-[#FFBE00] text-xs border-b-[#0d1117] text-end">
                  {item?.GrandTotal?.toFixed(2)}
                </td>
                <td
                  class="text-xs text-white border-b-[#0d1117] hover:text-blue-500 text-end"
                >
                  {(item?.Total_Nos / 100000).toFixed(2)}
                </td>
                <td
                  class=" text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {(item?.Total_NosBidFor / 100000).toFixed(2)}
                </td>
                <td
                  class=" text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {format(new Date(item?.OpenDate), "dd-MM-yyyy")}
                </td>
                <td
                  class=" text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {format(new Date(item?.CloseDate), "dd-MM-yyyy")}
                </td>
              </tr>
            {/each}
            <InfiniteLoading on:infinite={infiniteHandler} />
          </tbody>
        </table>
        <div class="sm:hidden w-full m-auto mt-4 space-y-4">
          {#each displayList as item}
            <div
              class="bg-[#0d1117] p-4 rounded-md shadow-md border border-[#161b22]"
            >
              <a
                href={"/stocks/" + item?.ID}
                class="text-[#FFBE00] text-lg font-medium"
                >{item?.SecurityName}</a
              >
              <div class="mt-2 text-xs">
                <div class="text-slate-200 flex justify-between">
                  <span>Offer Price:</span>
                  <span
                    >{item?.IssuePriceMin} - {item?.IssuePriceMax
                      ? item?.IssuePriceMax
                      : ""}</span
                  >
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Subscription:</span>
                  <span>{item?.GrandTotal?.toFixed(2)}</span>
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>No of Shares Offered:</span>
                  <span>{(item?.Total_Nos / 100000).toFixed(2)}</span>
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Total Bid:</span>
                  <span>{(item?.Total_NosBidFor / 100000).toFixed(2)}</span>
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Open Date:</span>
                  <span>{format(new Date(item?.OpenDate), "dd-MM-yyyy")}</span>
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Close Date:</span>
                  <span>{format(new Date(item?.CloseDate), "dd-MM-yyyy")}</span>
                </div>
              </div>
            </div>
          {/each}
          <InfiniteLoading on:infinite={infiniteHandler} />
        </div>
      {/if}
      {#if activeTab === "UPCOMING"}
        <table
          class="border border-[#2f343d] hidden sm:inline-table table-sm table-compact w-full m-auto"
        >
          <thead class="bg-[#161b22] border-b border-[#2f343d]">
            <tr>
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                >Company Name</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Offer Price</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Open Date</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Close Date</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Issue Size(Cr)
              </th>
            </tr>
          </thead>
          <tbody>
            {#each displayList as item, index}
              <!-- row -->
              <tr
                class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#0d1117] border-b border-[#161b22] shake-ticker cursor-pointer"
              >
                <td
                  class=" text-[#FFBE00] text-xs border-b-[#0d1117]"
                >
                  <a href={"/stocks/" + item?.SecurityID}
                    >{item?.SecurityName}</a
                  >
                </td>
                <td
                  class="  item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {item?.IssuePriceMin} - {item?.IssuePriceMax
                    ? item?.IssuePriceMax
                    : ""}
                </td>
                <td
                  class=" text-xs text-center text-white border-b-[#0d1117] hover:text-blue-500 text-end"
                >
                  {format(new Date(item?.OpenDate), "dd-MM-yyyy")}
                </td>
                <td
                  class=" item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {format(new Date(item?.CloseDate), "dd-MM-yyyy")}
                </td>

                <td
                  class="  item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                  >{item?.IssueSizeMin
                    ? (item?.IssueSizeMin / 10000000).toFixed(2)
                    : ""} - {item?.IssueSizeMax
                    ? (item?.IssueSizeMax / 10000000).toFixed(2)
                    : ""}
                </td>
              </tr>
            {/each}
            <InfiniteLoading on:infinite={infiniteHandler} />
          </tbody>
        </table>
        <div class="sm:hidden w-full m-auto mt-4 space-y-4">
          {#each displayList as item}
            <div
              class="bg-[#0d1117] p-4 rounded-md shadow-md border border-[#161b22]"
            >
              <a
                href={"/stocks/" + item?.SecurityID}
                class="text-[#FFBE00] text-lg font-medium"
                >{item?.SecurityName}</a
              >
              <div class="mt-2 text-xs">
                <div class="text-slate-200 flex justify-between">
                  <span>Offer Price:</span>
                  <span
                    >{item?.IssuePriceMin} - {item?.IssuePriceMax
                      ? item?.IssuePriceMax
                      : ""}</span
                  >
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Open Date:</span>
                  <span>{format(new Date(item?.OpenDate), "dd-MM-yyyy")}</span>
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Close Date:</span>
                  <span>{format(new Date(item?.CloseDate), "dd-MM-yyyy")}</span>
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Issue Size (Cr):</span>
                  <span>
                    {item?.IssueSizeMin
                      ? (item?.IssueSizeMin / 10000000).toFixed(2)
                      : ""} -
                    {item?.IssueSizeMax
                      ? (item?.IssueSizeMax / 10000000).toFixed(2)
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          {/each}
          <InfiniteLoading on:infinite={infiniteHandler} />
        </div>
      {/if}
      {#if activeTab === "LISTED"}
        <table
          class="border border-[#2f343d] hidden sm:inline-table table-sm table-compact w-full m-auto"
        >
          <thead class="bg-[#161b22] border-b border-[#2f343d]">
            <tr>
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                >Company Name</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Current Price</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Listed Price</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Change in Listed Price</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Issue Price
              </th>
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Change over Issue Price
              </th>
            </tr>
          </thead>
          <tbody>
            {#each displayList as item, index}
              <!-- row -->
              <tr
                class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#0d1117] border-b border-[#161b22] shake-ticker cursor-pointer"
              >
                <td
                  class=" text-[#FFBE00] text-xs border-b-[#0d1117]"
                >
                  <a href={"/stocks/" + item?.SecurityID}
                    >{item?.SecurityName}</a
                  >
                </td>
                <td
                  class="  item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {item?.LTP}
                </td>
                <td
                  class=" item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {item?.ListPrice?.toFixed(2)}
                  <div
                    class="flex flex-row item-center justify-end text-[10px]"
                  >
                    listed on {format(
                      new Date(item?.ListingDate),
                      "dd-MM-yyyy",
                    )}
                  </div>
                </td>
                <td
                  class=" item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {item?.ListPriceZ?.toFixed(2)}
                  <div class="flex flex-row item-center justify-end">
                    {#if item?.ListPriceZG >= 0}
                      <svg
                        class="w-5 h-5 -mr-0.5 -mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        ><g id="evaArrowUpFill0"
                          ><g id="evaArrowUpFill1"
                            ><path
                              id="evaArrowUpFill2"
                              fill="#10db06"
                              d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                            /></g
                          ></g
                        ></svg
                      >
                      <span class="text-[#10DB06] text-xs font-medium"
                        >+{item?.ListPriceZG
                          ? item?.ListPriceZG?.toFixed(2)
                          : 0.1}%</span
                      >
                    {:else}
                      <svg
                        class="w-5 h-5 -mr-0.5 -mt-0.5 rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        ><g id="evaArrowUpFill0"
                          ><g id="evaArrowUpFill1"
                            ><path
                              id="evaArrowUpFill2"
                              fill="#FF2F1F"
                              d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                            /></g
                          ></g
                        ></svg
                      >
                      <span class="text-[#FF2F1F] text-xs font-medium"
                        >{item?.ListPriceZG?.toFixed(2)}%
                      </span>
                    {/if}
                  </div>
                </td>
                <td
                  class=" item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {item?.IssuePrice}
                </td>
                <td
                  class=" item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                >
                  {item?.IssuePriceZ?.toFixed(2)}
                  <div class="flex flex-row item-center justify-end">
                    {#if item?.IssuePriceZG >= 0}
                      <svg
                        class="w-5 h-5 -mr-0.5 -mt-0.5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        ><g id="evaArrowUpFill0"
                          ><g id="evaArrowUpFill1"
                            ><path
                              id="evaArrowUpFill2"
                              fill="#10db06"
                              d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                            /></g
                          ></g
                        ></svg
                      >
                      <span class="text-[#10DB06] text-xs font-medium"
                        >+{item?.IssuePriceZG
                          ? item?.IssuePriceZG?.toFixed(2)
                          : 0.1}%</span
                      >
                    {:else}
                      <svg
                        class="w-5 h-5 -mr-0.5 -mt-0.5 rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        ><g id="evaArrowUpFill0"
                          ><g id="evaArrowUpFill1"
                            ><path
                              id="evaArrowUpFill2"
                              fill="#FF2F1F"
                              d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                            /></g
                          ></g
                        ></svg
                      >
                      <span class="text-[#FF2F1F] text-xs font-medium"
                        >{item?.IssuePriceZG?.toFixed(2)}%
                      </span>
                    {/if}
                  </div>
                </td>
              </tr>
            {/each}
            <InfiniteLoading on:infinite={infiniteHandler} />
          </tbody>
        </table>
        <div class="sm:hidden w-full m-auto mt-4 space-y-4">
          {#each displayList as item}
            <div
              class="bg-[#0d1117] p-4 rounded-md shadow-md border border-[#161b22]"
            >
              <a
                href={"/stocks/" + item?.SecurityID}
                class="text-[#FFBE00] text-lg font-medium"
                >{item?.SecurityName}</a
              >
              <div class="mt-2 text-xs">
                <div class="text-slate-200 flex justify-between">
                  <span>Current Price:</span>
                  <span>{item?.LTP}</span>
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Listed Price:</span>
                  <span>{item?.ListPrice?.toFixed(2)}</span>
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Listed on:</span>
                  <span
                    >{format(new Date(item?.ListingDate), "dd-MM-yyyy")}</span
                  >
                </div>
                <div class="text-slate-200 flex justify-between mt-2">
                  <span>Change in Listed Price:</span>
                  <span class="text-end">
                    {item?.ListPriceZ?.toFixed(2)}
                    <span class="flex items-center">
                      {#if item?.ListPriceZG >= 0}
                        <svg
                          class="w-5 h-5 -mr-0.5 -mt-0.5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <g id="evaArrowUpFill0">
                            <g id="evaArrowUpFill1">
                              <path
                                id="evaArrowUpFill2"
                                fill="#10db06"
                                d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                              />
                            </g>
                          </g>
                        </svg>
                        <span class="text-[#10DB06] text-xs font-medium"
                          >+{item?.ListPriceZG
                            ? item?.ListPriceZG?.toFixed(2)
                            : 0.1}%</span
                        >
                      {:else}
                        <svg
                          class="w-5 h-5 -mr-0.5 -mt-0.5 rotate-180"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <g id="evaArrowUpFill0">
                            <g id="evaArrowUpFill1">
                              <path
                                id="evaArrowUpFill2"
                                fill="#FF2F1F"
                                d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                              />
                            </g>
                          </g>
                        </svg>
                        <span class="text-[#FF2F1F] text-xs font-medium"
                          >{item?.ListPriceZG?.toFixed(2)}%</span
                        >
                      {/if}
                    </span>
                  </span>
                </div>
                <div class="text-slate-200 flex justify-between mt-2">
                  <span>Issue Price:</span>
                  <span>{item?.IssuePrice}</span>
                </div>
                <div class="text-slate-200 flex justify-between mt-2">
                  <span>Change over Issue Price:</span>
                  <span class="text-end">
                    {item?.IssuePriceZ?.toFixed(2)}
                    <span class="flex items-center">
                      {#if item?.IssuePriceZG >= 0}
                        <svg
                          class="w-5 h-5 -mr-0.5 -mt-0.5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <g id="evaArrowUpFill0">
                            <g id="evaArrowUpFill1">
                              <path
                                id="evaArrowUpFill2"
                                fill="#10db06"
                                d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                              />
                            </g>
                          </g>
                        </svg>
                        <span class="text-[#10DB06] text-xs font-medium"
                          >+{item?.IssuePriceZG
                            ? item?.IssuePriceZG?.toFixed(2)
                            : 0.1}%</span
                        >
                      {:else}
                        <svg
                          class="w-5 h-5 -mr-0.5 -mt-0.5 rotate-180"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <g id="evaArrowUpFill0">
                            <g id="evaArrowUpFill1">
                              <path
                                id="evaArrowUpFill2"
                                fill="#FF2F1F"
                                d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                              />
                            </g>
                          </g>
                        </svg>
                        <span class="text-[#FF2F1F] text-xs font-medium"
                          >{item?.IssuePriceZG?.toFixed(2)}%</span
                        >
                      {/if}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          {/each}
          <InfiniteLoading on:infinite={infiniteHandler} />
        </div>
      {/if}
      <ScrollToTop />
    </div>
    <!-- Page wrapper -->
  </section>
{/if}

<style>
</style>
