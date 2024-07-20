<script lang="ts">
  import { page } from "$app/stores";
  import { Chart } from "svelte-echarts";
  import Lazy from "svelte-lazy";
  import {
    getCache,
    numberOfUnreadNotification,
    screenWidth,
    setCache,
  } from "$lib/store";
  import { onMount } from "svelte";
  import type { EChartsOption } from "echarts";
  let backendURL = import.meta.env.VITE_BACKEND_API_URL;

  let isLoaded = false;
  let isLoading = false;
  let rawDataNSE: any[] = [];
  let rawDataBSE: any[] = [];

  let rawDataNSELoss: any[] = [];
  let rawDataNSEGain: any[] = [];
  let rawDataBSELoss: any[] = [];
  let rawDataBSEGain: any[] = [];

  let periodTypes: any[] = [];
  let selectedPeriod = "1D";
  let ChartOptionDataNSE: EChartsOption = {};
  let ChartOptionDataBSE: EChartsOption = {};

  $: data = $page.data;

  onMount(async () => {
    if (data?.GetMajorIndicesBSE && data?.GetMajorIndicesNSE) {
      rawDataBSE = data?.GetMajorIndicesBSE;
      rawDataNSE = data?.GetMajorIndicesNSE;
      rawDataNSELoss =
        data?.GetMajorIndicesNSEGainersLossersData
          ?.GetLatestIndexQuotesForLosers;
      rawDataNSEGain =
        data?.GetMajorIndicesNSEGainersLossersData
          ?.GetLatestIndexQuotesForGainers;
      rawDataBSELoss =
        data?.GetMajorIndicesBSEGainersLossersData
          ?.GetLatestIndexQuotesForLosers;
      rawDataBSEGain =
        data?.GetMajorIndicesBSEGainersLossersData
          ?.GetLatestIndexQuotesForGainers;
      periodTypes = data.periodTypes;
      ChartOptionDataNSE = await getMarketPlotOptions(
        rawDataNSE,
        "NSE Index Analysis",
      );
      ChartOptionDataBSE = await getMarketPlotOptions(
        rawDataBSE,
        "BSE Index Analysis",
      );
    }
    console.log(rawDataNSEGainLoss);
    console.log(rawDataBSEGainLoss);
    isLoaded = true;
  });

  let charNumber = 40;
  $: {
    if ($screenWidth < 640) {
      charNumber = 15;
    } else {
      charNumber = 40;
    }
  }

  const GetSvgElement = (changeInPercentage: number) => {
    if (!changeInPercentage) {
      return "";
    }
    if (changeInPercentage >= 0) {
      return `
          <svg class="w-5 h-5 -mr-0.5 -mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g id="evaArrowUpFill0">
              <g id="evaArrowUpFill1">
                <path id="evaArrowUpFill2" fill="#10db06" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/>
              </g>
            </g>
          </svg>
          <span class="text-[#10DB06] text-xs font-medium">+${changeInPercentage?.toFixed(2)}%</span>`;
    } else {
      return `
          <svg class="w-5 h-5 -mr-0.5 -mt-0.5 rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g id="evaArrowUpFill0">
              <g id="evaArrowUpFill1">
                <path id="evaArrowUpFill2" fill="#FF2F1F" d="M16.21 16H7.79a1.76 1.76 0 0 1-1.59-1a2.1 2.1 0 0 1 .26-2.21l4.21-5.1a1.76 1.76 0 0 1 2.66 0l4.21 5.1A2.1 2.1 0 0 1 17.8 15a1.76 1.76 0 0 1-1.59 1Z"/>
              </g>
            </g>
          </svg>
          <span class="text-[#FF2F1F] text-xs font-medium">${changeInPercentage?.toFixed(2)}%</span>`;
    }
  };

  async function fetchExchangeData(exchange: string, periodCode: string) {
    const cacheKey = `GetMajorIndices${exchange}${periodCode}`;
    const cachedData = getCache("", cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      `${backendURL}/index/latest_index_quotes?price_change_period=${periodCode}&exchange=${exchange}`,
    );
    const data = await response.json();
    const processedData = Array.isArray(data) ? [...data] : [];
    setCache("", processedData, cacheKey);
    return processedData;
  }
  async function fetchIndicesGainersLossersData(
    exchange: string,
    period: string,
  ) {
    const cacheKey = `GetMajorIndicesGainerLosser${exchange}${period}`;
    const cachedData = getCache("", cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await fetch(
      `${backendURL}/index/Get-Latest-IndexQuotes_gainers_lossers?priceChangePeriodType=${period}&exchange=${exchange}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();
    setCache("", data, cacheKey);
    return data;
  }

  async function fetchData(periodCode: string) {
    isLoading = true;
    try {
      const [nseData, bseData, nseGainerLosserData, bseGainerLosserData] =
        await Promise.all([
          fetchExchangeData("NSE", periodCode),
          fetchExchangeData("BSE", periodCode),
          fetchIndicesGainersLossersData("NSE", periodCode),
          fetchIndicesGainersLossersData("BSE", periodCode),
        ]);

      rawDataNSE = nseData;
      rawDataBSE = bseData;
      rawDataNSELoss = nseGainerLosserData?.GetLatestIndexQuotesForLosers;
      rawDataNSEGain = nseGainerLosserData?.GetLatestIndexQuotesForGainers;
      rawDataBSELoss = bseGainerLosserData?.GetLatestIndexQuotesForLosers;
      rawDataBSEGain = bseGainerLosserData?.GetLatestIndexQuotesForGainers;

      ChartOptionDataNSE = await getMarketPlotOptions(
        rawDataNSE,
        "NSE Index Analysis",
      );
      ChartOptionDataBSE = await getMarketPlotOptions(
        rawDataBSE,
        "BSE Index Analysis",
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoading = false;
    }
  }
  const handleDropdownChange = async (event: Event) => {
    selectedPeriod = (event.target as HTMLSelectElement).value;
    await fetchData(selectedPeriod);
  };

  async function getMarketPlotOptions(data: any, title: string) {
    const option = {
      title: {
        text: title,
        left: "center",
        top: 0,
        textStyle: {
          color: "#ffffff",
          fontSize: 22,
          fontFamily: '"Inter", sans-serif',
          fontWeight: "normal",
        },
      },
      silent: false,
      legend: false,

      xAxis: [
        {
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: false,
          },
        },
      ],
      yAxis: [
        {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#333333",
            },
          },
          axisLabel: {
            color: "#ffffff",
            fontFamily: '"Inter", sans-serif',
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#161b22",
            },
          },
          data: [...data?.map((each: any) => each.SecurityName)],
        },
      ],
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0d1117",
        borderColor: "#333333",
        borderWidth: 1,
        textStyle: {
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif',
        },
        formatter: (params) => {
          return `${params[0].name}: ${params[0].value.toFixed(2)}%`;
        },
      },
      series: [
        {
          name: "Income",
          type: "bar",
          stack: "Total",
          label: {
            show: false,
            position: "top",
            color: "#ffffff",
            fontFamily: '"Inter", sans-serif',
            formatter: "{c}%",
          },
          itemStyle: {
            color: function (params) {
              return params.value >= 0 ? "#10db06" : "#FF2F1F";
            },
          },
          emphasis: {
            focus: "series",
          },
          data: [...data?.map((each: any) => each.ChangePercentage)],
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        top: "15%",
        bottom: "5%",
        containLabel: true,
        show: true,
        borderColor: "#0d1117",
        borderWidth: 0,
        backgroundColor: "#0d1117",
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}",
        },
        zlevel: 0,
      },
    };
    return option;
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} Major
    Deals Held · octopi
  </title>
  <meta
    name="description"
    content={`Realtime Major Deals Trades from Traders.`}
  />

  <!-- Other meta tags -->
  <meta property="og:title" content={`Major Deals Flow · octopi`} />
  <meta
    property="og:description"
    content={`Realtime Major Deals Trades from Traders.`}
  />
  <meta property="og:type" content="website" />
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Major Deals Flow · octopi`} />
  <meta
    name="twitter:description"
    content={`Realtime Major Deals Trades from Traders.`}
  />
</svelte:head>

<section
  class="container w-full max-w-7xl m-auto sm:bg-[#0d1117] sm:rounded-xl h-auto pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8 min-h-screen"
>
  <div class="text-sm breadcrumbs">
    <ul>
      <li><a href="/" class="text-gray-300">Home</a></li>
      <li class="text-gray-300">Indices</li>
    </ul>
  </div>
  <div class=" mt-5">
    <div class="flex flex-row items-start justify-between">
      <h1 class="text-xl sm:text-xl text-white text-start font-bold mb-5">
        Major Indices
      </h1>
      <div
        class="flex items-center justify-center bg-[#21262d] rounded border border-[#30363d]"
      >
        <h1
          class="text-xs sm:text-xs text-slate-300 text-start px-2 border-r border-[#30363d]"
        >
          The Changes made in
        </h1>
        <select
          class="text-white bg-[#21262d] p-1 text-xs rounded border border-[#21262d]"
          on:change={handleDropdownChange}
        >
          {#each periodTypes as period}
            <option value={period.ID}>{period.Label}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
  <div class="grid sm:grid-cols-2 xs:sm:grid-cols-2 sm:gap-4">
    <div class="overflow-x-auto border border-[#2a2e39] rounded-lg">
      <h1 class="text-xl sm:text-xl text-white text-center mt-3 mb-5">
        National Stock Exchange
      </h1>
      {#if isLoading}
        <div class="flex justify-center items-center h-80">
          <div class="relative">
            <label
              class="bg-[#0d1117] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <span class="loading loading-spinner loading-md"></span>
            </label>
          </div>
        </div>
      {:else}
        <div class="h-[300px] flex flex-col">
          <table class="border border-[#2f343d] table-compact w-full m-auto">
            <thead class="bg-[#161b22] border-b border-[#2f343d]">
              <tr>
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Index</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >LTP</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Chg</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Chg%</th
                >
              </tr>
            </thead>
          </table>
          <div class="overflow-y-auto flex-grow">
            <table class="border border-[#2f343d] table-compact w-full m-auto">
              <tbody>
                {#each rawDataNSE as item, index}
                  <tr class="border-b border-[#2a2e39]">
                    <td
                      class="px-2 py-1 whitespace-no-wrap text-white text-xs hover:text-[#FFBE00] cursor-pointer"
                      >{item?.SecurityName}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      >{item?.Close}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs">
                      <div
                        class="flex {item?.Change >= 0
                          ? 'text-[#10DB06]'
                          : 'text-[#FF2F1F]'}"
                      >
                        {item?.Change}
                      </div></td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      ><div class="flex">
                        {@html GetSvgElement(item?.ChangePercentage)}
                      </div></td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
    <div class="overflow-x-auto border border-[#2a2e39] rounded-lg">
      <h1 class="text-xl sm:text-xl text-white text-center mt-3 mb-5">
        Bombay Stock Exchange
      </h1>
      {#if isLoading}
        <div class="flex justify-center items-center h-80">
          <div class="relative">
            <label
              class="bg-[#0d1117] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <span class="loading loading-spinner loading-md"></span>
            </label>
          </div>
        </div>
      {:else}
        <div class="h-[300px] flex flex-col">
          <table class="border border-[#2f343d] table-compact w-full m-auto">
            <thead class="bg-[#161b22] border-b border-[#2f343d]">
              <tr>
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Index</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-end leading-4 font-normal text-xs"
                  >LTP</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-end leading-4 font-normal text-xs"
                  >Chg</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-end leading-4 font-normal text-xs"
                  >Chg%</th
                >
              </tr>
            </thead>
          </table>
          <div class="overflow-y-auto flex-grow">
            <table class="border border-[#2f343d] table-compact w-full m-auto">
              <tbody>
                {#each rawDataBSE as item, index}
                  <tr class="border-b border-[#2a2e39]">
                    <td
                      class="px-2 py-1 whitespace-no-wrap text-white text-xs hover:text-[#FFBE00] cursor-pointer"
                      >{item?.SecurityName}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      >{item?.Close}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs">
                      <div
                        class="flex {item?.Change >= 0
                          ? 'text-[#10DB06]'
                          : 'text-[#FF2F1F]'}"
                      >
                        {item?.Change ? item?.Change : ""}
                      </div></td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      ><div class="flex">
                        {@html GetSvgElement(item?.ChangePercentage)}
                      </div></td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div class="grid sm:grid-cols-2 xs:sm:grid-cols-2 sm:gap-4 mt-3">
    <div class="overflow-x-auto border border-[#2a2e39] rounded-lg p-3">
      <Lazy height={800} fadeOption={{ delay: 100, duration: 500 }} keep={true}>
        <div class="w-full h-[560px] mt-6">
          <Chart options={ChartOptionDataNSE} />
        </div>
      </Lazy>
    </div>
    <div class="overflow-x-auto border border-[#2a2e39] rounded-lg p-3">
      <Lazy height={800} fadeOption={{ delay: 100, duration: 500 }} keep={true}>
        <div class="w-full h-[560px] mt-6">
          <Chart options={ChartOptionDataBSE} />
        </div>
      </Lazy>
    </div>
  </div>
  <div class=" mt-10">
    <div class="flex flex-row items-start justify-between mt-5">
      <h1 class="text-xl sm:text-xl text-white text-start font-bold mb-5">
        Top Gainer & Lossers from All Indices
      </h1>
    </div>
  </div>
  <div class="grid sm:grid-cols-2 xs:sm:grid-cols-2 sm:gap-4 mt-3">
    <div class="overflow-x-auto border border-[#2a2e39] rounded-lg">
      <h1 class="text-xl sm:text-xl text-white text-center mt-3 mb-5">
        Top Gainers Indices NSE
      </h1>
      {#if isLoading}
        <div class="flex justify-center items-center h-80">
          <div class="relative">
            <label
              class="bg-[#0d1117] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <span class="loading loading-spinner loading-md"></span>
            </label>
          </div>
        </div>
      {:else}
        <div class="h-[300px] flex flex-col">
          <table class="border border-[#2f343d] table-compact w-full m-auto">
            <thead class="bg-[#161b22] border-b border-[#2f343d]">
              <tr>
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Index</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >LTP</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Chg</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Chg%</th
                >
              </tr>
            </thead>
          </table>
          <div class="overflow-y-auto flex-grow">
            <table class="border border-[#2f343d] table-compact w-full m-auto">
              <tbody>
                {#each rawDataNSEGain as item, index}
                  <tr class="border-b border-[#2a2e39]">
                    <td
                      class="px-2 py-1 whitespace-no-wrap text-white text-xs hover:text-[#FFBE00] cursor-pointer"
                      >{item?.SecurityName}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      >{item?.Close}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs">
                      <div
                        class="flex {item?.Change >= 0
                          ? 'text-[#10DB06]'
                          : 'text-[#FF2F1F]'}"
                      >
                        {item?.Change}
                      </div></td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      ><div class="flex">
                        {@html GetSvgElement(item?.ChangePercentage)}
                      </div></td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
    <div class="overflow-x-auto border border-[#2a2e39] rounded-lg">
      <h1 class="text-xl sm:text-xl text-white text-center mt-3 mb-5">
        Top Gainers Indices BSE
      </h1>
      {#if isLoading}
        <div class="flex justify-center items-center h-80">
          <div class="relative">
            <label
              class="bg-[#0d1117] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <span class="loading loading-spinner loading-md"></span>
            </label>
          </div>
        </div>
      {:else}
        <div class="h-[300px] flex flex-col">
          <table class="border border-[#2f343d] table-compact w-full m-auto">
            <thead class="bg-[#161b22] border-b border-[#2f343d]">
              <tr>
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Index</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-end leading-4 font-normal text-xs"
                  >LTP</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-end leading-4 font-normal text-xs"
                  >Chg</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-end leading-4 font-normal text-xs"
                  >Chg%</th
                >
              </tr>
            </thead>
          </table>
          <div class="overflow-y-auto flex-grow">
            <table class="border border-[#2f343d] table-compact w-full m-auto">
              <tbody>
                {#each rawDataBSEGain as item, index}
                  <tr class="border-b border-[#2a2e39]">
                    <td
                      class="px-2 py-1 whitespace-no-wrap text-white text-xs hover:text-[#FFBE00] cursor-pointer"
                      >{item?.SecurityName}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      >{item?.Close}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs">
                      <div
                        class="flex {item?.Change >= 0
                          ? 'text-[#10DB06]'
                          : 'text-[#FF2F1F]'}"
                      >
                        {item?.Change ? item?.Change : ""}
                      </div></td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      ><div class="flex">
                        {@html GetSvgElement(item?.ChangePercentage)}
                      </div></td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div class="grid sm:grid-cols-2 xs:sm:grid-cols-2 sm:gap-4 mt-3">
    <div class="overflow-x-auto border border-[#2a2e39] rounded-lg">
      <h1 class="text-xl sm:text-xl text-white text-center mt-3 mb-5">
        Top Lossers Indices NSE
      </h1>
      {#if isLoading}
        <div class="flex justify-center items-center h-80">
          <div class="relative">
            <label
              class="bg-[#0d1117] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <span class="loading loading-spinner loading-md"></span>
            </label>
          </div>
        </div>
      {:else}
        <div class="h-[300px] flex flex-col">
          <table class="border border-[#2f343d] table-compact w-full m-auto">
            <thead class="bg-[#161b22] border-b border-[#2f343d]">
              <tr>
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Index</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >LTP</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Chg</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Chg%</th
                >
              </tr>
            </thead>
          </table>
          <div class="overflow-y-auto flex-grow">
            <table class="border border-[#2f343d] table-compact w-full m-auto">
              <tbody>
                {#each rawDataNSELoss as item, index}
                  <tr class="border-b border-[#2a2e39]">
                    <td
                      class="px-2 py-1 whitespace-no-wrap text-white text-xs hover:text-[#FFBE00] cursor-pointer"
                      >{item?.SecurityName}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      >{item?.Close}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs">
                      <div
                        class="flex {item?.Change >= 0
                          ? 'text-[#10DB06]'
                          : 'text-[#FF2F1F]'}"
                      >
                        {item?.Change}
                      </div></td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      ><div class="flex">
                        {@html GetSvgElement(item?.ChangePercentage)}
                      </div></td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
    <div class="overflow-x-auto border border-[#2a2e39] rounded-lg">
      <h1 class="text-xl sm:text-xl text-white text-center mt-3 mb-5">
        Top Lossers Indices BSE
      </h1>
      {#if isLoading}
        <div class="flex justify-center items-center h-80">
          <div class="relative">
            <label
              class="bg-[#0d1117] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <span class="loading loading-spinner loading-md"></span>
            </label>
          </div>
        </div>
      {:else}
        <div class="h-[300px] flex flex-col">
          <table class="border border-[#2f343d] table-compact w-full m-auto">
            <thead class="bg-[#161b22] border-b border-[#2f343d]">
              <tr>
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-left leading-4 font-normal text-xs"
                  >Index</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-end leading-4 font-normal text-xs"
                  >LTP</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-end leading-4 font-normal text-xs"
                  >Chg</th
                >
                <th
                  class="px-2 py-1 border-b border-[#2a2e39] text-end leading-4 font-normal text-xs"
                  >Chg%</th
                >
              </tr>
            </thead>
          </table>
          <div class="overflow-y-auto flex-grow">
            <table class="border border-[#2f343d] table-compact w-full m-auto">
              <tbody>
                {#each rawDataBSELoss as item, index}
                  <tr class="border-b border-[#2a2e39]">
                    <td
                      class="px-2 py-1 whitespace-no-wrap text-white text-xs hover:text-[#FFBE00] cursor-pointer"
                      >{item?.SecurityName}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      >{item?.Close}</td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs">
                      <div
                        class="flex {item?.Change >= 0
                          ? 'text-[#10DB06]'
                          : 'text-[#FF2F1F]'}"
                      >
                        {item?.Change ? item?.Change : ""}
                      </div></td
                    >
                    <td class="px-2 py-1 whitespace-no-wrap text-white text-xs"
                      ><div class="flex">
                        {@html GetSvgElement(item?.ChangePercentage)}
                      </div></td
                    >
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      {/if}
    </div>
  </div>
</section>
