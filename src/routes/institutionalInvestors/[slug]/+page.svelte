<script lang="ts">
  import democraticBackground from "$lib/images/bg-democratic.png";
  import { numberOfUnreadNotification, screenWidth } from "$lib/store";
  import { onMount } from "svelte";
  import { Chart } from "svelte-echarts";
  import Lazy from "svelte-lazy";
  export let data;

  let rawData: any;
  let displayList = [];
  let optionsData = {};
  let optionsMarCapData = {};
  let isLoading = true;
  let name = rawData?.Name;
  let numOfAssets = new Set([])?.size;

  async function getPlotOptions() {
    const option = {
      silent: false,
      tooltip: {
        trigger: "item",
        backgroundColor: "#0d1117",
        borderColor: "#333333",
        borderWidth: 1,
        textStyle: {
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif'
        },
        formatter: (params: any) => {
          return `${params.name}: ${params.percent.toFixed(2)}%`;
        }
      },

      legend: false,
      series: [
        {
          name: "",
          type: "pie",
          radius: [50, $screenWidth < 640 ? 150 : 180],
          center: ["50%", "70%"],
          startAngle: 180,
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
            "#00bcd4"
          ],
          data: [
            ...rawData.SectorMix.map((each: any) => {
              return {
                value: parseFloat(each.HoldingPercentage.toFixed(2)),
                name: each.SectorName,
                Holding: each.HoldingValue
              };
            })
          ],
          label: {
            show: $screenWidth < 840 ? false : true,
            position: "outside",
            formatter: "{b}: {d}%",
            fontSize: 10,
            color: "#fff",
            backgroundColor: "#0d1117", // Changed to #0d1117
            borderColor: "#333333", // Added a darker border color
            borderWidth: 1, // Added border width
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
                fontWeight: "normal"
              },
              b: {
                fontSize: 16,
                lineHeight: 33,
                fontFamily: '"Inter", sans-serif',
                fontWeight: "normal"
              }
            }
          },
          labelLine: {
            lineStyle: {
              color: "rgba(255, 255, 255, 0.3)"
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          animationType: "scale",
          animationEasing: "elasticOut"
        }
      ]
    };
    return option;
  }

  async function getMarketPlotOptions() {
    const option = {
      silent: false,
      yAxis: {
        type: "category",
        data: [...rawData?.McapMix.map((each) => each.McapCategoryName)],
        axisLine: {
          lineStyle: {
            color: "#333333"
          }
        },
        axisLabel: {
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#0d1117"
          }
        }
      },
      xAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: "#333333"
          }
        },
        axisLabel: {
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#161b22"
          }
        }
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#0d1117",
        borderColor: "#333333",
        borderWidth: 1,
        textStyle: {
          color: "#ffffff",
          fontFamily: '"Inter", sans-serif'
        },
        formatter: (params) => {
          return `${params[0].name}: ${params[0].value.toFixed(2)}%`;
        }
      },
      legend: false,
      series: [
        {
          name: "Market Cap Distribution",
          type: "bar",
          data: rawData.McapMix.map((each, index) => ({
            value: parseFloat(each.HoldingPercentage.toFixed(2)),
            name: each.McapCategoryName,
            itemStyle: {
              color: ["#00bcd4", "#ebff00", "#da9b0a", "#c75e70", "#0057ff"][
                index % 5
              ]
            }
          })),
          label: {
            show: true,
            position: "insideRight",
            formatter: "{c}%",
            fontFamily: '"Inter", sans-serif',
            color: "#0d1117",
            fontStyle: "bold",
            fontSize: 12,
            distance: 15
          },
          animationType: "scale",
          animationEasing: "elasticOut"
        }
      ],
      grid: {
        left: "3%",
        right: "4%",
        top: "5%",
        bottom: "5%",
        containLabel: true,
        show: true,
        borderColor: "#0d1117",
        borderWidth: 0,
        backgroundColor: "#0d1117",
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}"
        },
        zlevel: 0
      }
    };
    return option;
  }
  function describeSectorHoldings(holdings: any) {
    const totalValue = holdings.reduce(
      (sum: any, sector: any) => sum + sector.HoldingValue,
      0
    );
    const topSector = holdings.reduce((max: any, sector: any) =>
      sector.HoldingPercentage > max.HoldingPercentage ? sector : max
    );
    const sectorCount = holdings.length;

    // Calculate average holding value
    const averageHoldingValue = totalValue / sectorCount;

    // Find sectors above average
    const sectorsAboveAverage = holdings.filter(
      (sector: any) => sector.HoldingValue > averageHoldingValue
    );

    const starIcon = ` <svg viewBox="0 0 24 24" class="w-4 h-4 mr-3 mt-1 flex-shrink-0 text-green-400">
          <path fill="currentColor" d="m16.298,8.288l1.404,1.425-5.793,5.707c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701Zm7.702,3.712c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z"/>
        </svg>`;

    return `
    <div class="text-white text-sm space-y-4">
      <span class="flex items-start mt-0">
        ${starIcon}
        <span class="ml-2">This portfolio consists of <span class="font-bold text-white">${sectorCount} sectors</span> with a total holding value of <span class="font-bold text-white">${totalValue.toLocaleString()}Cr</span>.</span>
      </span>
      <span class="flex items-start mt-0">
        ${starIcon}
        <span class="ml-2">The dominant sector is <span class="font-bold text-white">${topSector.SectorName}</span>, accounting for <span class="font-bold text-white">${topSector.HoldingPercentage.toFixed(2)}%</span> of the portfolio with a value of <span class="font-bold text-white">${topSector.HoldingValue.toLocaleString()}Cr</span>.</span>
      </span>
      <span class="flex items-start mt-0">
        ${starIcon}
        <span class="ml-2">The average holding value per sector is <span class="font-bold text-white">${averageHoldingValue.toLocaleString()}Cr</span>.</span>
      </span>
      <span class="flex items-start mt-0">
        ${starIcon}
        <span class="ml-2">${sectorsAboveAverage.length} out of ${sectorCount} sectors have above-average holdings.</span>
      </span>
      <span class="flex items-start mt-0">
        ${starIcon}
        <span class="ml-2">The smallest sector represents <span class="font-bold text-white">${holdings[holdings.length - 1].HoldingPercentage.toFixed(2)}%</span> of the portfolio.</span>
      </span>
    </div>
  `;
  }

  function marketCapOverview(allocations) {
    const totalValue = allocations.reduce(
      (sum, cap) => sum + cap.HoldingValue,
      0
    );
    const activeAllocations = allocations.filter((cap) => cap.HoldingValue > 0);

    if (activeAllocations.length === 0) {
      return `${rawData?.Name}'s portfolio currently has no market cap allocations.`;
    }

    const overview = activeAllocations
      .map(
        (cap) =>
          `${cap.McapCategoryName} (${cap.HoldingPercentage.toFixed(2)}%)`
      )
      .join(", ");

    return `${rawData?.Name} portfolio's market cap allocation is focused on ${overview}, with a total holding value of ${totalValue.toLocaleString()}Cr.`;
  }
  async function processData() {
    rawData = data.getInstitutionalInvestor;
    name = rawData?.Name;
    optionsData = await getPlotOptions();
    optionsMarCapData = await getMarketPlotOptions();
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
    content={`A list of all trades from the US institutionalInvestor ${name}.`}
  />

  <!-- Other meta tags -->
  <meta
    property="og:title"
    content={`What is the view of ${name} trading? · octopi`}
  />
  <meta
    property="og:description"
    content={`A list of all trades from the US institutionalInvestor ${name}.`}
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
    content={`What is the view of ${name} trading? · octopi`}
  />
  <meta
    name="twitter:description"
    content={`A list of all trades from the US institutionalInvestor ${name}.`}
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
      <div class="text-sm breadcrumbs ml-4 pb-10">
        <ul>
          <li><a href="/" class="text-gray-300">Home</a></li>
          <li>
            <a href="/institutionalInvestors" class="text-gray-300"
              >Institutional Investors</a
            >
          </li>
          <li class="text-gray-300">{rawData?.Name}</li>
        </ul>
      </div>

      <div class="w-full overflow-hidden m-auto px-3 sm:px-0">
        <div class="flex justify-center w-full m-auto overflow-hidden">
          <div
            class="relative flex flex-col sm:flex-row justify-between items-start overflow-hidden w-full"
          >
            <aside class="relative fixed w-full sm:w-1/3">
              <!--Start Card-->
              <div
                class="w-full bg-[#0d1117] border border-slate-800 rounded-lg h-auto pb-4"
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
                      class="mt-10 rounded-full border border-slate-600 w-24 h-24 relative democratic-striped bg-[#295AC7] flex items-center justify-center"
                    >
                      <img
                        style="clip-path: circle(50%);"
                        class="rounded-full w-20"
                        src={"https://i.pinimg.com/736x/3c/a9/fa/3ca9fa66cb2ad4c871c77b487a975819.jpg"}
                        loading="lazy"
                      />
                    </div>
                    <span
                      class="text-white text-2xl text-center font-medium mt-2 mb-2"
                    >
                      {rawData?.Name}
                    </span>
                    <span class="text-white text-sm mb-8">
                      {rawData?.Description}
                    </span>
                  </div>
                  <div class="flex items-center justify-between p-5">
                    <div class="flex flex-col items-start">
                      <span class="text-white font-bold text-md"
                        >{rawData?.HoldingValue}</span
                      >
                      <span class="text-slate-300 font-medium text-xs code-font"
                        >Holdings Value(in Cr)
                      </span>
                    </div>
                    {#if rawData.TopPeformingC3MZG}
                      <div class="flex flex-col items-center">
                        <span
                          class="text-white text-[1rem] flex items-center font-semibold"
                        >
                          {#if rawData?.TopPeformingC3MZG >= 0}
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
                            <span class="text-[#10DB06] text-md"
                              >+{rawData?.TopPeformingC3MZG?.toFixed(2)}%</span
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
                            <span class="text-[#FF2F1F] text-md"
                              >{rawData?.TopPeformingC3MZG?.toFixed(2)}%
                            </span>
                          {/if}
                        </span>
                        <span
                          class="text-slate-300 font-medium text-xs code-font"
                          >3M Change in %</span
                        >
                      </div>
                    {/if}
                  </div>
                </div>
              </div>
              <!--End Card-->

              <!--Start Widget-->
              <div class="w-full mt-5 m-auto flex justify-center items-center">
                <div class="w-full grid grid-cols-2 gap-y-3 lg:gap-y-3 gap-x-3">
                  <!--Start Total Amount Traded-->
                  <div
                    class="flex flex-row items-center flex-wrap w-full px-3 sm:px-5 bg-[#0d1117] rounded-2xl h-20"
                  >
                    <div class="flex flex-col items-start">
                      <span class="font-medium text-gray-200 text-xs"
                        >Active Holdings in</span
                      >
                      <span
                        class="text-start text-xl font-medium text-white mt-0.5"
                      >
                        {rawData?.ActiveStocksCount} stocks
                      </span>
                    </div>
                  </div>
                  <!--End Total Amount Traded-->
                  <!--Start Buy/Sell-->
                  <div
                    class="flex flex-row items-center justify-end flex-wrap w-full px-3 sm:px-5 bg-[#0d1117] rounded-2xl h-20"
                  >
                    <div class="flex flex-col items-end">
                      <span class="font-medium text-gray-200 text-xs"
                        >Total Clients</span
                      >
                      <span
                        class="text-start text-xl font-medium text-white mt-0.5"
                      >
                        {rawData?.ClientCount}
                      </span>
                    </div>
                  </div>
                  <!--End Buy/Sell-->
                </div>
              </div>
              <div
                class="w-full mt-5 mb-10 m-auto flex justify-center items-center"
              >
                <div class="w-full">
                  <!--Start Total Amount Traded-->
                  <div
                    class="flex flex-row items-center flex-wrap w-full px-3 sm:px-5 bg-[#0d1117] rounded-2xl h-20"
                  >
                    <div class="flex flex-col items-start">
                      <span class="font-medium text-gray-200 text-xs"
                        >Highest ShareHolding Stock</span
                      >
                      <span
                        class="text-start text-xl font-medium text-white mt-0.5"
                      >
                        {rawData?.HighestShareHoldingSecurity}<span
                          class="text-start text-xs"
                          >&nbsp; with holding of
                        </span>
                        <span class="text-yellow-400"
                          >&nbsp;{rawData?.HighestShareHoldingSecurityG.toFixed(
                            2
                          )}%</span
                        >
                      </span>
                    </div>
                  </div>
                  <!--End Total Amount Traded-->
                </div>
              </div>
              <!--End Widget-->
            </aside>

            <main class="w-full mt-10 sm:mt-0 sm:w-3/4 sm:ml-5">
              <div class="flex flex-col justify-center items-center">
                <label
                  for=""
                  class="mr-1 cursor-pointer flex flex-row items-center text-white text-xl sm:text-3xl mb-2 font-bold"
                >
                  Sectorwise Allocation
                </label>
                <p class="text-white text-md w-3/4 text-center">
                  Sectorwise Allocation represents the distribution of
                  investments across different economic sectors within a
                  portfolio.
                </p>
              </div>

              <div
                class="p-0 sm:px-2 bg-[#0d1117] sm:bg-[#0d1117] rounded-lg sm:min-h-auto mb-10 sm:mb-6"
              >
                <Lazy
                  height={800}
                  fadeOption={{ delay: 100, duration: 500 }}
                  keep={true}
                >
                  <div class="app w-full h-[800px] mt-6">
                    <Chart options={optionsData} class="chart" />
                  </div>
                </Lazy>
              </div>
              <div class="w-full flex flex-col justify-center items-center">
                <div
                  class="w-70 sm:w-2/3 h-auto bg-[#161b22] tracking-wide mb-14 mx-1 rounded-lg relative"
                >
                  <h5
                    class="text-2xl text-white font-semibold pl-6 pt-6 pr-6 pb-2"
                  >
                    Sectorwise Allocation
                  </h5>
                  <div
                    class="text-md font-regular text-white p-6 pt-2 text-gray-500"
                  >
                    {@html describeSectorHoldings(rawData?.SectorMix)}
                  </div>
                </div>
              </div>
              <div
                class="p-0 sm:p-2 bg-[#0d1117] sm:bg-[#0d1117] rounded-lg sm:min-h-auto mb-10 sm:mb-6"
              >
                <p class="text-center text-white"></p>
              </div>
              <div class="flex flex-col justify-center items-center">
                <label
                  for=""
                  class="mr-1 cursor-pointer flex flex-row items-center text-white text-xl sm:text-3xl mb-2 font-bold"
                >
                  Market Captial Allocation
                </label>
                <p class="text-white text-md w-3/4 text-center">
                  {marketCapOverview(rawData?.McapMix)}
                </p>
              </div>
              <div
                class="p-0 sm:px-2 mt-10 bg-[#0d1117] sm:bg-[#0d1117] rounded-lg sm:min-h-auto mb-10 sm:mb-6"
              >
                <Lazy
                  height={800}
                  fadeOption={{ delay: 100, duration: 500 }}
                  keep={true}
                >
                  <div class="app w-full h-[800px] mt-6">
                    <Chart options={optionsMarCapData} class="chart" />
                  </div>
                </Lazy>
              </div>
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
    height: 400px;
    max-width: 100%;
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
      #295ac7,
      #295ac7 10px,
      #164d9d 10px,
      #164d9d 20px
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
