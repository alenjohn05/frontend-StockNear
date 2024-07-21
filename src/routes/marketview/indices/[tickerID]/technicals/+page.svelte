<script lang="ts">
  import InfiniteLoading from "$lib/components/InfiniteLoading.svelte";
  import InfoModal from "$lib/components/InfoModal.svelte";
  import ScrollToTop from "$lib/components/ScrollToTop.svelte";
  import { numberOfUnreadNotification } from "$lib/store";
  import { format } from "date-fns";
  import { onMount } from "svelte";

  interface BoardMeeting {
    date: string;
    comp_name?: string;
    [key: string]: any;
  }

  export let data;

  let sortedData: BoardMeeting[] = [];
  let techincal_Levels: BoardMeeting[] = [];
  let displayList: BoardMeeting[] = [];
  let isLoaded = false;

  async function handleScroll() {
    const scrollThreshold = document.body.offsetHeight * 0.8;
    const isBottom = window.innerHeight + window.scrollY >= scrollThreshold;
    if (isBottom && displayList.length !== techincal_Levels.length) {
      const nextIndex = displayList.length;
      const filteredNewResults = techincal_Levels.slice(
        nextIndex,
        nextIndex + 20,
      );
      displayList = [...displayList, ...filteredNewResults];
    }
  }

  let error: string | null = null;

  onMount(() => {
    try {
      sortedData = data?.get_Technical_level_info?.TechnicalLevels;
      techincal_Levels = [...sortedData];
      displayList = techincal_Levels;
      console.log(displayList);
      isLoaded = true;
    } catch (e) {
      error = "Error loading board meetings data. Please try again later.";
      console.error("Error loading data:", e);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  async function infiniteHandler({
    detail: { loaded, complete },
  }: {
    detail: { loaded: () => void; complete: () => void };
  }) {
    try {
      if (displayList.length === techincal_Levels.length) {
        complete();
      } else {
        const nextIndex = displayList.length;
        const newArticles = techincal_Levels.slice(nextIndex, nextIndex + 5);
        displayList = [...displayList, ...newArticles];
        loaded();
      }
    } catch (e) {
      error = "Error loading more items. Please try again later.";
      console.error("Error in infinite scroll:", e);
      complete();
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
  <section class="w-full max-w-7xl m-auto sm:bg-[#09090b] sm:rounded-xl h-auto">
    <div
      class=" w-full justify-center m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0 mb-10 min-h-screen"
    ><div class="text-white text-lg text-center font-medium mt-5 mb-5">Major Levels</div>
      <table
        class="border-t border-[#2f343d] hidden sm:inline-table table-sm table-compact w-full m-auto"
      >
        <thead class=" border-b border-[#2f343d]">
          <tr>
            <th class="text-slate-200 font-medium text-sm text-start w-40"
              >Type</th
            >
            <th
              class="text-slate-200 font-medium hidden sm:table-cell text-sm text-end"
              >Levels</th
            >
          </tr>
        </thead>
        <tbody>
          {#each displayList as item, index}
            <!-- row -->
            <tr
              class="{item?.Name === 'LTP'
                ? 'bg-slate-600'
                : ''} sm:hover:bg-slate-400 sm:hover:bg-opacity-[0.2] bg-[#09090b] border-b border-[#141417] shake-ticker cursor-pointer"
            >
              <td class=" border-b-[#09090b] text-white text-sm">
                {item?.Name}
              </td>
              <td class=" border-b-[#09090b] text-white text-sm text-end">
                {item?.Value}
              </td>
            </tr>
          {/each}
          <InfiniteLoading on:infinite={infiniteHandler} />
        </tbody>
      </table>
      <div class="sm:hidden w-full m-auto mt-4 space-y-4">
        {#each techincal_Levels as item}
          <div
            class="bg-[#09090b] p-4 rounded-md shadow-md border border-[#141417]"
          >
            <div class="text-[#FFBE00] text-lg font-medium">{item?.Name}</div>
            <div class="mt-2 text-xs">
              <div class="text-slate-200 flex justify-between">
                <span>Level:</span>
                <span>{item?.Value}</span>
              </div>
            </div>
          </div>
        {/each}
        <InfiniteLoading on:infinite={infiniteHandler} />
        <ScrollToTop />
      </div>
    </div>
    <!-- Page wrapper -->
  </section>
{/if}

<style>
</style>
