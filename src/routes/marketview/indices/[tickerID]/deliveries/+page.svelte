<script lang="ts">
  import ScrollToTop from "$lib/components/ScrollToTop.svelte";
  import { numberOfUnreadNotification } from "$lib/store";
  import { onMount } from "svelte";
  import { Chart as EChart } from "svelte-echarts";
  import Lazy from "svelte-lazy";

  interface ListedStock {
    SecurityName?: string;
    [key: string]: any;
    // Add other properties as needed
  }

  interface TabItem {
    id: string;
    label: string;
  }

  export let data: {
    Get_Composed_Index_deliveries?: ListedStock[];
  };
  let listedIndexStocks: ListedStock[] =
    data?.Get_Composed_Index_deliveries ?? [];
  let displayList: ListedStock[] = [];
  let rawData: ListedStock[] = listedIndexStocks;
  let optionsChartdata: any = {};
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
  onMount(async () => {
    optionsChartdata = await getMarketPlotOptions(
      rawData,
      "Delivey Vs Traded Volume",
    );
    isLoaded = true;
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  async function getMarketPlotOptions(data: any, title: string) {
    // Reverse the data
    const reversedData = [...data].reverse();

    // Function to abbreviate numbers
    const abbreviateNumber = (num: number) => {
      if (num >= 10000000) {
        return (num / 10000000).toFixed(2) + "Cr";
      } else if (num >= 100000) {
        return (num / 100000).toFixed(2) + "L";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + "K";
      }
      return num.toString();
    };

    const option = {
      title: false,
      tooltip: {
        trigger: "axis",
        backgroundColor: "#09090b",
        borderColor: "#333333",
        borderWidth: 1,
        textStyle: {
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif',
          fontWeight: "normal",
        },
      },
      legend: {
        textStyle: {
          color: "#ffffff",
          fontSize: 12,
          fontFamily: '"Inter", sans-serif',
          fontWeight: "normal",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "value",
        boundaryGap: [0, 0.01],
        axisLabel: {
          position: "top",
          formatter: (value: number) => abbreviateNumber(value),
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif',
          distance: 5,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#141417",
            type: "dashed",
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#303033",
          },
        },
      },
      yAxis: {
        type: "category",
        data: reversedData.map((each: any) => each?.Name),
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif',
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: "Traded Volume",
          type: "bar",
          data: reversedData.map((each: any) => each?.TV),
          itemStyle: {
            color: "#5532e6",
          },
        },

        {
          name: "Delivery Volume",
          type: "bar",
          data: reversedData.map((each: any) => each?.DV),
          itemStyle: {
            color: "#ff00fe",
          },
        },
      ],
    };
    return option;
  }

  async function infiniteHandler({
    detail: { loaded, complete },
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
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} Index
    Deliveries · octopi
  </title>
  <meta
    name="description"
    content={`A Index Deliveries Indian stock market, with dates, times and estimated revenue and events growth.`}
  />

  <!-- Other meta tags -->
  <meta property="og:title" content={`Events Calendar · octopi`} />
  <meta
    property="og:description"
    content={`A Index Deliveries Indian stock market, with dates, times and estimated revenue and events growth.`}
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
    content={`A Index Deliveries Indian stock market, with dates, times and estimated revenue and events growth.`}
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
    class="w-full max-w-7xl m-auto sm:bg-[#09090b] sm:rounded-xl h-auto mt-3 mb-8"
  >
    <div>
      <div class="overflow-x-auto border-t border-slate-800 p-3">
        <h1 class="text-white text-lg text-center mt-5 mb-5">Delivey Vs Traded Volume</h1>
        <Lazy
          height={800}
          fadeOption={{ delay: 100, duration: 500 }}
          keep={true}
        >
          <div class="w-full h-[1960px] mt-6">
            <EChart options={optionsChartdata} />
          </div>
        </Lazy>
      </div>
      <ScrollToTop />
    </div>
    <!-- Page wrapper -->
  </section>
{/if}

<style>
</style>
