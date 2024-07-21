<script lang="ts">
  import {
    AreaSeries,
    CandlestickSeries,
    Chart,
    PriceLine,
  } from "svelte-lightweight-charts";
  import { Chart as EChart } from "svelte-echarts";
  import Lazy from "svelte-lazy";
  import {
    currentPortfolioPrice,
    displayCompanyName,
    getCache,
    globalForm,
    isCrosshairMoveActive,
    isOpen,
    numberOfUnreadNotification,
    priceIncrease,
    realtimePrice,
    setCache,
    stockTicker,
    userRegion,
  } from "$lib/store";
  import { TrackingModeExitMode } from "lightweight-charts";
  import { onDestroy, onMount } from "svelte";
  import type { EChartsOption } from "echarts";
  interface BasicIndex {
    [key: string]: any;
  }
  const usRegion = ["cle1", "iad1", "pdx1", "sfo1"];

  let apiURL: string;
  let priceDetails: BasicIndex = {};
  let apiKey = import.meta.env.VITE_STOCKNEAR_API_KEY;

  userRegion?.subscribe((value) => {
    if (usRegion?.includes(value)) {
      apiURL = import.meta.env.VITE_USEAST_API_URL;
    } else {
      apiURL = import.meta.env.VITE_EU_API_URL;
    }
  });
  interface Data {
    [key: string]: any;
  }

  export let data: Data;
  export let form;

  console.log(data);

  let displayChartType = "line";

  let stockDeck = data?.getStockDeck ?? [];
  let fairPrice = data?.getFairPrice ?? [];
  let correlationList = data?.getCorrelation?.correlation ?? [];
  let prePostData = {};
  let similarstock = [];
  let topETFHolder = [];
  let previousClose = data?.getStockQuote?.previousClose;
  let marketMoods = {};
  let taRating = {};
  let communitySentiment = {};

  //============================================//

  let chart: any = null;
  async function checkChart() {
    if (chart) {
      clearInterval(intervalId);
      fitContentChart();
    }
  }

  let TARating;
  let StockSplits;
  let Correlation;
  let WIIM;
  let OptionPerFormanceChart: EChartsOption = {};

  onMount(async () => {
    OptionPerFormanceChart = await getMarketPlotOptions(
      data?.get_Technical_Performance_Benchmark,
      `${data?.companyName} Past Performance`,
    );
    priceDetails = { ...data?.Get_Latest_Listing_Price };
    WIIM = (await import("$lib/components/WIIM.svelte")).default;

    TARating = (await import("$lib/components/TARating.svelte")).default;
    StockSplits = (await import("$lib/components/StockSplits.svelte")).default;
    Correlation = (await import("$lib/components/Correlation.svelte")).default;
  });

  //const startTimeTracking = performance.now();

  //==========================//

  $: {
    if (output !== null) {
      //Bug value is NaN
      if (displayData === "1D") {
        const length = oneDayPrice?.length;
        for (let i = length - 1; i >= 0; i--) {
          if (!isNaN(oneDayPrice[i]?.close)) {
            currentDataRow = oneDayPrice[i];
            break;
          }
        }
      } else if (displayData === "6M") {
        currentDataRow = sixMonthPrice?.slice(-1)[0];
      }

      //currentDataRow = oneWeekPrice.slice(-1)[0]
      const change =
        displayData === "1D"
          ? (
              ((currentDataRow?.close ?? currentDataRow?.value) /
                previousClose -
                1) *
              100
            )?.toFixed(2)
          : (
              ((currentDataRow?.close ?? currentDataRow?.value) /
                displayLastLogicalRangeValue -
                1) *
              100
            )?.toFixed(2);

      const date = new Date(currentDataRow?.time);

      const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      };

      //const formattedDate = (displayData === '1D' || displayData === '1W' || displayData === '1M') ? date.toLocaleString('en-GB', options).replace(/\//g, '.') : date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
      const formattedDate =
        displayData === "1D" || displayData === "1W" || displayData === "1M"
          ? date.toLocaleString("en-US", options)
          : date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

      displayLegend = {
        close: currentDataRow?.close ?? currentDataRow?.value,
        date: formattedDate,
        change: isNaN(parseInt(change)) ? priceDetails.CZG : change,
      };
    }
  }

  //==========================//

  $: {
    if ($stockTicker && typeof window !== "undefined") {
      // add a check to see if running on client-side
      if ($realtimePrice !== null && $realtimePrice !== 0) {
        $realtimePrice =
          $realtimePrice !== 0 ? $realtimePrice : data?.getStockQuote?.price;
        $currentPortfolioPrice = $realtimePrice;
      } else if (oneDayPrice?.length !== 0) {
        const length = oneDayPrice?.length;
        for (let i = length - 1; i >= 0; i--) {
          if (!isNaN(oneDayPrice[i]?.close)) {
            $currentPortfolioPrice = oneDayPrice[i]?.close;
            break;
          }
        }
      }
    }
  }

  let displayData: any;
  let colorChange: any;
  let topColorChange: any;
  let bottomColorChange: any;

  let lastValue: any;
  async function changeData(state: any) {
    switch (state) {
      case "1D":
        displayData = "1D";
        if (oneDayPrice?.length !== 0) {
          displayLastLogicalRangeValue = oneDayPrice?.at(0)?.close; //previousClose
          const length = oneDayPrice?.length;
          for (let i = length - 1; i >= 0; i--) {
            if (!isNaN(oneDayPrice[i]?.close)) {
              lastValue = oneDayPrice[i]?.close;
              break;
            }
          }
        } else {
          displayLastLogicalRangeValue = null;
          lastValue = null;
        }
        break;
      case "1W":
        displayData = "1W";
        await historicalPrice("one-week");
        if (oneWeekPrice?.length !== 0) {
          displayLastLogicalRangeValue = oneWeekPrice?.at(0)?.close;
          lastValue = oneWeekPrice?.slice(-1)?.at(0)?.close;
        } else {
          displayLastLogicalRangeValue = null;
          lastValue = null;
        }

        break;
      case "1M":
        displayData = "1M";
        await historicalPrice("one-month");
        if (oneMonthPrice?.length !== 0) {
          displayLastLogicalRangeValue = oneMonthPrice?.at(0)?.close;
          lastValue = oneMonthPrice.slice(-1)?.at(0)?.close;
        } else {
          displayLastLogicalRangeValue = null;
          lastValue = null;
        }
        break;

      case "6M":
        displayData = "6M";
        await historicalPrice("six-months");
        if (sixMonthPrice?.length !== 0) {
          displayLastLogicalRangeValue = sixMonthPrice?.at(0)?.close;
          lastValue = sixMonthPrice?.slice(-1)?.at(0)?.close;
        } else {
          displayLastLogicalRangeValue = null;
          lastValue = null;
        }
        break;
      case "1Y":
        displayData = "1Y";
        await historicalPrice("one-year");
        if (oneYearPrice?.length !== 0) {
          displayLastLogicalRangeValue = oneYearPrice?.at(0)?.close;
          lastValue = oneYearPrice.slice(-1)?.at(0)?.close;
        } else {
          displayLastLogicalRangeValue = null;
          lastValue = null;
        }

        break;
      case "MAX":
        displayData = "MAX";
        await historicalPrice("max");
        if (threeYearPrice?.length !== 0) {
          displayLastLogicalRangeValue = threeYearPrice?.at(0)?.close;
          lastValue = threeYearPrice.slice(-1)?.at(0)?.close;
        } else {
          displayLastLogicalRangeValue = null;
          lastValue = null;
        }

        break;
      default:
        return;
    }
    colorChange =
      lastValue < displayLastLogicalRangeValue ? "#FF2F1F" : "#10DB06";
    topColorChange =
      lastValue < displayLastLogicalRangeValue
        ? "rgb(255, 47, 31, 0.2)"
        : "rgb(16, 219, 6, 0.2)";
    bottomColorChange =
      lastValue < displayLastLogicalRangeValue
        ? "rgb(255, 47, 31, 0.001)"
        : "rgb(16, 219, 6, 0.001)";

    fitContentChart();

    //trackButtonClick('Time Period: '+ state)
  }

  let output: any = null;

  //====================================//

  let intervalId: any = null;
  let oneDayPrice: any = [];
  let oneWeekPrice: any = [];
  let oneMonthPrice: any = [];
  let sixMonthPrice: any = [];

  let oneYearPrice: any = [];
  let threeYearPrice: any = [];

  async function historicalPrice(timePeriod: string) {
    const cachedData = getCache($stockTicker, "historicalPrice" + timePeriod);
    if (cachedData) {
      switch (timePeriod) {
        case "one-week":
          oneWeekPrice = cachedData;
          break;
        case "one-month":
          oneMonthPrice = cachedData;
          break;
        case "six-months":
          sixMonthPrice = cachedData;
          break;
        case "one-year":
          oneYearPrice = cachedData;
          break;
        case "max":
          threeYearPrice = cachedData;
          break;
        default:
          console.log(`Unsupported time period: ${timePeriod}`);
      }
    } else {
      output = null;
      output = [...data?.Get_Price_details] ?? [];
      const mappedData = output?.map((item: any) => ({
        time: Date.parse(item?.Dt),
        open: item?.open !== null ? item?.O : NaN,
        high: item?.high !== null ? item?.H : NaN,
        low: item?.low !== null ? item?.L : NaN,
        close: item?.close !== null ? item?.C : NaN,
      }));
      try {
        switch (timePeriod) {
          case "one-week":
            oneWeekPrice = mappedData;
            break;
          case "one-month":
            oneMonthPrice = mappedData;
            break;
          case "six-months":
            sixMonthPrice = mappedData;
            break;
          case "one-year":
            oneYearPrice = mappedData;
            break;
          case "max":
            threeYearPrice = mappedData;
            break;
          default:
            console.log(`Unsupported time period: ${timePeriod}`);
        }
        setCache($stockTicker, mappedData, "historicalPrice" + timePeriod);
      } catch (e) {
        console.log(e);
      }
    }
  }

  async function initializePrice() {
    output = null;
    if (intervalId) {
      clearInterval(intervalId);
    }
    intervalId = setInterval(checkChart, 0);
    try {
      output = [...data?.Get_Price_details] ?? [];
      oneDayPrice = output?.map((item: any) => ({
        time: Date.parse(item?.Dt),
        open: item?.open !== null ? item?.O : NaN,
        high: item?.high !== null ? item?.H : NaN,
        low: item?.low !== null ? item?.L : NaN,
        close: item?.close !== null ? item?.C : NaN,
      }));

      displayData =
        oneDayPrice?.length === 0 && sixMonthPrice?.length !== 0 ? "6M" : "1D";
      //lastValue = oneDayPrice[oneDayPrice?.length - 1]?.value;
      if (displayData === "1D") {
        const length = oneDayPrice?.length;
        for (let i = length - 1; i >= 0; i--) {
          if (!isNaN(oneDayPrice[i]?.close)) {
            lastValue = oneDayPrice[i]?.close;
            break;
          }
        }
      } else if (displayData === "6M") {
        lastValue = sixMonthPrice?.slice(-1)?.at(0)?.close;
      }

      displayLastLogicalRangeValue =
        oneDayPrice?.length === 0 && sixMonthPrice?.length !== 0
          ? sixMonthPrice?.at(0)?.close
          : oneDayPrice?.at(0)?.close; //previousClose;

      //colorChange = lastValue < displayLastLogicalRangeValue ? "#CC3636" : "#367E18";

      colorChange =
        lastValue < displayLastLogicalRangeValue ? "#FF2F1F" : "#10DB06";
      topColorChange =
        lastValue < displayLastLogicalRangeValue
          ? "rgb(255, 47, 31, 0.2)"
          : "rgb(16, 219, 6, 0.2)";
      bottomColorChange =
        lastValue < displayLastLogicalRangeValue
          ? "rgb(255, 47, 31, 0.001)"
          : "rgb(16, 219, 6, 0.001)";
    } catch (e) {
      console.log(e);
    }
  }

  async function getPrePostQuote() {
    if (!$isOpen) {
      const postData = { ticker: $stockTicker };
      const response = await fetch(apiURL + "/pre-post-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": apiKey,
        },
        body: JSON.stringify(postData),
      });

      prePostData = await response.json();
    }
  }

  let currentDataRow: any = { value: "-", date: "-" };

  let lineLegend: any = null;
  let displayLegend: any = { close: "-", date: "-" };

  function handleSeriesReference(ref: any) {
    try {
      lineLegend = ref;
    } catch (error) {
      console.log(error);
    }
  }

  async function handleCrosshairMove({ detail: param }) {
    if (
      param?.time &&
      !isNaN(
        param?.seriesData?.get(lineLegend)?.close ??
          param?.seriesData?.get(lineLegend)?.value,
      )
    ) {
      $isCrosshairMoveActive = true;
      try {
        let graphData;
        graphData = param?.seriesData?.get(lineLegend);

        const price = graphData?.close ?? graphData?.value;
        const dateObj = graphData?.time;
        const date = new Date(dateObj);

        const options: any = {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        };

        //const formattedDate = (displayData === '1D' || displayData === '1W' || displayData === '1M') ? date.toLocaleString('en-GB', options).replace(/\//g, '.') : date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })?.replace(/\//g, '.');

        const formattedDate =
          displayData === "1D" || displayData === "1W" || displayData === "1M"
            ? date.toLocaleString("en-US", options)
            : date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
        const change: any = (
          (price / displayLastLogicalRangeValue - 1) *
          100
        )?.toFixed(2);
        displayLegend = {
          close: price?.toFixed(2),
          date: formattedDate,
          change: change,
        };
      } catch (error) {
        //pass;
      }
    } else {
      //currentDataRow = oneDayPrice[oneDayPrice?.length - 1];
      const length = oneDayPrice?.length;
      for (let i = length - 1; i >= 0; i--) {
        if (!isNaN(oneDayPrice[i]?.close)) {
          currentDataRow = oneDayPrice[i];
          break;
        }
      }
    }
  }

  let displayLastLogicalRangeValue: any;

  const fitContentChart = async () => {
    if (displayData === "1Y" && oneYearPrice?.length === 0) {
    } else if (chart !== null && typeof window !== "undefined") {
      chart?.timeScale().fitContent();
      chart?.applyOptions({
        trackingMode: {
          exitMode: TrackingModeExitMode.OnTouchEnd,
        },
      });
    }
  };

  let width = 580;
  //Initial height of graph
  let height = 350;

  let observer: any;
  let ref;

  ref = (element: any) => {
    if (observer) {
      observer?.disconnect();
    }
    if (!element) {
      return;
    }

    observer = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    });
    observer.observe(element);
  };

  //===============================================//

  const options = {
    width: width,
    height: height,
    layout: {
      background: {
        color: "#09090B",
      },
    },
    grid: {
      vertLines: {
        color: "#09090B",
        visible: false,
      },
      horzLines: {
        color: "#09090B",
        visible: false,
      },
    },
    crosshair: {
      // hide the horizontal crosshair line
      horzLine: {
        visible: false,
        labelVisible: false,
      },
      // hide the vertical crosshair label
      vertLine: {
        labelVisible: false,
        style: 0,
      },
    },
    rightPriceScale: {
      visible: false,
      borderColor: "rgba(197, 203, 206, 0.8)",
    },
    leftPriceScale: {
      visible: false,
      borderColor: "rgba(197, 203, 206, 0.8)",
    },
    handleScale: {
      mouseWheel: false,
    },
    handleScroll: {
      mouseWheel: false,
      horzTouchDrag: false,
      vertTouchDrag: false,
      pressedMouseMove: false,
    },
    timeScale: {
      borderColor: "#FFFFFF",
      textColor: "#FFFFFF",
      visible: false,
      fixLeftEdge: true,
      fixRightEdge: true,
    },
  };

  onDestroy(async () => {
    $priceIncrease = null;
    $globalForm = [];
  });

  function changeChartType() {
    if (displayChartType === "line") {
      displayChartType = "candlestick";
    } else {
      displayChartType = "line";
    }
  }

  $: {
    if ($stockTicker && typeof window !== "undefined") {
      // add a check to see if running on client-side
      oneDayPrice = [];
      oneWeekPrice = [];
      oneMonthPrice = [];
      oneYearPrice = [];
      threeYearPrice = [];
      prePostData = {};
      marketMoods = {};
      taRating = {};
      communitySentiment = {};
      output = null;

      fairPrice = data?.getFairPrice;
      stockDeck = data?.getStockDeck;
      correlationList = data?.getCorrelation?.correlation;
      previousClose = data?.getStockQuote?.previousClose;
      marketMoods = data?.getBullBearSay;
      taRating = data?.getStockTARating;
      communitySentiment = data?.getCommunitySentiment;

      similarstock = data?.getSimilarStock;
      topETFHolder = data?.getTopETFHolder;
      //previousClose = stockDeck?.at(0)?.previousClose;

      const asyncFunctions = [getPrePostQuote()];

      Promise.all(asyncFunctions)
        .then((results) => {
          initializePrice();
        })
        .catch((error) => {
          console.error("An error occurred:", error);
        });
    }
  }

  $: {
    if (form) {
      $globalForm = form;
    }
  }

  async function getMarketPlotOptions(data: any, title: string) {
    const option = {
      title: {
        text: title,
        left: "center",
        top: 0,
        textStyle: {
          color: "#ffffff",
          fontSize: 12,
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
              color: "#141417",
            },
          },
          data: [...data?.map((each: any) => each?.Label)],
        },
      ],
      tooltip: {
        trigger: "axis",
        backgroundColor: "#09090b",
        borderColor: "#333333",
        borderWidth: 1,
        textStyle: {
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif',
        },
        formatter: (params) => {
          console.log(params);
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
          data: [...data?.map((each: any) => each?.ChangePercent)],
        },
      ],
      grid: {
        left: "3%",
        right: "4%",
        top: "15%",
        bottom: "5%",
        containLabel: true,
        show: true,
        borderColor: "#09090b",
        borderWidth: 0,
        backgroundColor: "#09090b",
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
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""}
    {$displayCompanyName} ({$stockTicker}) Stock Price, Quote & News · stocknear
  </title>

  <meta
    name="description"
    content={`Get a real-time ${$displayCompanyName} (${$stockTicker}) stock price quote with breaking news, financials, statistics, charts and more.`}
  />
  <!-- Other meta tags -->
  <meta
    property="og:title"
    content={`${$displayCompanyName} (${$stockTicker}) Stock Price, Quote & News · stocknear`}
  />
  <meta
    property="og:description"
    content={`Get a real-time ${$displayCompanyName} (${$stockTicker}) stock price quote with breaking news, financials, statistics, charts and more.`}
  />
  <!--<meta property="og:image" content="https://stocknear-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"/>-->
  <meta property="og:type" content="website" />
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content={`${$displayCompanyName} (${$stockTicker}) Stock Price, Quote & News · stocknear`}
  />
  <meta
    name="twitter:description"
    content={`Get a real-time ${$displayCompanyName} (${$stockTicker}) stock price quote with breaking news, financials, statistics, charts and more.`}
  />
  <!--<meta name="twitter:image" content="https://stocknear-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"/>-->
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>

