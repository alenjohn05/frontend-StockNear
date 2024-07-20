<script lang="ts">
  import InfiniteLoading from "$lib/components/InfiniteLoading.svelte";
  import ScrollToTop from "$lib/components/ScrollToTop.svelte";
  import debounce from "lodash.debounce";
  import { numberOfUnreadNotification } from "$lib/store";
  import { abbreviateNumber } from "$lib/utils.js";
  import { format } from "date-fns";
  import { onMount } from "svelte";

  interface CorporateAction {
    SecurityName?: string;
    [key: string]: any;
  }

  interface TabItem {
    id: string;
    label: string;
  }

  export let data: {
    GetForthcomingCorporateActionResults?: CorporateAction[];
    GetRecentReleasedResults?: CorporateAction[];
  };

  let forthComingResult: CorporateAction[] =
    data?.GetForthcomingCorporateActionResults ?? [];
  let recentReleasedResult: CorporateAction[] =
    data?.GetRecentReleasedResults ?? [];
  let displayList: CorporateAction[] = [];
  let rawData: CorporateAction[] = forthComingResult;
  let isLoaded = false;

  async function handleScroll() {
    const scrollThreshold = document.body.offsetHeight * 0.8;
    const isBottom = window.innerHeight + window.scrollY >= scrollThreshold;
    if (isBottom && displayList.length !== rawData.length) {
      const nextIndex = displayList.length;
      const filteredNewResults = rawData.slice(nextIndex, nextIndex + 20);
      displayList = [...displayList, ...filteredNewResults];
    }
  }

  let error: string | null = null;

  onMount(() => {
    try {
      displayList = rawData?.slice(0, 20) ?? [];
      window.addEventListener("scroll", handleScroll);
      isLoaded = true;
    } catch (e) {
      error = "Error loading data. Please try again later.";
      console.error("Error loading data:", e);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const addSparkLine = (dataContent: string, index: number) => {
    if (dataContent) {
      const values = dataContent.split(",").map(Number);
      const newValues: number[] = [];
      const volatility = 0.02;
      const numInterpolatedPoints = 5;
      for (let i = 0; i < values.length - 1; i++) {
        newValues.push(values[i]);
        const startPrice = values[i];
        const endPrice = values[i + 1];
        const priceDiff = endPrice - startPrice;

        for (let j = 1; j <= numInterpolatedPoints; j++) {
          const t = j / (numInterpolatedPoints + 1);
          const drift =
            (priceDiff / startPrice - 0.5 * volatility * volatility) * t;
          const randomComponent =
            volatility * Math.sqrt(t) * (Math.random() - 0.5);
          const price = startPrice * Math.exp(drift + randomComponent);

          newValues.push(price);
        }
      }
      newValues.push(values[values.length - 1]);
      if (newValues.length > 0) {
        const width = 100;
        const height = 30;
        const padding = 5;

        const xScale = (width - 2 * padding) / (newValues.length - 1);
        const yMin = Math.min(...newValues);
        const yMax = Math.max(...newValues);
        const yScale = (height - 2 * padding) / (yMax - yMin);

        const points = newValues
          .map(
            (value, i) =>
              `${padding + i * xScale},${height - padding - (value - yMin) * yScale}`
          )
          .join(" ");

        const isPositive = newValues[newValues.length - 1] >= newValues[0];
        const gradientId = `gradient-${index}`;
        const gradientColor = isPositive ? "#10DB06" : "#FF2F1F";

        // Create area graph points
        const areaPoints =
          `${padding},${height - padding} ` +
          points +
          ` ${width - padding},${height - padding}`;

        // Generate tickers
        const tickers = [];
        for (let i = 0; i < 5; i++) {
          const x = padding + (i * (width - 2 * padding)) / 4;
          const y = height - padding;
          tickers.push(
            `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 3}" stroke="#888" stroke-width="1" />`
          );
        }

        return `
        <svg width="100" height="30" class="sparkline">
          <defs>
            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:${gradientColor};stop-opacity:0.3" />
              <stop offset="100%" style="stop-color:${gradientColor};stop-opacity:0.1" />
            </linearGradient>
          </defs>
          <polygon
            fill="url(#${gradientId})"
            points="${areaPoints}"
          />
          <polyline
            fill="none"
            stroke="${gradientColor}"
            stroke-width="1.5"
            points="${points}"
          />
          
        </svg>
      `;
      }
    }
    return "";
  };

  let filterQuery = "";
  let activeTab: string = "UPCOMING";

  const tabs: TabItem[] = [
    { id: "UPCOMING", label: "Upcoming Results" },
    { id: "RELEASHED", label: "Released Results" }
  ];

  function setActiveTab(tabId: string) {
    activeTab = tabId;
    if (tabId === "UPCOMING") {
      rawData = forthComingResult;
      displayList = forthComingResult?.slice(0, 20) ?? [];
    } else {
      rawData = recentReleasedResult;
      displayList = recentReleasedResult?.slice(0, 20) ?? [];
    }
    filterQuery = "";
    handleInput({ target: { value: "" } } as unknown as Event);
  }

  const debouncedHandleInput = debounce((event: Event) => {
    filterQuery = (event.target as HTMLInputElement).value?.toLowerCase();
    if (filterQuery.length !== 0) {
      const newData = rawData.filter((item) => {
        const compName = item?.SecurityName?.toLowerCase();
        return compName?.includes(filterQuery);
      });
      displayList = newData?.slice(0, 20) ?? [];
    } else {
      displayList = rawData?.slice(0, 20) ?? [];
    }
  }, 300);

  function handleInput(event: Event) {
    debouncedHandleInput(event);
  }

  async function infiniteHandler({
    detail: { loaded, complete }
  }: {
    detail: { loaded: () => void; complete: () => void };
  }) {
    if (displayList.length === rawData.length) {
      complete();
    } else {
      const nextIndex = displayList.length;
      const newArticles = rawData.slice(nextIndex, nextIndex + 5);
      displayList = [...displayList, ...newArticles];
      loaded();
    }
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} Upcoming
    events Calendar · octopi
  </title>
  <meta
    name="description"
    content={`A list of upcoming events on the Indian stock market, with dates, times and estimated revenue and events growth.`}
  />

  <!-- Other meta tags -->
  <meta property="og:title" content={`Events Calendar · octopi`} />
  <meta
    property="og:description"
    content={`A list of upcoming events on the Indian stock market, with dates, times and estimated revenue and events growth.`}
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
    content={`A list of upcoming events on the Indian stock market, with dates, times and estimated revenue and events growth.`}
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
        Major Results
      </h1>
    </div>
    <div class="flex sm:flex-row flex-col items-center justify-between">
      <h1 class="text-sm sm:text-sm text-white text-start mt-5 mb-10">
        Explore Major Results, Upcoming and Released Results.
      </h1>
      <div class="bg-[#161b22] mb-10">
        <label class="flex flex-row items-center">
          <input
            id="modal-search"
            type="search"
            class="text-white ml-2 text-[1rem] placeholder-gray-400 border-transparent focus:border-transparent focus:ring-0 flex items-center justify-center w-full px-0 py-1 bg-inherit"
            placeholder="Find by company name"
            autocomplete="off"
            bind:value={filterQuery}
            on:input={handleInput}
          />
          <svg
            class="ml-auto mr-5 h-8 w-8 inline-block mr-2"
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
      class="flex text-sm font-medium text-center text-gray-500 border-b border-[#161b22] dark:border-[#161b22] dark:text-[#161b22]"
    >
      {#each tabs as tab}
        <li class="me-2">
          <button
            class="inline-block p-2 {activeTab === tab.id
              ? 'border-b border-blue-300 text-white bg-[#161b22] active dark:bg-[#161b22] dark:text-white'
              : ' text-gray-500 bg-[#0d1117] active dark:bg-[#0d1117] dark:text-white'}"
            on:click|preventDefault={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        </li>
      {/each}
    </ul>

    <div
      class=" w-full justify-center m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0 mb-10"
    >
      {#if activeTab === "UPCOMING"}
        <table
          class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#0d1117] m-auto mt-4"
        >
          <thead>
            <tr class="border-b border-gray-800">
              <th class="text-slate-200 font-medium text-sm text-start w-40"
                >Date</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                >Company Name</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                >Current Pattern</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Market - Cap</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Current Price</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Change %</th
              >
            </tr>
          </thead>
          <tbody>
            {#if displayList.length === 0}
              <tr>
                <td
                  colspan="4"
                  class="text-center text-white bg-[#0d1117] border-b-[#0d1117] py-4"
                >
                  No data available
                </td>
              </tr>
            {:else}
              {#each displayList as item, index}
                <!-- row -->
                <tr
                  class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#0d1117] border-b border-[#161b22] shake-ticker cursor-pointer"
                >
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} border-b-[#0d1117] text-xs font-bold"
                  >
                    {format(new Date(item?.Date), "dd-MM-yyyy")}
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-[#FFBE00] text-xs border-b-[#0d1117]"
                  >
                    <a href={"/stocks/" + item?.SecurityID}
                      >{item?.SecurityName}</a
                    >
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-xs text-center text-white border-b-[#0d1117] hover:text-blue-500"
                  >
                    {@html addSparkLine(item?.C1WJson, index)}
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                  >
                    {abbreviateNumber(item?.MCap)}
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                  >
                    {item?.LTP}
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                  >
                    <div class="flex item-center justify-center">
                      {#if item?.ChangePercent >= 0}
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
                          >+{item?.ChangePercent
                            ? item?.ChangePercent
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
                          >{item?.ChangePercent}%
                        </span>
                      {/if}
                    </div>
                  </td>
                </tr>
              {/each}
              <InfiniteLoading on:infinite={infiniteHandler} />
            {/if}
          </tbody>
        </table>
        <div class="sm:hidden w-full m-auto mt-4 space-y-4">
          {#each displayList as item, index}
            <div
              class="bg-[#0d1117] p-4 rounded-md shadow-md border border-[#161b22]"
            >
              <div class="text-[#FFBE00] text-lg font-medium">
                <a href={"/stocks/" + item?.SecurityID}>{item?.SecurityName}</a>
              </div>
              <div class="mt-2 text-xs">
                <div class="text-slate-200 flex justify-between">
                  <span>Date:</span>
                  <span>{format(new Date(item?.Date), "dd-MM-yyyy")}</span>
                </div>
                <div class="text-slate-200 flex justify-between mt-2">
                  <span>Current Pattern:</span>
                  <span>{@html addSparkLine(item?.C1WJson, index)}</span>
                </div>
                <div class="text-slate-200 flex justify-between mt-2">
                  <span>Market Cap:</span>
                  <span>{abbreviateNumber(item?.MCap)}</span>
                </div>
                <div class="text-slate-200 flex justify-between mt-2">
                  <span>Current Price:</span>
                  <span>{item?.LTP}</span>
                </div>
                <div class="text-slate-200 flex justify-between mt-2">
                  <span>Change %:</span>
                  <span class="flex items-center">
                    {#if item?.ChangePercent >= 0}
                      <svg
                        class="w-4 h-4 mr-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#10db06"
                          d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                        />
                      </svg>
                      <span class="text-[#10DB06]"
                        >+{item?.ChangePercent
                          ? item?.ChangePercent
                          : 0.1}%</span
                      >
                    {:else}
                      <svg
                        class="w-4 h-4 mr-1 rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#FF2F1F"
                          d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                        />
                      </svg>
                      <span class="text-[#FF2F1F]">{item?.ChangePercent}%</span>
                    {/if}
                  </span>
                </div>
              </div>
            </div>
          {/each}
          <InfiniteLoading on:infinite={infiniteHandler} />
        </div>
      {/if}
      {#if activeTab === "RELEASHED"}
        <table
          class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#0d1117] m-auto mt-4"
        >
          <thead>
            <tr class="border-b border-gray-800">
              <th class="text-slate-200 font-medium text-sm text-start w-40"
                >Quater</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                >Company Name</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                >Mar-Cap</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Sales(Cr)</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >EBITDA(Cr)</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
                >Profit(Cr)
              </th>
            </tr>
          </thead>
          <tbody>
            {#if displayList.length === 0}
              <tr>
                <td
                  colspan="4"
                  class="text-center text-white bg-[#0d1117] border-b-[#0d1117] py-4"
                >
                  No data available
                </td>
              </tr>
            {:else}
              {#each displayList as item, index}
                <!-- row -->
                <tr
                  class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#0d1117] border-b border-[#161b22] shake-ticker cursor-pointer"
                >
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} border-b-[#0d1117] text-xs font-bold"
                  >
                    {item?.DateEnd}
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-[#FFBE00] text-xs border-b-[#0d1117]"
                  >
                    <a href={"/stocks/" + item?.SecurityID}
                      >{item?.SecurityName}</a
                    >
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-xs text-center text-white border-b-[#0d1117] hover:text-blue-500"
                  >
                    {abbreviateNumber(item?.MCap)}
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                  >
                    {item?.SALES?.toFixed(2)}
                    <div class="flex flex-row item-center justify-end">
                      {#if item?.SALESARZG >= 0}
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
                          >+{item?.SALESARZG
                            ? item?.SALESARZG?.toFixed(2)
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
                          >{item?.SALESARZG?.toFixed(2)}%
                        </span>
                      {/if}
                    </div>
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'}  item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                  >
                    {item?.EBITDA?.toFixed(2)}
                    <div class="flex flex-row item-center justify-end">
                      {#if item?.EBITDAARZG >= 0}
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
                          >+{item?.EBITDAARZG
                            ? item?.EBITDAARZG?.toFixed(2)
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
                          >{item?.EBITDAARZG?.toFixed(2)}%
                        </span>
                      {/if}
                    </div>
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'}  item-center justify-end text-xs text-end text-white border-b-[#0d1117] hover:text-blue-500"
                  >
                    {item?.Profit?.toFixed(2)}
                    <div class="flex flex-row item-center justify-end">
                      {#if item?.ProfitARZG >= 0}
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
                          >+{item?.ProfitARZG
                            ? item?.ProfitARZG?.toFixed(2)
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
                          >{item?.ProfitARZG?.toFixed(2)}%
                        </span>
                      {/if}
                    </div>
                  </td>
                </tr>
              {/each}
              <InfiniteLoading on:infinite={infiniteHandler} />
            {/if}
          </tbody>
        </table>
        <div class="sm:hidden w-full m-auto mt-4 space-y-4">
          {#each displayList as item}
            <div
              class="bg-[#0d1117] p-4 rounded-md shadow-md border border-[#161b22]"
            >
              <div class="text-[#FFBE00] text-lg font-medium">
                <a href={"/stocks/" + item?.SecurityID}>{item?.SecurityName}</a>
              </div>
              <div class="mt-2 text-xs">
                <div class="text-slate-200 flex justify-between">
                  <span>Quarter:</span>
                  <span>{item.DateEnd}</span>
                </div>
                <div class="text-slate-200 flex justify-between">
                  <span>Market Cap:</span>
                  <span>{abbreviateNumber(item?.MCap)}</span>
                </div>
                <div class="text-slate-200 flex justify-between mt-2">
                  <span>Sales (Cr):</span>
                  <span class="flex items-center">
                    {item?.SALES?.toFixed(2)}
                    {#if item?.SALESARZG >= 0}
                      <svg
                        class="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#10db06"
                          d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                        />
                      </svg>
                      <span class="text-[#10DB06] ml-1"
                        >+{item?.SALESARZG
                          ? item?.SALESARZG?.toFixed(2)
                          : 0.1}%</span
                      >
                    {:else}
                      <svg
                        class="w-4 h-4 ml-1 rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#FF2F1F"
                          d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                        />
                      </svg>
                      <span class="text-[#FF2F1F] ml-1"
                        >{item?.SALESARZG?.toFixed(2)}%</span
                      >
                    {/if}
                  </span>
                </div>
                <div class="text-slate-200 flex justify-between mt-1">
                  <span>EBITDA (Cr):</span>
                  <span class="flex items-center">
                    {item?.EBITDA?.toFixed(2)}
                    {#if item?.EBITDAARZG >= 0}
                      <svg
                        class="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#10db06"
                          d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                        />
                      </svg>
                      <span class="text-[#10DB06] ml-1"
                        >+{item?.EBITDAARZG
                          ? item?.EBITDAARZG?.toFixed(2)
                          : 0.1}%</span
                      >
                    {:else}
                      <svg
                        class="w-4 h-4 ml-1 rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#FF2F1F"
                          d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                        />
                      </svg>
                      <span class="text-[#FF2F1F] ml-1"
                        >{item?.EBITDAARZG?.toFixed(2)}%</span
                      >
                    {/if}
                  </span>
                </div>
                <div class="text-slate-200 flex justify-between mt-1">
                  <span>Profit (Cr):</span>
                  <span class="flex items-center">
                    {item?.Profit?.toFixed(2)}
                    {#if item?.ProfitARZG >= 0}
                      <svg
                        class="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#10db06"
                          d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                        />
                      </svg>
                      <span class="text-[#10DB06] ml-1"
                        >+{item?.ProfitARZG
                          ? item?.ProfitARZG?.toFixed(2)
                          : 0.1}%</span
                      >
                    {:else}
                      <svg
                        class="w-4 h-4 ml-1 rotate-180"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="#FF2F1F"
                          d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"
                        />
                      </svg>
                      <span class="text-[#FF2F1F] ml-1"
                        >{item?.ProfitARZG?.toFixed(2)}%</span
                      >
                    {/if}
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
