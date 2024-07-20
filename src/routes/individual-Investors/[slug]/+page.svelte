<script lang="ts">
  import democraticBackground from "$lib/images/bg-republican.png";
  import { numberOfUnreadNotification, screenWidth } from "$lib/store";
  import { Chart } from "svelte-echarts";
  import { onMount } from "svelte";
  import Lazy from "svelte-lazy";
  export let data;

  let rawData: any;
  let bioDataContent: any = null;
  let investorStockList: any = null;
  let investorGraphData: any = null;
  let investor_quaterlist: any = null;
  let investor_name: any = null;
  let displayList = [];
  let optionsData = {};
  let optionsMarCapData = {};
  let isLoading = true;
  let name = rawData?.Name;
  let numOfAssets = new Set([])?.size;

  function generateNetWorth(seed) {
    const a = 166452590;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    let rand = (a * seed + c) % m;
    rand = rand / m;
    return rand * (10 - 20) + 20;
  }

  async function getPlotOptions(sortedData) {
    const option = {
      silent: false,
      title: {
        text: "Sectorial Holdings",
        left: "center",
        top: 0,
        textStyle: {
          color: "#ffffff",
          fontSize: 22,
          fontFamily: '"Inter", sans-serif',
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "item",
        backgroundColor: "#09090b",
        borderColor: "#333333",
        borderWidth: 1,
        textStyle: {
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif',
        },
        formatter: (params: any) => {
          return `${params.name}: ${params.percent.toFixed(2)}%`;
        },
      },
      legend: false,
      series: [
        {
          name: "",
          type: "pie",
          radius: ["20%", "70%"],
          center: ["50%", "50%"],
          startAngle: 0,
          endAngle: 360,
          color: [
            "#5532E6",
            "#9c27b0",
            "#00ff19",
            "#ad00ff",
            "#ebff00",
            "#da9b0a",
            "#c75e70",
            "#0057ff",
            "#00bcd4",
          ],
          data: [...sortedData],
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {d}%",
            fontSize: 12,
            color: "#fff",
            backgroundColor: "#09090b",
            borderColor: "#333333",
            borderWidth: 1,
            borderRadius: 4,
            padding: [4, 8],
            rotate: 0,
            align: "center",
            verticalAlign: "middle",
            fontFamily: '"Inter", sans-serif',
            fontWeight: "normal",
            rich: {
              a: {
                color: "#999",
                lineHeight: 22,
                align: "center",
                fontFamily: '"Inter", sans-serif',
                fontWeight: "normal",
              },
              b: {
                fontSize: 16,
                lineHeight: 33,
                fontFamily: '"Inter", sans-serif',
                fontWeight: "normal",
              },
            },
          },
          labelLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.5)",
            },
            smooth: 0.1,
            length: 20,
            length2: 20,
          },
          animationType: "scale",
          animationEasing: "elasticOut",
        },
      ],
    };
    return option;
  }

  async function getMarketPlotOptions(sortedDataSize) {
    const option = {
      title: {
        text: "Size Analysis",
        left: "center",
        top: 0,
        textStyle: {
          color: "#ffffff",
          fontSize: 22,
          fontFamily: '"Inter", sans-serif',
          fontWeight: "normal",
        },
      },
      silent: true,
      yAxis: {
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
      xAxis: {
        type: "category",
        data: [...sortedDataSize?.map((each) => each.name)],
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
      },
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
          return `${params[0].name}: ${params[0].value.toFixed(2)}%`;
        },
      },
      legend: false,
      series: [
        {
          name: "Market Cap Distribution",
          type: "bar",
          barGap: "-100%", // This ensures no gap between bars
          barCategoryGap: "0%",
          data: sortedDataSize.map((each, index) => ({
            value: parseFloat(each.value.toFixed(2)),
            name: each.name,
            itemStyle: {
              color: ["#c75e70", "#00bcd4", "#ebff00", "#da9b0a"][index % 5],
            },
            label: {
              show: true,
              position: "top",
              color: "#ffffff",
              fontFamily: '"Inter", sans-serif',
              formatter: "{c}%",
            },
          })),
          animation: false,
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
    option.height = 200;
    return option;
  }

  async function processData() {
    rawData = data.getIndividualInstitutionalInvestor;
    bioDataContent = rawData?.Getindividual_InvesterBioData?.[0];
    investorStockList = rawData?.Getindividual_StockList;
    investorGraphData = rawData?.Getindividual_graph;
    investor_quaterlist = rawData?.Getindividual_quaterlist;
    investor_name = rawData?.Getindividual_InvesterBioData?.[0]?.investor_name;
    const sortedData: any = investorGraphData?.sec_analysis
      ? Object.entries(investorGraphData?.sec_analysis)
          .sort(([, a], [, b]) => b - a)
          .map(([name, value]) => ({ name, value }))
      : [];
    const sortedDataSize: any = investorGraphData?.size_analysis
      ? Object.entries(investorGraphData?.size_analysis)
          .sort(([, a], [, b]) => b - a)
          .map(([name, value]) => ({ name, value }))
      : [];

    name = rawData?.Name;
    optionsData = await getPlotOptions(sortedData);
    optionsMarCapData = await getMarketPlotOptions(sortedDataSize);
    isLoading = false;
  }

  onMount(async () => {
    processData();
  });

  let charNumber = 40;
  $: {
    if ($screenWidth < 640) {
      charNumber = 15;
    } else {
      charNumber = 40;
    }
  }

  function sectoralAllocationOverview(allocation) {
    const sectors = Object.entries(allocation).sort((a, b) => b[1] - a[1]);
    const totalAllocation = sectors.reduce((sum, [_, value]) => sum + value, 0);
    const topSectors = sectors.slice(0, 5);
    const otherSectors = sectors.slice(5);
    const otherAllocation = otherSectors.reduce(
      (sum, [_, value]) => sum + value,
      0,
    );

    const insights = [
      `The portfolio is diversified across <strong>${sectors.length}</strong> sectors.`,
      `The top 5 sectors account for <strong>${topSectors.reduce((sum, [_, value]) => sum + value, 0).toFixed(2)}%</strong> of the portfolio.`,
      `<strong>${topSectors[0][0]}</strong> is the largest sector, representing <strong>${topSectors[0][1].toFixed(2)}%</strong> of the portfolio.`,
      `The smallest allocation is to <strong>${sectors[sectors.length - 1][0]}</strong> at ${sectors[sectors.length - 1][1].toFixed(2)}%.`,
      `The remaining ${otherSectors.length} sectors collectively make up ${otherAllocation.toFixed(2)}% of the portfolio.`,
    ];

    if (totalAllocation < 99.5 || totalAllocation > 100.5) {
      insights.push(
        `Note: Total allocation (${totalAllocation.toFixed(2)}%) is not exactly 100%. This may be due to rounding or incomplete data.`,
      );
    }

    return ` <ul class="space-y-4">
      ${insights
        .map(
          (insight) => `
        <li class="flex items-start">
          <svg viewBox="0 0 24 24" class="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-green-400">
            <path fill="currentColor" d="m16.298,8.288l1.404,1.425-5.793,5.707c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701Zm7.702,3.712c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z"/>
          </svg>
          <span>${insight}</span>
        </li>
      `,
        )
        .join("")}
    </ul>`;
  }

  function industryAndSizeInsights(data) {
    const industryData = data.ind_analysis;
    const sizeData = data.size_analysis;

    // Sort industries by allocation
    const sortedIndustries = Object.entries(industryData).sort(
      (a, b) => b[1] - a[1],
    );

    // Calculate total allocation
    const totalIndustryAllocation = sortedIndustries.reduce(
      (sum, [_, value]) => sum + value,
      0,
    );

    // Get top 3 industries
    const top3Industries = sortedIndustries.slice(0, 3);

    // Sort size categories
    const sortedSizes = Object.entries(sizeData).sort((a, b) => b[1] - a[1]);

    const insights = [
      `<strong class="text-green-400">Industry Concentration:</strong> The top 3 industries (${top3Industries.map(([name, _]) => name).join(", ")}) account for <strong>${top3Industries.reduce((sum, [_, value]) => sum + value, 0).toFixed(2)}%</strong> of the portfolio, with ${top3Industries[0][0]} leading at ${top3Industries[0][1].toFixed(2)}%.`,

      `<strong class="text-green-400">Industry Diversity:</strong> The portfolio is spread across <strong>${sortedIndustries.length}</strong> different industries, with allocations ranging from ${sortedIndustries[0][1].toFixed(2)}% to ${sortedIndustries[sortedIndustries.length - 1][1].toFixed(2)}%.`,

      `<strong class="text-green-400">Market Cap Distribution:</strong> The portfolio is primarily focused on <strong>${sortedSizes[0][0]}</strong> cap stocks, which make up ${sortedSizes[0][1].toFixed(2)}% of the allocation, followed by ${sortedSizes[1][0]} cap at ${sortedSizes[1][1].toFixed(2)}%.`,
    ];

    return `<ul class="space-y-4">
    ${insights
      .map(
        (insight) => `
      <li class="flex items-start">
        <svg viewBox="0 0 24 24" class="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-green-400">
          <path fill="currentColor" d="m16.298,8.288l1.404,1.425-5.793,5.707c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701Zm7.702,3.712c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z"/>
        </svg>
        <span>${insight}</span>
      </li>
    `,
      )
      .join("")}
  </ul>`;
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} What
    is the view of {name} trading? · octopi
  </title>
  <meta
    name="description"
    content={`A list of all trades from the US institutionalInvestor ${investor_name}.`}
  />

  <!-- Other meta tags -->
  <meta
    property="og:title"
    content={`What is the view of ${investor_name} trading? · octopi`}
  />
  <meta
    property="og:description"
    content={`A list of all trades from the US institutionalInvestor ${investor_name}.`}
  />
  <meta
    property="og:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <meta property="og:type" content="website" />
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content={`What is the view of ${investor_name} trading? · octopi`}
  />
  <meta
    name="twitter:description"
    content={`A list of all trades from the US institutionalInvestor ${investor_name}.`}
  />
  <meta
    name="twitter:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>
<div>
  {#if isLoading}
    <div class="flex justify-center items-center h-screen">
      <div
        class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>
  {:else}
    <section
      class="container mx-auto max-w-7xl overflow-hidden pt-5 pb-60 sm:px-10 xl:px-0"
    >
      <nav class="text-xs sm:text-sm mx-4 pb-6 sm:pb-10">
        <ol class="flex flex-wrap items-center space-x-1 sm:space-x-2">
          <li>
            <a href="/" class="text-gray-300 hover:text-white">Home</a>
          </li>
          <li class="flex items-center">
            <svg
              class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <a
              href="/individual-Investors"
              class="ml-1 sm:ml-2 text-gray-300 hover:text-white"
              >Individual Investors</a
            >
          </li>
          <li class="flex items-center">
            <svg
              class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="ml-1 sm:ml-2 text-gray-300">{investor_name}</span>
          </li>
        </ol>
      </nav>

      <div class="w-full overflow-hidden m-auto px-3 sm:px-0">
        <div class="flex justify-center w-full m-auto overflow-hidden">
          <div
            class="relative flex flex-col sm:flex-row justify-between items-start overflow-hidden w-full"
          >
            <aside class="relative fixed w-full sm:w-1/3">
              <!--Start Card-->
              <div
                class="w-full bg-[#09090b] border border-slate-800 rounded-lg h-auto pb-4"
              >
                <div class="flex flex-col relative">
                  <img
                    class="absolute w-[500px] m-auto rounded-lg"
                    src={democraticBackground}
                  />
                  <div
                    class="flex flex-col justify-center items-center rounded-2xl"
                  >
                    <div
                      class="mt-10 rounded-full w-24 h-24 relative democratic-striped bg-[#295AC7] flex items-center justify-center"
                    >
                      <img
                        style="clip-path: circle(50%);filter: grayscale(100%);"
                        class="rounded-full w-20"
                        src={bioDataContent?.image
                          ? bioDataContent?.image
                          : "https://us.123rf.com/450wm/gmast3r/gmast3r1411/gmast3r141100350/33865095-businessman-profile-icon-male-portrait-flat.jpg"}
                        loading="lazy"
                      />
                    </div>
                    <span
                      class="text-white text-2xl text-center font-medium mt-2 mb-2"
                    >
                      {investor_name}
                    </span>
                  </div>
                  <div
                    class="flex flex-row justify-center items-center w-full pb-4 px-10 mt-2"
                  >
                    <div class="flex flex-col items-center">
                      <span class="text-white text-sm font-semibold">
                        {bioDataContent?.networth === 0
                          ? 0.11
                          : bioDataContent?.networth?.toFixed(2)} Cr
                      </span>
                      <span
                        class="text-slate-300 font-medium text-xs mt-1 code-font"
                        >Estimated Net Worth</span
                      >
                    </div>
                  </div>
                  <div
                    class="flex flex-row justify-between items-center w-full pb-4 px-10 mt-2"
                  >
                    <div class="flex flex-col items-center">
                      <span class="text-white text-sm font-semibold">
                        34567 Cr
                      </span>
                      <span
                        class="text-slate-300 font-medium text-xs mt-1 code-font"
                        >Estimated Net Worth</span
                      >
                    </div>
                    <div class="flex flex-col items-center">
                      <span class="text-white text-[1rem] flex font-semibold">
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
                        <span class="text-[#10DB06] text-xs"
                          >+{generateNetWorth(
                            bioDataContent?.networth,
                          )?.toFixed(2)}%</span
                        >
                      </span>
                      <span
                        class="text-slate-300 font-medium text-xs mt-1 code-font"
                        >3 Month Returns</span
                      >
                    </div>
                  </div>

                  {#if (bioDataContent?.data?.returns?.[0]?.data ?? 0) !== 0}
                    <div
                      class="flex flex-row justify-between items-center w-full pb-4 px-10 mt-2"
                    >
                      {#each bioDataContent?.data?.returns as item}
                        <div class="flex flex-col items-center">
                          <div class="flex flex-row">
                            {#if item?.data >= 0}
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
                              <span class="text-[#10DB06] text-xs"
                                >+{item?.data?.toFixed(2)}%</span
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
                              <span class="text-[#FF2F1F] text-xs"
                                >{item?.data?.toFixed(2)}%
                              </span>
                            {/if}
                          </div>
                          <span
                            class="text-slate-300 font-medium text-xs mt-1 code-font"
                          >
                            {item?.title}</span
                          >
                        </div>
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
              <!--End Card-->
              <!--End Widget-->
              {#if investorGraphData?.size_analysis}
                <div class="p-2 pb-10 sm:min-h-auto mb-10 sm:mb-6 mt-6">
                  <Lazy
                    height={800}
                    fadeOption={{ delay: 100, duration: 500 }}
                    keep={true}
                  >
                    <div class="w-full h-[260px] mt-6">
                      <Chart options={optionsMarCapData} />
                    </div>
                  </Lazy>
                  <p class="text-white text-md px-5">
                    How <strong>{investor_name}</strong> managed to deploy the
                    money in different <strong>Market sized stocks</strong>?
                  </p>
                  <p class="text-white text-sm mt-3 px-5">
                    {@html industryAndSizeInsights(investorGraphData)}
                  </p>
                </div>
              {/if}
            </aside>

            <main class="w-full mt-10 sm:mt-0 sm:w-3/5 sm:ml-5">
              {#if investorGraphData?.sec_analysis}
                <div
                  class="p-2 pb-10 border border-slate-800 rounded-lg sm:min-h-auto mb-10 sm:mb-6"
                >
                  <Lazy
                    height={800}
                    fadeOption={{ delay: 100, duration: 500 }}
                    keep={true}
                  >
                    <div class="app w-full h-[800px] mt-6">
                      <Chart options={optionsData} />
                    </div>
                  </Lazy>
                  <p class="text-white text-md px-5">
                    How <strong>{investor_name}</strong> allocated the money in
                    different <strong>sectors</strong>?
                  </p>
                  <p class="text-white text-sm mt-3 px-5">
                    {@html sectoralAllocationOverview(
                      investorGraphData?.sec_analysis,
                    )}
                  </p>
                </div>
              {/if}

              <!-- {#if investor_quaterlist?.length > 3}
              <div
                class="p-2 pb-10 border border-slate-800 rounded-lg sm:min-h-auto mb-10 sm:mb-6"
              >
                <Lazy
                  height={800}
                  fadeOption={{ delay: 100, duration: 500 }}
                  keep={true}
                >
                  <div class="app w-full h-[800px] mt-6">
                    <Chart options={optionsData} />
                  </div>
                </Lazy>
                <p class="text-white text-md px-5">
                  How <strong>{investor_name}</strong> allocated the money in
                  different <strong>sectors</strong>?
                </p>
                <p class="text-white text-sm mt-3 px-5">
                  {@html sectoralAllocationOverview(
                    investorGraphData?.sec_analysis
                  )}
                </p>
              </div>
            {/if} -->
              {#if investorStockList}
                <div class="flex flex-col justify-center items-start">
                  <h1 class="text-2xl sm:text-2xl text-white font-bold mb-5">
                    Current Holding Stock List
                  </h1>

                  <div
                    class="text-white p-3 sm:p-5 mb-10 rounded-lg sm:flex sm:flex-row sm:items-center border border-slate-800 text-sm sm:text-[1rem]"
                  >
                    <svg
                      class="w-6 h-6 flex-shrink-0 inline-block sm:mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 256 256"
                      ><path
                        fill="#a474f6"
                        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m-4 48a12 12 0 1 1-12 12a12 12 0 0 1 12-12m12 112a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 0 16"
                      /></svg
                    >
                    {@html `Get detailed insights of<strong> &nbsp;${investor_name}&nbsp; </strong>current holdings.`}
                  </div>
                </div>
                <div class="bg-[#141417] p-2 sm:p-5 rounded-lg overflow-x-auto">
                  <table
                    class=" hidden sm:inline-table table-auto w-full bg-[#09090b] border-bg-[#09090b] text-white text-sm"
                  >
                    <thead>
                      <tr class="bg-[#09090b] border-b border-blue-400">
                        <th class="text-start p-2 sm:p-3">Company</th>
                        <th class="text-end p-2 sm:p-3">Company Holdings</th>
                        <th class="text-end p-2 sm:p-3">Holdings</th>
                        <th class="text-end p-2 sm:p-3">Current Value</th>
                        <th class="text-end p-2 sm:p-3">Current Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each investorStockList as item, index}
                        <tr
                          class="{index % 2
                            ? 'bg-[#09090b]'
                            : 'bg-[#141417]'} border-b border-[#141417]"
                        >
                          <td class="p-2 sm:p-3">
                            <div class="flex items-center">
                              <span>{item?.comp_name?.replace("_", " ")}</span>
                            </div>
                          </td>
                          <td class="text-end p-2 sm:p-3"
                            >{item?.company_per_stake}%</td
                          >
                          <td class="text-end p-2 sm:p-3"
                            >{item?.holding_percentage?.toFixed(2)}%</td
                          >
                          <td class="text-end p-2 sm:p-3"
                            >{item?.total_quantity}</td
                          >
                          <td class="text-end p-2 sm:p-3 text-[#FFBE00]"
                            >{item?.cmp}</td
                          >
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
                <div class="sm:hidden w-full mt-4 space-y-4">
                  {#each investorStockList as item, index}
                    <div
                      class="bg-[#09090b] p-4 rounded-md shadow-md border border-[#141417]"
                    >
                      <div class="text-white font-medium mb-2">
                        {item?.comp_name?.replace("_", " ")}
                      </div>
                      <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="text-slate-300">Company Holdings:</div>
                        <div class="text-white text-right">
                          {item?.company_per_stake}%
                        </div>

                        <div class="text-slate-300">Holdings:</div>
                        <div class="text-white text-right">
                          {item?.holding_percentage?.toFixed(2)}%
                        </div>

                        <div class="text-slate-300">Current Value:</div>
                        <div class="text-white text-right">
                          {item?.total_quantity}
                        </div>

                        <div class="text-slate-300">Current Price:</div>
                        <div class="text-[#FFBE00] text-right">
                          {item?.cmp}
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            </main>
          </div>
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
  .scroller {
    scrollbar-width: thin;
  }
  .app {
    height: 500px;
    max-width: 100%; /* Ensure chart width doesn't exceed the container */
  }

  @media (max-width: 640px) {
    .app {
      height: 230px;
    }
  }
  .republican-striped {
    background-image: repeating-linear-gradient(
      -45deg,
      #98272b,
      #98272b 10px,
      #840412 10px,
      #840412 20px
    );
  }

  .democratic-striped {
    background-image: repeating-linear-gradient(
      -45deg,
      #98272b,
      #98272b 10px,
      #840412 10px,
      #840412 20px
    );
  }

  .other-striped {
    background-image: repeating-linear-gradient(
      -45deg,
      #a4a6a8,
      #a4a6a8 10px,
      #c0c3c5 10px,
      #c0c3c5 20px
    );
  }
</style>
