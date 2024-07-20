<script lang="ts">
  import { goto } from "$app/navigation";
  import InfiniteLoading from "$lib/components/InfiniteLoading.svelte";
  import { numberOfUnreadNotification, screenWidth } from "$lib/store";
  import { onMount } from "svelte";

  export let data;

  let isLoaded = false;
  let rawData = [];
  let displayList = [];
  let bulkDealData = [];
  let blockDealData = [];
  let insiderDealsData = [];
  let cloudFrontUrl = import.meta.env.VITE_IMAGE_URL;
  let activeTab = "BULK";

  const tabs = [
    { id: "BLOCK", label: "Block Deals" },
    { id: "BULK", label: "Bulk Deals" },
    { id: "INSIDER", label: "Insider Deals" },
  ];

  onMount(() => {
    bulkDealData = data?.GetBulkDeals;
    blockDealData = data?.GetBlockDeals;
    insiderDealsData = data?.GetInsiderDeals;
    rawData = bulkDealData ?? [];
    console.log(rawData);
    displayList = rawData?.slice(0, 20) ?? [];
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
  function setActiveTab(tabId: string) {
    activeTab = tabId;
    if (tabId === "BULK") {
      rawData = bulkDealData;
    } else if (tabId === "BLOCK") {
      rawData = blockDealData;
    } else {
      rawData = insiderDealsData;
    }
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
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>

<section
  class="w-full max-w-4xl overflow-hidden m-auto min-h-screen pt-5 pb-40"
>
  <div class="text-sm breadcrumbs ml-4">
    <ul>
      <li><a href="/" class="text-gray-300">Home</a></li>
      <li class="text-gray-300">Major Deals Flow</li>
    </ul>
  </div>

  <div class="w-full max-w-4xl overflow-hidden m-auto mt-5">
    <div
      class="sm:p-0 flex justify-center w-full m-auto overflow-hidden max-w-4xl"
    >
      <div
        class="relative flex justify-center items-center overflow-hidden w-full"
      >
        <main class="w-full">
          <div
            class="w-full max-w-4xl m-auto sm:bg-[#0d1117] sm:rounded-xl h-auto pl-10 pr-10 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <!-- Start Column -->
              <div>
                <div class="flex flex-row justify-center items-center">
                  <h1
                    class="text-3xl sm:text-4xl text-white text-center font-bold mb-5"
                  >
                    Major Deals Held
                  </h1>
                </div>

                <span
                  class="text-white text-md font-medium text-center flex justify-center items-center"
                >
                  Major Deals done by Traders in different Equities.
                </span>
              </div>
              <!-- End Column -->

              <!-- Start Column -->
              <div
                class="hidden sm:block relative m-auto mb-5 mt-5 sm:mb-0 sm:mt-0"
              >
                <svg
                  class="w-40 -my-5"
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="5" result="glow" />
                      <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    fill="#1E40AF"
                    d="M57.6,-58.7C72.7,-42.6,81.5,-21.3,82,0.5C82.5,22.3,74.7,44.6,59.7,60.1C44.6,75.6,22.3,84.3,0,84.3C-22.3,84.2,-44.6,75.5,-61.1,60.1C-77.6,44.6,-88.3,22.3,-87.6,0.7C-86.9,-20.8,-74.7,-41.6,-58.2,-57.7C-41.6,-73.8,-20.8,-85.2,0.2,-85.4C21.3,-85.6,42.6,-74.7,57.6,-58.7Z"
                    transform="translate(100 100)"
                    filter="url(#glow)"
                  />
                </svg>

                <div class="z-1 absolute top-0">
                  <img
                    class="w-auto"
                    src={cloudFrontUrl + "/assets/dark_pool_flow_logo.png"}
                    alt="logo"
                    loading="lazy"
                  />
                </div>
              </div>
              <!-- End Column -->
            </div>
          </div>

          {#if isLoaded}
            <div
              class="w-full mt-5 mb-10 m-auto flex justify-center items-center p-3 sm:p-0"
            >
              <div
                class="w-full grid grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-3"
              >
                <!--Start Most Traded-->
                <div
                  class="flex flex-row items-center flex-wrap w-full px-3 sm:px-5 bg-[#0d1117] border border-[#2a2e39] shadow-lg rounded-lg h-20"
                >
                  <div class="flex flex-col items-start">
                    <span class="font-medium text-gray-200 text-sm"
                      >Most Traded Option</span
                    >
                    <span
                      class="text-start text-sm sm:text-[1rem] font-medium text-white mt-0.5"
                    >
                      <a href={"/stocks/" + 45644} class="text-[#FFBE00]">
                        ESD
                      </a>
                      34
                    </span>
                  </div>
                </div>
                <!--End Most Traded-->

                <!--Start Highest Volume-->
                <div
                  class="flex flex-row items-center flex-wrap w-full px-3 sm:px-5 bg-[#0d1117] border border-[#2a2e39] shadow-lg rounded-lg h-20"
                >
                  <div class="flex flex-col items-start">
                    <span class="font-medium text-gray-200 text-sm"
                      >Highest Volume</span
                    >
                    <span
                      class="text-start text-sm sm:text-[1rem] font-medium text-white mt-0.5"
                    >
                      <a href={"/stocks/" + 456} class="text-[#FFBE00]">
                        EDS
                      </a>
                      3o
                    </span>
                  </div>
                </div>
                <!--End Highest Volume-->

                <!--Start Highest Size-->
                <div
                  class="flex flex-row items-center flex-wrap w-full px-5 bg-[#0d1117] border border-[#2a2e39] shadow-lg rounded-lg h-20"
                >
                  <div class="flex flex-col items-start">
                    <span class="font-medium text-gray-200 text-sm"
                      >Highest Size</span
                    >
                    <span
                      class="text-start text-sm sm:text-[1rem] font-medium text-white mt-0.5"
                    >
                      <a href={"/stocks/" + 456} class="text-[#FFBE00]">
                        EDR
                      </a>
                      45
                    </span>
                  </div>
                </div>
                <!--End Highest Size-->

                <!--Start Amount-->
                <div
                  class="flex flex-row items-center flex-wrap w-full px-5 bg-[#0d1117] border border-[#2a2e39]
                     shadow-lg rounded-lg h-20"
                >
                  <div class="flex flex-col items-start">
                    <span class="font-medium text-gray-200 text-sm"
                      >Highest Amount</span
                    >
                    <span
                      class="text-start text-sm sm:text-[1rem] font-medium text-white mt-0.5"
                    >
                      <a href={"/stocks/" + 456} class="text-[#FFBE00]">
                        RTE
                      </a>
                      345
                    </span>
                  </div>
                </div>
                <!--End Amount-->
              </div>
            </div>
            <ul
              class="flex text-sm font-medium text-center text-gray-500 border-b border-[#161b22] dark:border-[#161b22] dark:text-[#161b22]"
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
            <div class="w-screen sm:w-full m-auto mt-20 sm:mt-10">
              <div
                class="w-screen sm:w-full m-auto rounded-none sm:rounded-lg mb-4 overflow-x-scroll sm:overflow-hidden"
              >
                <table
                  class="table table-sm table-compact no-scrollbar rounded-none sm:rounded-md w-full bg-[#0d1117] border-bg-[#0d1117] m-auto"
                >
                  <thead>
                    <tr class="bg-[#0d1117] border-b border-blue-400">
                      <th
                        class="text-start bg-[#0d1117] text-white text-sm font-semibold"
                      >
                        Time
                      </th>
                      <th
                        class="text-start bg-[#0d1117] text-white text-sm font-semibold"
                      >
                        Company
                      </th>
                      <th
                        class="text-start bg-[#0d1117] text-white text-sm font-semibold"
                      >
                        Size
                      </th>
                      <th
                        class="text-end bg-[#0d1117] text-white text-sm font-semibold"
                      >
                        Volume
                      </th>
                      <th
                        class="text-end bg-[#0d1117] text-white text-sm font-semibold"
                      >
                        Price
                      </th>
                      <th
                        class="text-end bg-[#0d1117] text-white text-sm font-semibold"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {#each displayList as item, index}
                      <tr
                        on:click={() => goto(`/stocks/${item?.symbol}`)}
                        class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] odd:bg-[#0d1117] cursor-pointer"
                      >
                        <td class="text-start text-sm font-medium text-white">
                        </td>

                        <td class="text-sm text-start">
                          <div class="flex flex-col items-start w-32 sm:w-fit">
                            <span class="text-[#FFBE00]">{item?.symbol}</span>
                            <span class="text-white">
                              {item?.name}
                            </span>
                          </div>
                        </td>

                        <td class="text-start text-sm font-medium text-white">
                          item?.size
                        </td>

                        <td class="text-end text-sm font-medium text-white">
                          volume
                        </td>

                        <td class="text-end text-sm font-medium text-white">
                          price
                        </td>

                        <td class="text-end text-sm font-medium text-white">
                          price
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
              <InfiniteLoading on:infinite={infiniteHandler} />
            </div>
          {:else}
            <div class="flex justify-center items-center h-80">
              <div class="relative">
                <label
                  class="bg-[#0d1117] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <span class="loading loading-spinner loading-md"></span>
                </label>
              </div>
            </div>
          {/if}
        </main>
      </div>
    </div>
  </div>
</section>
