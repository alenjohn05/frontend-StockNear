<script lang="ts">
  import { numberOfUnreadNotification } from "$lib/store";
  import { compareTwoStrings } from "string-similarity";
  import { format } from "date-fns";
  import InfoModal from "$lib/components/InfoModal.svelte";
  export let data;
  let dailyEvents = data?.GetDailyEvents;
  let NseEvents = data?.GetDailyNSEAnnouncements;
  let BseEvents = data?.GetDailyBSEAnnouncements;
  console.log(NseEvents);
  let rawData: any[] = NseEvents;
  let activeData: any[] = NseEvents;
  let filterQuery = "";
  let activeTab = "nse";

  const tabs = [
    { id: "nse", label: "NSE Announcements" },
    { id: "bse", label: "BSE Announcements" }
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
      if (filterQuery.length !== 0) {
        rawData = activeData.filter((item) => {
          const compName = item?.SecurityName?.toLowerCase();
          return compName?.includes(filterQuery);
        });
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
  class="w-full max-w-7xl m-auto sm:bg-[#0d1117] sm:rounded-xl h-auto pl-10 pr-10 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8"
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
      class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#0d1117] m-auto mt-4"
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
            class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#0d1117] border-b border-[#161b22] shake-ticker cursor-pointer"
          >
            <td
              class="{index % 2
                ? 'bg-[#0d1117]'
                : 'bg-[#161b22]'} border-b-[#0d1117]"
            >
              {format(new Date(item.Date), "dd-MM-yyyy")}
            </td>
            <td
              class="{index % 2
                ? 'bg-[#0d1117]'
                : 'bg-[#161b22]'} text-white border-b-[#0d1117]"
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
    <div class="bg-[#161b22]">
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
    class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-[#161b22] dark:border-[#161b22] dark:text-[#161b22]"
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

  <div
    class=" w-full justify-center m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0 mb-10"
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
            >Company Name</th
          >
          <th
            class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
            >Events</th
          >
          <th
            class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
            >File Refference</th
          >
        </tr>
      </thead>
      <tbody>
        {#each rawData as item, index}
          <!-- row -->
          <tr
            class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#0d1117] border-b border-[#161b22] shake-ticker cursor-pointer"
          >
            <td
              class="{index % 2
                ? 'bg-[#0d1117]'
                : 'bg-[#161b22]'} border-b-[#0d1117] text-xs font-bold"
            >
              {format(new Date(item?.Date), "dd-MM-yyyy")}
            </td>
            <td
              class="{index % 2
                ? 'bg-[#0d1117]'
                : 'bg-[#161b22]'} text-[#FFBE00] text-xs border-b-[#0d1117]"
            >
              <a href={"/stocks/" + item?.SecurityID}>{item?.SecurityName}</a>
            </td>

            <td
              class="{index % 2
                ? 'bg-[#0d1117]'
                : 'bg-[#161b22]'} items-center text-xs text-white border-b-[#0d1117] hover:text-blue-500"
            >
              {item?.Subject}
            </td>
            <td
              class="{index % 2
                ? 'bg-[#0d1117]'
                : 'bg-[#161b22]'} flex items-center text-xs justify-center text-white border-b-[#0d1117] hover:text-blue-500"
            >
              {#if item?.FileURL}
                <a href={item?.FileURL} target="_blank"
                  ><svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    class="text-white hover:text-blue-600"
                    ><path
                      fill="currentcolor"
                      d="m15.904,16.143c.197.193.201.51.008.707l-2.515,2.57c-.381.381-.88.574-1.378.579-.499-.004-1.034-.196-1.413-.575l-2.519-2.574c-.193-.197-.189-.514.008-.707.199-.193.516-.188.707.008l2.515,2.57c.056.056.117.103.183.143v-7.363c0-.276.224-.5.5-.5s.5.224.5.5v7.363c.066-.04.129-.088.187-.146l2.511-2.566c.193-.196.51-.201.707-.008Zm6.096-6.157v9.515c0,2.481-2.019,4.5-4.5,4.5H6.5c-2.481,0-4.5-2.019-4.5-4.5V4.5C2,2.019,4.019,0,6.5,0h5.515c1.735,0,3.368.676,4.597,1.904l3.484,3.485c1.228,1.227,1.904,2.859,1.904,4.596Zm-8-3.485c0,.827.673,1.5,1.5,1.5h5.132c-.273-.706-.693-1.353-1.244-1.904l-3.484-3.485c-.552-.551-1.199-.97-1.904-1.243v5.132Zm7,3.485c0-.334-.03-.663-.088-.985h-5.412c-1.379,0-2.5-1.122-2.5-2.5V1.088c-.322-.058-.651-.088-.985-.088h-5.515c-1.93,0-3.5,1.57-3.5,3.5v15c0,1.93,1.57,3.5,3.5,3.5h11c1.93,0,3.5-1.57,3.5-3.5v-9.515Zm-8.981,10.014c-.007,0,.006,0,0,0h0Z"
                    /></svg
                  >
                </a>
              {/if}
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
