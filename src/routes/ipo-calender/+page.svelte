<script lang="ts">
  import InfiniteLoading from "$lib/components/InfiniteLoading.svelte";
  import UpgradeToPro from "$lib/components/UpgradeToPro.svelte";
  import { numberOfUnreadNotification } from "$lib/store";
  import { abbreviateNumber } from "$lib/utils.js";
  import { format } from "date-fns";
  import { onMount } from "svelte";
  export let data;

  let listedIpos = data?.Get_Listed_IPOs;
  let onGoing_IPOs = data?.Get_Ongoing_IPOs;
  let upcoming_ipos = data?.Get_Upcoming_IPOs;
  let displayList: any[] = [];
  let rawData = listedIpos;
  let activeData = listedIpos;
  let isLoaded = false;

  async function handleScroll() {
    const scrollThreshold = document.body.offsetHeight * 0.8; // 80% of the website height
    const isBottom = window.innerHeight + window.scrollY >= scrollThreshold;
    if (isBottom && displayList?.length !== rawData?.length) {
      const nextIndex = displayList?.length;
      const filteredNewResults = rawData?.slice(nextIndex, nextIndex + 20);
      displayList = [...displayList, ...filteredNewResults];
    }
  }

  onMount(async () => {
    displayList = rawData?.slice(0, 20) ?? [];
    isLoaded = true;
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const addSparkLine = (dataContent, index) => {
    if (dataContent) {
      const values = dataContent.split(",").map(Number);
      const newValues: number[] = [];
      for (let i = 0; i < values.length - 1; i++) {
        newValues.push(values[i]);
        const numRandom = 5;

        for (let j = 0; j < numRandom; j++) {
          const rand = Math.random() * (values[i + 1] - values[i]) + values[i];
          newValues.push(rand);
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
  let activeTab = "UPCOMING";

  const tabs = [
    { id: "UPCOMING", label: "Upcoming IPOs" },
    { id: "LISTED", label: "Listed IPOs" },
    { id: "ONGOING", label: "Ongoing IPOs" }
  ];
  function setActiveTab(tabId: string) {
    activeTab = tabId;
    if (tabId === "UPCOMING") {
      rawData = listedIpos;
      displayList = listedIpos?.slice(0, 20) ?? [];
    } else {
      rawData = onGoing_IPOs;
      displayList = onGoing_IPOs?.slice(0, 20) ?? [];
    }
  }
  function handleInput(event) {
    filterQuery = event.target.value?.toLowerCase();
    let newData = [];
    setTimeout(() => {
      if (filterQuery.length !== 0) {
        rawData = activeData.filter((item) => {
          const compName = item?.SecurityName?.toLowerCase();
          return compName?.includes(filterQuery);
        });
      } else {
        rawData = activeData;
      }
    }, 300);
  }

  async function infiniteHandler({ detail: { loaded, complete } }) {
    if (displayList?.length === rawData?.length) {
      complete();
    } else {
      const nextIndex = displayList?.length;
      const newArticles = rawData?.slice(nextIndex, nextIndex + 5);
      displayList = [...displayList, ...newArticles];
      loaded();
    }
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} IPO Calendar · octopi
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

<section
  class="w-full max-w-7xl m-auto sm:bg-[#0d1117] sm:rounded-xl h-auto pl-10 pr-10 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8"
>
  <div class="flex flex-row items-start">
    <h1 class="text-3xl sm:text-4xl text-white text-start font-bold mb-5">
      IPO Details
    </h1>
  </div>
  <div class="flex items-center justify-between">
    <h1 class="text-sm sm:text-sm text-white text-start mt-5 mb-10">
      Exchange Announcements
    </h1>
    <div class="bg-[#161b22]">
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
    class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-[#161b22] dark:border-[#161b22] dark:text-[#161b22]"
  >
    {#each tabs as tab}
      <li class="me-2">
        <a
          href="#"
          class="inline-block p-2 {activeTab === tab.id
            ? 'border-b border-blue-300 text-white bg-[#161b22] active dark:bg-[#161b22] dark:text-white'
            : ' text-gray-500 bg-[#0d1117] active dark:bg-[#0d1117] dark:text-white'}"
          on:click|preventDefault={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </a>
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
          <tr>
            <th
              class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
              >Company Name</th
            >
            <th
              class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
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
          </tr>
        </thead>
        <tbody>
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
                <a href={"/stocks/" + item?.ID}>{item?.SecurityName}</a>
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
                      >+{item?.ChangePercent ? item?.ChangePercent : 0.1}%</span
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
        </tbody>
      </table>
    {/if}
    {#if activeTab === "LISTED"}
      <table
        class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#0d1117] m-auto mt-4"
      >
        <thead>
          <tr>
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
                <a href={"/stocks/" + item?.SecurityID}>{item?.SecurityName}</a>
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
        </tbody>
      </table>
    {/if}
    <UpgradeToPro
      {data}
      title="Get the latest dark pool trades in realtime from Hedge Funds & Major Institutional Traders"
    />
  </div>
  <!-- Page wrapper -->
</section>

<style>
</style>
