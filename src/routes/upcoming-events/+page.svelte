<script lang="ts">
  import { numberOfUnreadNotification } from "$lib/store";
  import { compareTwoStrings } from "string-similarity";
  import { format } from "date-fns";
  import InfoModal from "$lib/components/InfoModal.svelte";
  export let data;
  let dailyEvents = data?.GetDailyEvents;
  let NseEvents = data?.GetDailyNSEAnnouncements?.results;
  let BseEvents = data?.GetDailyBSEAnnouncements?.results;
  let rawData: any[] = NseEvents;
  let activeData: any[] = NseEvents;
  let filterQuery = "";
  console.log(data);
  let activeTab = "nse";

  const tabs = [
    { id: "nse", label: "NSE Announcements" },
    { id: "bse", label: "BSE Announcements" },
  ];
  function setActiveTab(tabId: string) {
    activeTab = tabId;
    if (tabId === "nse") {
      rawData = NseEvents;
      activeData = NseEvents;
    } else {
      rawData = BseEvents;
      activeData = BseEvents;
    }
  }
  function handleInput(event) {
    filterQuery = event.target.value?.toLowerCase();
    let newData = [];
    setTimeout(() => {
      if (filterQuery?.length !== 0) {
        newData = rawData?.filter((item) => {
          const representative = item?.comp_name?.toLowerCase();
          if (representative?.includes(filterQuery)) return true;
          const similarityThreshold = 0.5;
          const similarity = compareTwoStrings(representative, filterQuery);
          return similarity > similarityThreshold;
        });
        if (newData?.length !== 0) {
          rawData = newData;
        } else {
          rawData = activeData;
        }
      } else {
        rawData = activeData;
      }
    }, 300);
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

<section
  class="w-full max-w-7xl m-auto sm:bg-[#111111] sm:rounded-xl h-auto pl-10 pr-10 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8"
>
  <div class="flex flex-row items-start">
    <h1 class="text-3xl sm:text-4xl text-white text-start font-bold mb-5">
      Major Events & Announcements
    </h1>
  </div>
  <div
    class=" w-full justify-center m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0 mb-10"
  >
    <h1 class="text-xl sm:text-xl text-white text-start font-bold mt-5">
      Today's Events
    </h1>
    <table
      class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#111111] m-auto mt-4"
    >
      <thead>
        <tr>
          <th class="text-slate-200 font-medium text-sm text-start">Date</th>
          <th
            class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
            >Events</th
          >
        </tr>
      </thead>
      <tbody>
        {#each dailyEvents as item, index}
          <!-- row -->
          <tr
            class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#111111] border-b border-[#1a1a1a] shake-ticker cursor-pointer"
          >
            <td
              class="{index % 2
                ? 'bg-[#111111]'
                : 'bg-[#1A1A1A]'} border-b-[#111111]"
            >
              {format(new Date(item.Date), "dd-MM-yyyy")}
            </td>
            <td
              class="{index % 2
                ? 'bg-[#111111]'
                : 'bg-[#1A1A1A]'} text-white border-b-[#111111]"
            >
              {item?.Description}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="flex items-center justify-between">
    <h1 class="text-xl sm:text-xl text-white text-start font-bold mt-10 mb-5">
      Exchange Announcements
    </h1>
    <div class="bg-[#1A1A1A]">
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
  <ul
    class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-[#1A1A1A] dark:border-[#1A1A1A] dark:text-[#1A1A1A]"
  >
    {#each tabs as tab}
      <li class="me-2">
        <a
          href="#"
          class="inline-block p-2 {activeTab === tab.id
            ? 'border-b border-blue-300 text-white bg-[#1A1A1A] active dark:bg-[#1a1a1a] dark:text-white'
            : ' text-gray-500 bg-[#111111] active dark:bg-[#111111] dark:text-white'}"
          on:click|preventDefault={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </a>
      </li>
    {/each}
  </ul>

  <div
    class=" w-full justify-center m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0 mb-10"
  >
    <table
      class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#111111] m-auto mt-4"
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
        {#each rawData as item, index}
          <!-- row -->
          <tr
            class="sm:hover:bg-[#245073]  sm:hover:bg-opacity-[0.2] bg-[#111111] border-b border-[#1a1a1a] shake-ticker cursor-pointer"
          >
            <td
              class="{index % 2
                ? 'bg-[#111111]'
                : 'bg-[#1A1A1A]'} border-b-[#111111] text-xs font-bold"
            >
              {item.date}
            </td>
            <td
              class="{index % 2
                ? 'bg-[#111111]'
                : 'bg-[#1A1A1A]'} text-[#FFBE00] text-xs border-b-[#111111]"
            >
              {item?.symbol}
            </td>
            <td
              class="{index % 2
                ? 'bg-[#111111]'
                : 'bg-[#1A1A1A]'} text-white text-xs border-b-[#111111]"
            >
              {item?.comp_name}
            </td>
            <td
              class="{index % 2
                ? 'bg-[#111111]'
                : 'bg-[#1A1A1A]'} flex items-center text-xs justify-start text-white border-b-[#111111] hover:text-blue-500 font-bold"
            >
              <label class="cursor-pointer" for={item?.symbol}> {item?.description}</label>
              <InfoModal
                title={item?.comp_name}
                content={item?.memo}
                id={item?.symbol}
              />
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <!-- Page wrapper -->
</section>

<style>
</style>
