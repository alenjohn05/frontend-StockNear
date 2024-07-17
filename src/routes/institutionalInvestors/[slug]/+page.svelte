<script lang="ts">
  import { goto } from "$app/navigation";
  import democraticBackground from "$lib/images/bg-democratic.png";
  import { numberOfUnreadNotification, screenWidth } from "$lib/store";
  import { Chart } from "svelte-echarts";
  import { onMount } from "svelte";
  import Lazy from "svelte-lazy";
  export let data;

  let rawData: any;
  let displayList = [];
  let optionsData = {};
  let isLoading = true;
  let name = rawData?.Name;
  let numOfAssets = new Set([])?.size;

  async function getPlotOptions() {
    const option = {
      title: {
        text: "Sectorwise Allocation",
        left: "center",
        bottom: 0,
        textStyle: {
          color: "#FFFFFF",
          fontFamily: '"Manrope", sans-serif',
          fontWeight: "normal"
        }
      },
      tooltip: {
        trigger: "item"
      },
      legend: false,
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: [50, 200],
          center: ["50%", "70%"],
          startAngle: 180,
          endAngle: 360,
          data: [
            { value: 1048, name: "Search Engine" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" }
          ],
          label: {
            show: true,
            position: "outside",
            formatter: "{b}: {c} ({d}%)",
            fontSize: 12,
            color: "#fff",
            backgroundColor: "#191919",
            border: "#FFFFFF",
            borderRadius: 4,
            padding: [4, 8],
            rotate: 0,
            align: "center",
            verticalAlign: "middle",
            fontFamily: '"Manrope", sans-serif',
            fontWeight: "normal",
            rich: {
              a: {
                color: "#999",
                lineHeight: 22,
                align: "center",
                fontFamily: '"Manrope", sans-serif',
                fontWeight: "normal"
              },
              b: {
                fontSize: 16,
                lineHeight: 33,
                fontFamily: '"Manrope", sans-serif',
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

  async function processData() {
    rawData = data.getInstitutionalInvestor;
    name = rawData?.Name;
    console.log(rawData)
    optionsData = await getPlotOptions();
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
                class="w-full bg-[#111111] border border-slate-800 rounded-lg h-auto pb-4"
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
                    class="flex flex-row items-center flex-wrap w-full px-3 sm:px-5 bg-[#111111] rounded-2xl h-20"
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
                    class="flex flex-row items-center justify-end flex-wrap w-full px-3 sm:px-5 bg-[#111111] rounded-2xl h-20"
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
                    class="flex flex-row items-center flex-wrap w-full px-3 sm:px-5 bg-[#111111] rounded-2xl h-20"
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
                          >&nbsp;{rawData?.HighestShareHoldingSecurityG}%</span
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
              <div
                class="p-0 sm:p-10 bg-[#111111] sm:bg-[#111111] rounded-lg sm:min-h-auto mb-10 sm:mb-6"
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
              <div
                class="p-0 sm:p-10 bg-[#111111] sm:bg-[#111111] rounded-lg sm:min-h-[330px]"
              >
                <div
                  class="w-full m-auto h-auto sm:max-h-[500px] sm:overflow-y-scroll scroller"
                >
                  {#if rawData?.length !== 0}
                    <div class="hidden sm:block">
                      <span class="text-[#F5F5F5] font-bold text-2xl">
                        {numOfAssets} Assets
                      </span>

                      <table
                        class="-ml-2 table table-sm table-compact table-pin-rows table-pin-cols rounded-none sm:rounded-md w-full bg-[#111111] m-auto mt-5"
                      >
                        <!-- head -->
                        <thead>
                          <tr class="bg-[#111111]">
                            <th
                              class="shadow-md text-start bg-[#111111] text-white text-sm font-semibold"
                            >
                              Name
                            </th>
                            <th
                              class="shadow-md text-start bg-[#111111] text-white text-sm font-semibold"
                            >
                              Transaction
                            </th>
                            <th
                              class="shadow-md text-end bg-[#111111] text-white text-sm font-semibold"
                            >
                              Traded
                            </th>
                            <th
                              class="shadow-md text-end bg-[#111111] text-white text-sm font-semibold"
                            >
                              Filed
                            </th>
                          </tr>
                        </thead>
                        <tbody class="p-0">
                          {#each displayList as item}
                            <tr
                              on:click={() =>
                                goto(
                                  `/${item?.assetType === "stock" ? "stocks" : item?.assetType === "etf" ? "etf" : "crypto"}/${item?.ticker}`
                                )}
                              class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#111111] border-b-[#202020] cursor-pointer"
                            >
                              <td
                                class="text-gray-200 pb-3 border-b border-b-[#202020]"
                              >
                                <div class="flex flex-row items-center">
                                  <div
                                    class="flex-shrink-0 rounded-full w-8 h-8 relative bg-[#111111] flex items-center justify-center"
                                  >
                                    <img
                                      style="clip-path: circle(50%);"
                                      class="avatar w-7 h-7"
                                      src={`https://financialmodelingprep.com/image-stock/${item?.ticker}.png`}
                                      alt="stock logo"
                                    />
                                  </div>
                                  <div class="flex flex-col ml-2">
                                    <span class="text-[#FFBE00]"
                                      >{item?.ticker?.replace("_", " ")}</span
                                    >
                                    <span
                                      class="text-white text-opacity-80 text-xs"
                                      >{item?.name?.length > 20
                                        ? item?.name?.slice(0, 20) + "..."
                                        : item?.name}</span
                                    >
                                  </div>
                                </div>
                                <!--{item?.firstName} {item?.lastName}-->
                              </td>

                              <td
                                class="text-start text-xs sm:text-sm text-white border-b border-b-[#202020]"
                              >
                                <div class="flex flex-col items-start">
                                  <span class="font-semibold">
                                    {#if item?.type === "Bought"}
                                      <span class="text-[#57D7BA]"
                                        >Purchase</span
                                      >
                                    {:else if item?.type === "Sold"}
                                      <span class="text-[#fe5555]">Sale</span>
                                    {:else if item?.type === "Exchange"}
                                      <span class="text-[#C6A755]"
                                        >Exchange</span
                                      >
                                    {/if}
                                  </span>
                                  <span>
                                    {item?.amount}
                                  </span>
                                </div>
                              </td>

                              <td
                                class="text-end text-sm text-white border-b border-b-[#202020]"
                              >
                                {new Date(
                                  item?.transactionDate
                                )?.toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  daySuffix: "2-digit"
                                })}
                              </td>

                              <td
                                class="text-end text-sm text-white border-b border-b-[#202020]"
                              >
                                {new Date(item?.disclosureDate)?.toLocaleString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    daySuffix: "2-digit"
                                  }
                                )}
                              </td>
                            </tr>
                          {/each}
                        </tbody>
                      </table>
                    </div>

                    <div
                      class="sm:hidden flex flex-col justify-center w-full m-auto h-full overflow-hidden mt-3"
                    >
                      <span class="ml-3 text-[#F5F5F5] font-bold text-2xl">
                        {numOfAssets} Assets
                      </span>

                      <!-- Content area -->
                      <div class="mt-4 w-full overflow-x-auto scroller">
                        <table class="-ml-2 table mt-3 w-screen">
                          <thead>
                            <tr class="">
                              <th
                                class="shadow-md text-start bg-[#111111] text-white text-sm font-semibold"
                              >
                                Name
                              </th>
                              <th
                                class="shadow-md text-start bg-[#111111] text-white text-sm font-semibold"
                              >
                                Transaction
                              </th>
                              <th
                                class="shadow-md text-end bg-[#111111] text-white text-sm font-semibold"
                              >
                                Traded
                              </th>
                              <th
                                class="shadow-md text-end bg-[#111111] text-white text-sm font-semibold"
                              >
                                Filed
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {#each displayList as item, index}
                              <!-- row -->
                              <tr
                                on:click={() =>
                                  goto(
                                    `/${item?.assetType === "stock" ? "stocks" : item?.assetType === "etf" ? "etf" : "crypto"}/${item?.ticker}`
                                  )}
                                class="w-screen [#111111] border-b-[#111111]"
                              >
                                <td
                                  class="text-gray-200 pb-3 border-b border-b-[#111111] w-32"
                                >
                                  <div class="flex flex-row items-center">
                                    <div class="flex flex-col">
                                      <span class="text-[#FFBE00] text-sm"
                                        >{item?.ticker?.replace("_", " ")}</span
                                      >
                                      <span
                                        class="text-white text-opacity-80 text-xs"
                                        >{item?.name?.length > 15
                                          ? item?.name?.slice(0, 15) + "..."
                                          : item?.name}</span
                                      >
                                    </div>
                                  </div>
                                  <!--{item?.firstName} {item?.lastName}-->
                                </td>

                                <td
                                  class="text-start text-sm text-white border-b border-b-[#111111]"
                                >
                                  <div class="flex flex-col items-start">
                                    <span class="font-semibold">
                                      {#if item?.type === "Bought"}
                                        <span class="text-[#57D7BA]"
                                          >Purchase</span
                                        >
                                      {:else if item?.type === "Sold"}
                                        <span class="text-[#fe5555]">Sale</span>
                                      {:else if item?.type === "Exchange"}
                                        <span class="text-[#C6A755]"
                                          >Exchange</span
                                        >
                                      {/if}
                                    </span>
                                    <span>
                                      {item?.amount}
                                    </span>
                                  </div>
                                </td>

                                <td
                                  class="text-end text-sm text-white border-b border-b-[#111111]"
                                >
                                  {new Date(
                                    item?.transactionDate
                                  )?.toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    daySuffix: "2-digit"
                                  })}
                                </td>

                                <td
                                  class="text-end text-sm text-white border-b border-b-[#111111]"
                                >
                                  {new Date(
                                    item?.disclosureDate
                                  )?.toLocaleString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    daySuffix: "2-digit"
                                  })}
                                </td>
                              </tr>
                            {/each}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  {:else}
                    <div
                      class="flex justify-center items-center m-auto sm:mt-24 mt-32 mb-6"
                    >
                      <div
                        class="text-gray-100 text-sm sm:text-[1rem] sm:rounded-lg h-auto border border-slate-800 p-4"
                      >
                        <svg
                          class="w-5 h-5 inline-block mr-2 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 256 256"
                          ><path
                            fill="#a474f6"
                            d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24m-4 48a12 12 0 1 1-12 12a12 12 0 0 1 12-12m12 112a16 16 0 0 1-16-16v-40a8 8 0 0 1 0-16a16 16 0 0 1 16 16v40a8 8 0 0 1 0 16"
                          /></svg
                        >
                        No Trading activity found
                      </div>
                    </div>
                  {/if}
                </div>
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
    height: 300px;
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
