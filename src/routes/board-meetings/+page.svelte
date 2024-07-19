<script lang="ts">
  import InfoModal from "$lib/components/InfoModal.svelte";
  import ScrollToTop from "$lib/components/ScrollToTop.svelte";
  import { numberOfUnreadNotification } from "$lib/store";
  import debounce from "lodash.debounce";
  import InfiniteLoading from "$lib/components/InfiniteLoading.svelte";
  import { onMount } from "svelte";

  export let data;

  let sortedData = sortAndFilterByDate(data?.GetBoardMeetings?.results);
  let dailyEvents = [...sortedData];
  let filterQuery = "";
  let displayList: any[] = [];
  let isLoaded = false;

  function sortAndFilterByDate(data) {
    const currentDate = new Date();

    return data
      ?.filter((item) => {
        const [day, month, year] = item.date.split("-");
        const itemDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
        return itemDate >= currentDate;
      })
      ?.sort((a, b) => {
        const dateA = new Date(a.date.split("-").reverse().join("-"));
        const dateB = new Date(b.date.split("-").reverse().join("-"));
        return dateA - dateB;
      });
  }

  async function handleScroll() {
    if (filterQuery.length === 0) {
      const scrollThreshold = document.body.offsetHeight * 0.8; // 80% of the website height
      const isBottom = window.innerHeight + window.scrollY >= scrollThreshold;
      if (isBottom && displayList?.length !== dailyEvents?.length) {
        const nextIndex = displayList?.length;
        const filteredNewResults = dailyEvents?.slice(
          nextIndex,
          nextIndex + 20,
        );
        displayList = [...displayList, ...filteredNewResults];
      }
    }
  }

  let error = null;

  onMount(async () => {
    try {
      sortedData = sortAndFilterByDate(data?.GetBoardMeetings?.results);
      dailyEvents = [...sortedData];
      displayList = dailyEvents?.slice(0, 20) ?? [];
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

  // Debounce the search input
  const debouncedHandleInput = debounce((event) => {
    filterQuery = event.target.value?.toLowerCase();
    filterData();
  }, 300);

  function filterData() {
    if (filterQuery.length !== 0) {
      displayList = dailyEvents.filter((item) => {
        const compName = item?.comp_name?.toLowerCase();
        return compName?.includes(filterQuery);
      });
    } else {
      displayList = dailyEvents?.slice(0, 20) ?? [];
    }
  }

  function handleInput(event) {
    debouncedHandleInput(event);
  }

  async function infiniteHandler({ detail: { loaded, complete } }) {
    try {
      if (displayList?.length === dailyEvents?.length) {
        complete();
      } else {
        if (filterQuery.length === 0) {
          const nextIndex = displayList?.length;
          const newArticles = dailyEvents?.slice(nextIndex, nextIndex + 5);
          displayList = [...displayList, ...newArticles];
          loaded();
        } else {
          complete();
        }
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
  <section
    class="w-full max-w-7xl m-auto sm:bg-[#0d1117] sm:rounded-xl h-auto pl-10 pr-10 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8"
  >
    <div class="flex flex-row items-start">
      <h1 class="text-3xl sm:text-4xl text-white text-start font-bold mb-5">
        Major Board Meetings
      </h1>
    </div>
    <div class="flex sm:flex-row flex-col items-center justify-between">
      <h1 class="text-sm sm:text-sm text-white text-start mt-5 mb-10 sm:w-1/2">
        Below are the scheduled upcoming board meetings along with their
        respective dates. Please identify the ex-dates and agendas for these
        meetings.
      </h1>
      <div class="bg-[#161b22] mb-10">
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
    <div
      class=" w-full justify-center m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0 mb-10 min-h-screen"
    >
      <table
        class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#0d1117] m-auto mt-4"
      >
        <thead>
          <tr>
            <th class="text-slate-200 font-medium text-sm text-start w-40"
              >Date</th
            >
            <th
              class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
              >Symbol</th
            >
            <th
              class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
              >Events</th
            >
            <th
              class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
              >Description</th
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
                {item.date}
              </td>
              <td
                class="{index % 2
                  ? 'bg-[#0d1117]'
                  : 'bg-[#161b22]'} text-[#FFBE00] text-xs border-b-[#0d1117]"
              >
                {item?.symbol}
              </td>
              <td
                class="{index % 2
                  ? 'bg-[#0d1117]'
                  : 'bg-[#161b22]'} text-white text-xs border-b-[#0d1117]"
              >
                {item?.comp_name}
              </td>
              <td
                class="{index % 2
                  ? 'bg-[#0d1117]'
                  : 'bg-[#161b22]'} flex items-center text-xs justify-start text-white border-b-[#0d1117] hover:text-blue-500"
              >
                <label class="cursor-pointer" for={item?.symbol}
                  >{item?.description?.length > 70
                    ? item?.description?.slice(0, 70) + "..."
                    : item?.description}</label
                >
                <InfoModal
                  title={item?.comp_name}
                  content={item?.description}
                  id={item?.symbol}
                />
              </td>
            </tr>
          {/each}
          <InfiniteLoading on:infinite={infiniteHandler} />
        </tbody>
      </table>
      <div class="sm:hidden w-full m-auto mt-4 space-y-4">
        {#each dailyEvents as item}
          <div
            class="bg-[#0d1117] p-4 rounded-md shadow-md border border-[#161b22]"
          >
            <div class="text-[#FFBE00] text-lg font-medium">{item?.symbol}</div>
            <div class="mt-2 text-xs">
              <div class="text-slate-200 flex justify-between">
                <span>Date:</span>
                <span>{item.date}</span>
              </div>
              <div class="text-slate-200 flex justify-between">
                <span>Event:</span>
                <span>{item?.comp_name}</span>
              </div>
              <div class="text-slate-200 flex flex-col justify-between mt-3">
                <span>Description:</span>
                <span class="text-white">
                  <label class="cursor-pointer">
                    {item?.description}
                  </label>
                  <!-- Modal Trigger -->
                </span>
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