<section class="bg-[#09090B] min-h-screen overflow-hidden">
  <div class="w-full max-w-4xl m-auto overflow-hidden">
    <div class="md:flex md:justify-between md:divide-x md:divide-slate-800">
      <!-- Main content -->
      <div class="pb-12 md:pb-20 w-full max-w-3xl sm:pr-6 xl:pr-0">
        <div class="xl:pr-10">
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-label-has-associated-control -->

          <div
            class="hidden sm:flex flex-row items-center pl-1 sm:pl-6 w-full mt-4"
          >
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("1D")}
                class="text-sm font-medium text-gray-400 {displayData === '1D'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                1D
              </button>
              <div
                class="{displayData === '1D'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem] rounded-full"
              />
            </div>
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("1W")}
                class="w-full text-sm font-medium text-gray-400 {displayData ===
                '1W'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                1W
              </button>
              <div
                class="{displayData === '1W'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("1M")}
                class="text-sm font-medium text-gray-400 {displayData === '1M'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                1M
              </button>
              <div
                class="{displayData === '1M'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("6M")}
                class="text-sm font-medium text-gray-400 {displayData === '6M'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                6M
              </button>
              <div
                class="{displayData === '6M'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("1Y")}
                class="text-sm font-medium text-gray-400 {displayData === '1Y'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                1Y
              </button>
              <div
                class="{displayData === '1Y'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>

            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("MAX")}
                class="text-sm font-medium text-gray-400 {displayData === 'MAX'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                MAX
              </button>
              <div
                class="{displayData === 'MAX'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>

            <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
            <label
              on:click={changeChartType}
              class="ml-auto -mt-3 block cursor-pointer bg-[#09090B] sm:hover:bg-[#09090B] duratiion-100 transition ease-in-out px-3 py-1 rounded-lg shadow-sm"
            >
              {#if displayChartType === "line"}
                <svg
                  class="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="white"
                    d="M7 20v-2H5V6h2V4h2v2h2v12H9v2zm8 0v-5h-2V8h2V4h2v4h2v7h-2v5z"
                  /></svg
                >
              {:else}
                <svg
                  class="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="none"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 16.5L9 10l4 6l8-9.5"
                  /></svg
                >
              {/if}
            </label>
          </div>
          <!--End Time Interval-->

          <!--End Ticker Section-->
          <!-- Start Graph -->

          {#if output !== null}
            <div class="w-full sm:pl-7 ml-auto max-w-3xl mb-10">
              {#if displayData === "1D" && oneDayPrice?.length === 0}
                <h2
                  class=" mt-20 flex h-[240px] justify-center items-center text-3xl font-bold text-slate-700 mb-20 m-auto"
                >
                  No data available
                </h2>
              {:else if displayData === "1W" && oneWeekPrice?.length === 0}
                <h2
                  class=" mt-20 flex h-[240px] justify-center items-center text-3xl font-bold text-slate-700 mb-20 m-auto"
                >
                  No data available
                </h2>
              {:else if displayData === "1M" && oneMonthPrice?.length === 0}
                <h2
                  class=" mt-20 flex h-[240px] justify-center items-center text-3xl font-bold text-slate-700 mb-20 m-auto"
                >
                  No data available
                </h2>
              {:else if displayData === "6M" && sixMonthPrice?.length === 0}
                <h2
                  class=" mt-20 flex h-[240px] justify-center items-center text-3xl font-bold text-slate-700 mb-20 m-auto"
                >
                  No data available
                </h2>
              {:else if displayData === "1Y" && oneYearPrice?.length === 0}
                <h2
                  class=" mt-20 flex h-[240px] justify-center items-center text-3xl font-bold text-slate-700 mb-20 m-auto"
                >
                  No data available
                </h2>
              {:else if displayData === "MAX" && threeYearPrice?.length === 0}
                <h2
                  class=" mt-20 flex h-[240px] justify-center items-center text-3xl font-bold text-slate-700 mb-20 m-auto"
                >
                  No data available
                </h2>
              {:else}
                <Chart
                  {...options}
                  autoSize={true}
                  ref={(ref) => (chart = ref)}
                  on:crosshairMove={handleCrosshairMove}
                >
                  {#if displayData === "1D"}
                    {#if displayChartType === "line"}
                      <AreaSeries
                        data={oneDayPrice?.map(({ time, close }) => ({
                          time,
                          value: close,
                        }))}
                        lineWidth={1.5}
                        priceScaleId="left"
                        lineColor={colorChange}
                        topColor={topColorChange}
                        bottomColor={bottomColorChange}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                        lastPriceAnimation={1}
                      >
                        <PriceLine
                          price={oneDayPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </AreaSeries>
                    {:else}
                      <CandlestickSeries
                        data={oneDayPrice}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                      >
                        <PriceLine
                          price={oneDayPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </CandlestickSeries>
                    {/if}
                  {:else if displayData === "1W"}
                    {#if displayChartType === "line"}
                      <AreaSeries
                        data={oneWeekPrice?.map(({ time, close }) => ({
                          time,
                          value: close,
                        }))}
                        lineWidth={1.5}
                        priceScaleId="left"
                        lineColor={colorChange}
                        topColor={topColorChange}
                        bottomColor={bottomColorChange}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                        lastPriceAnimation={1}
                      >
                        <PriceLine
                          price={oneWeekPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </AreaSeries>
                    {:else}
                      <CandlestickSeries
                        data={oneWeekPrice}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                      >
                        <PriceLine
                          price={oneWeekPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </CandlestickSeries>
                    {/if}
                  {:else if displayData === "1M"}
                    {#if displayChartType === "line"}
                      <AreaSeries
                        data={oneMonthPrice?.map(({ time, close }) => ({
                          time,
                          value: close,
                        }))}
                        lineWidth={1.5}
                        priceScaleId="left"
                        lineColor={colorChange}
                        topColor={topColorChange}
                        bottomColor={bottomColorChange}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                        lastPriceAnimation={1}
                      >
                        <PriceLine
                          price={oneMonthPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </AreaSeries>
                    {:else}
                      <CandlestickSeries
                        data={oneMonthPrice}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                      >
                        <PriceLine
                          price={oneMonthPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </CandlestickSeries>
                    {/if}
                  {:else if displayData === "6M"}
                    {#if displayChartType === "line"}
                      <AreaSeries
                        data={sixMonthPrice?.map(({ time, close }) => ({
                          time,
                          value: close,
                        }))}
                        lineWidth={1.5}
                        priceScaleId="left"
                        lineColor={colorChange}
                        topColor={topColorChange}
                        bottomColor={bottomColorChange}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                        lastPriceAnimation={1}
                      >
                        <PriceLine
                          price={sixMonthPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </AreaSeries>
                    {:else}
                      <CandlestickSeries
                        data={sixMonthPrice}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                      >
                        <PriceLine
                          price={sixMonthPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </CandlestickSeries>
                    {/if}
                  {:else if displayData === "1Y"}
                    {#if displayChartType === "line"}
                      <AreaSeries
                        data={oneYearPrice?.map(({ time, close }) => ({
                          time,
                          value: close,
                        }))}
                        lineWidth={1.5}
                        priceScaleId="left"
                        lineColor={colorChange}
                        topColor={topColorChange}
                        bottomColor={bottomColorChange}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                        lastPriceAnimation={1}
                      >
                        <PriceLine
                          price={oneYearPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </AreaSeries>
                    {:else}
                      <CandlestickSeries
                        data={oneYearPrice}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                      >
                        <PriceLine
                          price={oneYearPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </CandlestickSeries>
                    {/if}
                  {:else if displayData === "MAX"}
                    {#if displayChartType === "line"}
                      <AreaSeries
                        data={threeYearPrice?.map(({ time, close }) => ({
                          time,
                          value: close,
                        }))}
                        lineWidth={1.5}
                        priceScaleId="left"
                        lineColor={colorChange}
                        topColor={topColorChange}
                        bottomColor={bottomColorChange}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                        lastPriceAnimation={1}
                      >
                        <PriceLine
                          price={threeYearPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </AreaSeries>
                    {:else}
                      <CandlestickSeries
                        data={threeYearPrice}
                        crosshairMarkerVisible={false}
                        ref={handleSeriesReference}
                        priceLineVisible={false}
                      >
                        <PriceLine
                          price={threeYearPrice?.at(0)?.close}
                          lineWidth={1}
                          color="#fff"
                        />
                      </CandlestickSeries>
                    {/if}
                  {/if}
                </Chart>
              {/if}
            </div>
          {:else}
            <!-- else output not loaded yet-->
            <div
              class="flex justify-center w-full sm:w-[650px] h-80 sm:w-[600px] items-center"
            >
              <div class="relative">
                <!-- svelte-ignore a11y-label-has-associated-control -->
                <label
                  class="bg-[#09090B] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <span class="loading loading-spinner loading-md"></span>
                </label>
              </div>
            </div>
          {/if}

          <!--End Graph-->

          <!--Start Time Interval-->
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <div class="pl-1 w-screen sm:hidden flex flex-row items-center">
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("1D")}
                class="text-sm font-medium text-gray-400 {displayData === '1D'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                1D
              </button>
              <div
                class="{displayData === '1D'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem] rounded-full"
              />
            </div>
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("1W")}
                class="w-full text-sm font-medium text-gray-400 {displayData ===
                '1W'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                1W
              </button>
              <div
                class="{displayData === '1W'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("1M")}
                class="text-sm font-medium text-gray-400 {displayData === '1M'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                1M
              </button>
              <div
                class="{displayData === '1M'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("6M")}
                class="text-sm font-medium text-gray-400 {displayData === '6M'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                6M
              </button>
              <div
                class="{displayData === '6M'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>
            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("1Y")}
                class="text-sm font-medium text-gray-400 {displayData === '1Y'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                1Y
              </button>
              <div
                class="{displayData === '1Y'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>

            <div class="flex flex-col items-center mr-4">
              <button
                on:click={() => changeData("MAX")}
                class="text-sm font-medium text-gray-400 {displayData === 'MAX'
                  ? 'text-white '
                  : 'bg-[#09090B]'}"
              >
                MAX
              </button>
              <div
                class="{displayData === 'MAX'
                  ? `bg-[${colorChange}]`
                  : 'bg-[#09090B]'} mt-1 h-[3px] w-[1.5rem]"
              />
            </div>

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <label
              on:click={changeChartType}
              class="ml-auto mr-5 -mt-1 sm:hidden border border-slate-800 px-2.5 py-1 rounded-xl"
            >
              {#if displayChartType === "line"}
                <svg
                  class="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="white"
                    d="M7 20v-2H5V6h2V4h2v2h2v12H9v2zm8 0v-5h-2V8h2V4h2v4h2v7h-2v5z"
                  /></svg
                >
              {:else}
                <svg
                  class="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="none"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M3 16.5L9 10l4 6l8-9.5"
                  /></svg
                >
              {/if}
            </label>
          </div>
          <!--End Time Interval-->
          <div class="flex flex-row items-start w-full sm:pl-6 mt-4">
            <div class="flex flex-col items-start justify-start w-full">
              <div
                class="text-lg md:text-lg font-bold text-white flex flex-row items-center w-full"
              >
                {#if $isCrosshairMoveActive}
                  {$stockTicker?.includes(".DE") ||
                  $stockTicker?.includes(".PA") ||
                  $stockTicker?.includes(".F")
                    ? `${displayLegend?.close}`
                    : ` ${displayLegend?.close}`}
                {:else if !$isCrosshairMoveActive && $realtimePrice !== null}
                  {$stockTicker?.includes(".DE") ||
                  $stockTicker?.includes(".PA") ||
                  $stockTicker?.includes(".F")
                    ? `${$currentPortfolioPrice}`
                    : ` ${$currentPortfolioPrice}`}
                {:else}
                  {$stockTicker?.includes(".DE") ||
                  $stockTicker?.includes(".PA") ||
                  $stockTicker?.includes(".F")
                    ? `${displayLegend?.close}`
                    : ` ${displayLegend?.close}`}
                {/if}

                {#if $priceIncrease === true}
                  <div
                    style="background-color: green;"
                    class="inline-block pulse rounded-full w-3 h-3 ml-2"
                  ></div>
                {:else if $priceIncrease === false}
                  <div
                    style="background-color: red;"
                    class="inline-block pulse rounded-full w-3 h-3 ml-2"
                  ></div>
                {/if}
              </div>

              <div class="flex flex-row items-center w-full">
                {#if displayLegend?.change >= 0}
                  <svg
                    class="inline-block w-5 h-5 mt-0.5 -mr-0.5"
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
                  <span
                    class="items-center justify-start text-[#10DB06] font-medium text-xs sm:text-sm"
                    >+{displayLegend?.change}%</span
                  >
                {:else if displayLegend?.change < 0}
                  <svg
                    class="inline-block w-5 h-5 mt-0.5 -mr-0.5 rotate-180"
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
                  <span
                    class="items-center justify-start text-[#FF2F1F] font-medium text-xs sm:text-sm"
                    >{displayLegend?.change}%
                  </span>
                {/if}

                <span class="ml-3 text-white text-xs sm:text-sm"
                  >{displayLegend?.date}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="overflow-x-auto border-t border-[#2a2e39] p-3">
    <Lazy height={800} fadeOption={{ delay: 100, duration: 500 }} keep={true}>
      <div class="w-full h-[360px] mt-6">
        <EChart options={OptionPerFormanceChart} />
      </div>
    </Lazy>
  </div>
</section>

<!--End-Indicator-Modal-->

<style lang="scss">
  canvas {
    width: 100%;
    height: 100%;
    max-width: 800px;
    max-height: 450px;
  }

  .pulse {
    position: relative;
    animation: pulse-animation 1s forwards cubic-bezier(0.5, 0, 0.5, 1);
  }

  @keyframes pulse-animation {
    0% {
      transform: scale(0.9);
      opacity: 1;
    }
    100% {
      transform: scale(0.9);
      opacity: 0;
    }
  }

  :root {
    --date-picker-background: #09090b;
    --date-picker-foreground: #f7f7f7;
  }
</style>
