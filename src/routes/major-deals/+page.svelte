<script lang="ts">
  import { goto } from "$app/navigation";
  import InfiniteLoading from "$lib/components/InfiniteLoading.svelte";
  import ScrollToTop from "$lib/components/ScrollToTop.svelte";
  import { numberOfUnreadNotification, screenWidth } from "$lib/store";
  import { format } from "date-fns";
  import { onMount } from "svelte";

  interface Deal {
    [key: string]: any;
  }

  interface Tab {
    id: string;
    label: string;
  }

  export let data: {
    GetBulkDeals?: Deal[];
    GetBlockDeals?: Deal[];
    GetInsiderDeals?: Deal[];
  };

  let isLoaded = false;
  let rawData: Deal[] = [];
  let displayList: Deal[] = [];
  let bulkDealData: Deal[] = [];
  let blockDealData: Deal[] = [];
  let insiderDealsData: Deal[] = [];
  let cloudFrontUrl: string = import.meta.env.VITE_IMAGE_URL;
  let activeTab: string = "BULK";

  const tabs: Tab[] = [
    { id: "BULK", label: "Bulk Deals" },
    { id: "BLOCK", label: "Block Deals" },
    { id: "INSIDER", label: "Insider Deals" }
  ];

  onMount(() => {
    bulkDealData = data?.GetBulkDeals ?? [];
    blockDealData = data?.GetBlockDeals ?? [];
    insiderDealsData = data?.GetInsiderDeals ?? [];
    rawData = bulkDealData;
    console.log(insiderDealsData);
    displayList = rawData.slice(0, 20);
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

  function setActiveTab(tabId: string) {
    activeTab = tabId;
    if (tabId === "BULK") {
      rawData = bulkDealData;
      displayList = rawData.slice(0, 20);
    } else if (tabId === "BLOCK") {
      rawData = blockDealData;
      displayList = rawData.slice(0, 20);
    } else {
      rawData = insiderDealsData;
      displayList = rawData.slice(0, 20);
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
</svelte:head>

<section
  class="w-full max-w-7xl m-auto sm:bg-[#09090b] sm:rounded-xl h-auto pl-1 pr-1 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8"
>
  <div class="text-sm breadcrumbs ml-4">
    <ul>
      <li><a href="/" class="text-gray-300">Home</a></li>
      <li class="text-gray-300">Major Deals Flow</li>
    </ul>
  </div>
  <div class=" mt-5">
    <div class="sm:p-0 flex justify-center w-full m-auto overflow-hidden">
      <div
        class="relative flex justify-center items-center overflow-hidden w-full"
      >
        <main class="w-full">
          <div
            class=" sm:bg-[#09090b] sm:rounded-xl h-auto pl-1 pr-1 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8"
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
            <ul
              class="flex text-sm font-medium text-center text-gray-500 border-b border-[#141417] dark:border-[#141417] dark:text-[#141417]"
            >
              {#each tabs as tab}
                <li class="me-2">
                  <button
                    class="inline-block p-2 {activeTab === tab.id
                      ? 'border-b border-blue-300 text-white bg-[#141417] active dark:bg-[#141417] dark:text-white'
                      : ' text-gray-500 bg-[#09090b] active dark:bg-[#09090b] dark:text-white'}"
                    on:click|preventDefault={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              {/each}
            </ul>
            <div class="w-screen sm:w-full m-auto mt-5 sm:mt-10">
              <div
                class="w-screen sm:w-full m-auto rounded-none sm:rounded-lg overflow-x-scroll sm:overflow-hidden"
              >
                {#if activeTab === "INSIDER"}
                  <table
                    class="hidden sm:inline-table table-sm table-compact no-scrollbar rounded-none sm:rounded-md w-full bg-[#09090b] border-bg-[#09090b] m-auto"
                  >
                    <thead>
                      <tr class="bg-[#09090b] border-b border-blue-400">
                        <th
                          class="text-start bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Date
                        </th>
                        <th
                          class="text-start bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Company/Deal Type
                        </th>
                        <th
                          class="text-start bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Investor
                        </th>
                        <th
                          class="text-start bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Buy/Sell
                        </th>
                        <th
                          class="text-end bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Quantity(Shares)
                        </th>
                        <th
                          class="text-end bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Deal Made on
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each displayList as item, index}
                        <tr
                          on:click={() => goto(`/stocks/${item?.SecurityID}`)}
                          class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] odd:bg-[#09090b] cursor-pointer"
                        >
                          <td
                            class="text-start text-sm font-medium text-white w-70"
                          >
                            {item?.Date
                              ? format(item?.Date, "dd-MM-yyyy")
                              : format(new Date(), "dd-MM-yyyy")}
                          </td>

                          <td class="text-sm text-start">
                            <div class="flex flex-col items-start sm:w-fit">
                              <span class="text-[#FFBE00]"
                                >{item?.SecurityName}</span
                              >
                              <span class="text-white">
                                {item?.TransactionType}
                              </span>
                            </div>
                          </td>
                          <td class="text-start text-sm font-medium text-white">
                            {item?.ClientName}
                          </td>
                          <td
                            class="text-start text-sm font-medium {item?.QuantityType ===
                            'Buy'
                              ? 'text-[#10DB06]'
                              : 'text-[#FF2F1F]'}"
                          >
                            {item?.QuantityType}
                          </td>
                          <td class="text-end text-sm font-medium text-white">
                            {item?.QuantityBuy
                              ? item?.QuantityBuy
                              : item?.QuantitySell}
                          </td>
                          <td class="text-end text-sm font-medium text-white">
                            {item?.TransactionFromDate
                              ? format(item?.TransactionFromDate, "dd-MM")
                              : ""}<span class="text-gray-500">&nbsp;to&nbsp;</span>  {item?.TransactionToDate
                              ? format(item?.TransactionToDate, "dd-MM-yyyy")
                              : ""}
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                  <div class="sm:hidden bg-[#09090b] border-bg-[#09090b] px-4">
                    {#each displayList as item, index}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <div
                        role="button"
                        tabindex="0"
                        on:click={() => goto(`/stocks/${item?.SecurityID}`)}
                        class="p-3 bg-[#09090b] border border-gray-700 rounded-lg mb-4 cursor-pointer hover:bg-[#245073] hover:bg-opacity-[0.2] sm:p-6"
                      >
                        <div
                          class="text-xs font-medium text-white mb-2 sm:text-base"
                        >
                          <span class="font-bold">Date:</span>
                          {item?.Date
                            ? format(item?.Date, "dd-MM-yyyy")
                            : format(new Date(), "dd-MM-yyyy")}
                        </div>

                        <div class="text-xs mb-2 sm:text-base">
                          <span class="font-bold">Company:</span>
                          <div class="flex flex-col items-start">
                            <span class="text-[#FFBE00]"
                              >{item?.SecurityName}</span
                            >
                            <span class="text-white">{item?.ExchangeName}</span>
                          </div>
                        </div>

                        <div
                          class="text-xs font-medium text-white mb-2 sm:text-base"
                        >
                          <span class="font-bold">Investor:</span>
                          {item?.ClientName}
                        </div>

                        <div class="text-xs font-medium mb-2 sm:text-base">
                          <span class="font-bold">Buy/Sell:</span>
                          <span
                            class={item?.BuySellName === "Buy"
                              ? "text-[#10DB06]"
                              : "text-[#FF2F1F]"}>{item?.BuySellName}</span
                          >
                        </div>

                        <div
                          class="text-xs font-medium text-white mb-2 sm:text-base"
                        >
                          <span class="font-bold">Quantity:</span>
                          {item?.Quantity}
                        </div>

                        <div
                          class="text-xs font-medium text-white sm:text-base"
                        >
                          <span class="font-bold">Price:</span>
                          {item?.Price}
                        </div>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <table
                    class="hidden sm:inline-table table-sm table-compact no-scrollbar rounded-none sm:rounded-md w-full bg-[#09090b] border-bg-[#09090b] m-auto"
                  >
                    <thead>
                      <tr class="bg-[#09090b] border-b border-blue-400">
                        <th
                          class="text-start bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Date
                        </th>
                        <th
                          class="text-start bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Company
                        </th>
                        <th
                          class="text-start bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Investor
                        </th>
                        <th
                          class="text-start bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Buy/Sell
                        </th>
                        <th
                          class="text-end bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Quantity
                        </th>
                        <th
                          class="text-end bg-[#09090b] text-white text-sm font-semibold"
                        >
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {#each displayList as item, index}
                        <tr
                          on:click={() => goto(`/stocks/${item?.SecurityID}`)}
                          class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] odd:bg-[#09090b] cursor-pointer"
                        >
                          <td
                            class="text-start text-sm font-medium text-white w-70"
                          >
                            {item?.Date
                              ? format(item?.Date, "dd-MM-yyyy")
                              : format(new Date(), "dd-MM-yyyy")}
                          </td>

                          <td class="text-sm text-start">
                            <div class="flex flex-col items-start sm:w-fit">
                              <span class="text-[#FFBE00]"
                                >{item?.SecurityName}</span
                              >
                              <span class="text-white">
                                {item?.ExchangeName}
                              </span>
                            </div>
                          </td>
                          <td class="text-start text-sm font-medium text-white">
                            {item?.ClientName}
                          </td>
                          <td
                            class="text-start text-sm font-medium {item?.BuySellName ===
                            'Buy'
                              ? 'text-[#10DB06]'
                              : 'text-[#FF2F1F]'}"
                          >
                            {item?.BuySellName}
                          </td>
                          <td class="text-end text-sm font-medium text-white">
                            {item?.Quantity}
                          </td>
                          <td class="text-end text-sm font-medium text-white">
                            {item?.Price}
                          </td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                  <div class="sm:hidden bg-[#09090b] border-bg-[#09090b] px-4">
                    {#each displayList as item, index}
                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <div
                        role="button"
                        tabindex="0"
                        on:click={() => goto(`/stocks/${item?.SecurityID}`)}
                        class="p-3 bg-[#09090b] border border-gray-700 rounded-lg mb-4 cursor-pointer hover:bg-[#245073] hover:bg-opacity-[0.2] sm:p-6"
                      >
                        <div
                          class="text-xs font-medium text-white mb-2 sm:text-base"
                        >
                          <span class="font-bold">Date:</span>
                          {item?.Date
                            ? format(item?.Date, "dd-MM-yyyy")
                            : format(new Date(), "dd-MM-yyyy")}
                        </div>

                        <div class="text-xs mb-2 sm:text-base">
                          <span class="font-bold">Company:</span>
                          <div class="flex flex-col items-start">
                            <span class="text-[#FFBE00]"
                              >{item?.SecurityName}</span
                            >
                            <span class="text-white">{item?.ExchangeName}</span>
                          </div>
                        </div>

                        <div
                          class="text-xs font-medium text-white mb-2 sm:text-base"
                        >
                          <span class="font-bold">Investor:</span>
                          {item?.ClientName}
                        </div>

                        <div class="text-xs font-medium mb-2 sm:text-base">
                          <span class="font-bold">Buy/Sell:</span>
                          <span
                            class={item?.BuySellName === "Buy"
                              ? "text-[#10DB06]"
                              : "text-[#FF2F1F]"}>{item?.BuySellName}</span
                          >
                        </div>

                        <div
                          class="text-xs font-medium text-white mb-2 sm:text-base"
                        >
                          <span class="font-bold">Quantity:</span>
                          {item?.Quantity}
                        </div>

                        <div
                          class="text-xs font-medium text-white sm:text-base"
                        >
                          <span class="font-bold">Price:</span>
                          {item?.Price}
                        </div>
                      </div>
                    {/each}
                  </div>
                {/if}
              </div>
              <InfiniteLoading on:infinite={infiniteHandler} />
              <ScrollToTop />
            </div>
          {:else}
            <div class="flex justify-center items-center h-80">
              <div class="relative">
                <div
                  class="bg-[#09090b] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <span class="loading loading-spinner loading-md"></span>
                </div>
              </div>
            </div>
          {/if}
        </main>
      </div>
    </div>
  </div>
</section>
