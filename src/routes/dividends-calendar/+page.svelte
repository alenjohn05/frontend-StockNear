<script lang="ts">
  import { goto } from "$app/navigation";
  import ScrollToTop from "$lib/components/ScrollToTop.svelte";
  import dividendsLogo from "$lib/images/dividends_calendar_logo.png";
  import { numberOfUnreadNotification, screenWidth } from "$lib/store";
  import {
    addDays,
    addWeeks,
    differenceInWeeks,
    format,
    startOfWeek,
    subWeeks
  } from "date-fns";

  interface DividendCalendarItem {
    Date: string;
    [key: string]: any;
  }

  interface DayData {
    name: string;
    date: string;
  }

  interface DividendCalendarDay {
    name: string;
    data: DividendCalendarItem[];
    [key: string]: any;
  }

  export let data: {
    getDividendCalenderDetails?: DividendCalendarItem[];
  };

  let currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
  let dividendCalendar: DividendCalendarDay[] = [];
  const maxWeeksChange = 4;
  let previousMax = false;
  let nextMax = false;
  const today = new Date();

  let mondayDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  let formattedMonday = format(mondayDate, "EEE, MMM d");
  let formattedTuesday = format(addDays(mondayDate, 1), "EEE, MMM d");
  let formattedWednesday = format(addDays(mondayDate, 2), "EEE, MMM d");
  let formattedThursday = format(addDays(mondayDate, 3), "EEE, MMM d");
  let formattedFriday = format(addDays(mondayDate, 4), "EEE, MMM d");

  let formattedWeekday = [
    formattedMonday,
    formattedTuesday,
    formattedWednesday,
    formattedThursday,
    formattedFriday
  ];
  let weekday: DividendCalendarItem[][] = [];

  let startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
  let endDate = addDays(startDate, 4);
  let formattedStartDate = format(startDate, "yyyy-MM-dd");
  let formattedEndDate = format(endDate, "yyyy-MM-dd");
  let daysOfWeek: DayData[] = [
    { name: "Monday", date: formattedStartDate },
    { name: "Tuesday", date: format(addDays(startDate, 1), "yyyy-MM-dd") },
    { name: "Wednesday", date: format(addDays(startDate, 2), "yyyy-MM-dd") },
    { name: "Thursday", date: format(addDays(startDate, 3), "yyyy-MM-dd") },
    { name: "Friday", date: formattedEndDate }
  ];

  let currentDate = new Date();
  let currentWeekday = Math.min((currentDate.getDay() + 6) % 7, 4);
  let selectedWeekday = currentWeekday;

  function toggleDate(index: number) {
    if ($screenWidth > 640) {
      selectedWeekday = index;
    }
  }

  function clickWeekday(state: "next" | "previous", index: number) {
    if (state === "next" && selectedWeekday + 1 <= 4) {
      selectedWeekday = selectedWeekday + 1;
    } else if (state === "previous" && selectedWeekday - 1 >= 0) {
      selectedWeekday--;
    } else if (
      state === "previous" &&
      index === 0 &&
      differenceInWeeks(currentWeek, today) > -maxWeeksChange
    ) {
      changeWeek(state);
      selectedWeekday = 4;
    } else if (
      state === "next" &&
      index === 4 &&
      differenceInWeeks(currentWeek, today) < maxWeeksChange
    ) {
      changeWeek(state);
      selectedWeekday = 0;
    }
  }

  async function changeWeek(state: "next" | "previous") {
    if (
      state === "previous" &&
      differenceInWeeks(currentWeek, today) > -maxWeeksChange
    ) {
      currentWeek = subWeeks(currentWeek, 1);
    } else if (
      state === "next" &&
      differenceInWeeks(currentWeek, today) < maxWeeksChange
    ) {
      currentWeek = addWeeks(currentWeek, 1);
    }

    mondayDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
    formattedMonday = format(mondayDate, "EEE, MMM d");
    formattedTuesday = format(addDays(mondayDate, 1), "EEE, MMM d");
    formattedWednesday = format(addDays(mondayDate, 2), "EEE, MMM d");
    formattedThursday = format(addDays(mondayDate, 3), "EEE, MMM d");
    formattedFriday = format(addDays(mondayDate, 4), "EEE, MMM d");

    formattedWeekday = [
      formattedMonday,
      formattedTuesday,
      formattedWednesday,
      formattedThursday,
      formattedFriday
    ];
    weekday = [];

    startDate = startOfWeek(currentWeek, { weekStartsOn: 1 });
    endDate = addDays(startDate, 4);
    formattedStartDate = format(startDate, "yyyy-MM-dd");
    formattedEndDate = format(endDate, "yyyy-MM-dd");
    daysOfWeek = [
      { name: "Monday", date: formattedStartDate },
      { name: "Tuesday", date: format(addDays(startDate, 1), "yyyy-MM-dd") },
      { name: "Wednesday", date: format(addDays(startDate, 2), "yyyy-MM-dd") },
      { name: "Thursday", date: format(addDays(startDate, 3), "yyyy-MM-dd") },
      { name: "Friday", date: formattedEndDate }
    ];

    dividendCalendar = daysOfWeek.map((day) => ({
      name: day.name,
      data:
        data?.getDividendCalenderDetails?.filter(
          (item) => format(new Date(item.Date), "yyyy-MM-dd") === day.date
        ) ?? []
    }));

    if (dividendCalendar?.length) {
      for (let i = 0; i < dividendCalendar.length; i++) {
        weekday[i] = dividendCalendar[i].data;
      }
    }
  }

  $: {
    if (data?.getDividendCalenderDetails) {
      dividendCalendar = daysOfWeek.map((day) => ({
        name: day.name,
        data:
          data.getDividendCalenderDetails?.filter(
            (item) => format(new Date(item.Date), "yyyy-MM-dd") === day.date
          ) || []
      }));
      if (dividendCalendar.length) {
        for (let i = 0; i < dividendCalendar.length; i++) {
          const dayData = dividendCalendar[i].data;
          weekday[i] = dayData.sort(
            (a, b) => (b.marketCap ?? 0) - (a.marketCap ?? 0)
          );
        }
      }
    } else {
      dividendCalendar = [];
    }
  }

  $: {
    if (currentWeek) {
      previousMax = differenceInWeeks(currentWeek, today) <= -maxWeeksChange;
      nextMax = differenceInWeeks(currentWeek, today) >= maxWeeksChange;
    }
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} Dividends
    Calendar · octopi
  </title>
  <meta
    name="description"
    content={`A list of upcoming dividends on the US stock market, with dates, times and estimated revenue and dividends growth.`}
  />

  <!-- Other meta tags -->
  <meta property="og:title" content={`Dividends Calendar · octopi`} />
  <meta
    property="og:description"
    content={`A list of upcoming dividends on the US stock market, with dates, times and estimated revenue and dividends growth.`}
  />
  <meta
    property="og:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <meta property="og:type" content="website" />
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Dividends Calendar · octopi`} />
  <meta
    name="twitter:description"
    content={`A list of upcoming dividends on the US stock market, with dates, times and estimated revenue and dividends growth.`}
  />
  <meta
    name="twitter:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>

<section
  class="w-full max-w-4xl overflow-hidden m-auto min-h-screen pt-4 pb-40"
>
  <!--
      <div class="text-sm breadcrumbs ml-4">
        <ul>
          <li><a href="/" class="text-gray-300">Home</a></li> 
          <li class="text-gray-300">Dividends Calendar</li>
        </ul>
      </div>
    -->

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
            Dividends Calendar
          </h1>
        </div>

        <span
          class="hidden sm:block text-white text-md font-medium text-center flex justify-center items-center"
        >
          Stay updated on upcoming Dividends in the stock market.
        </span>
      </div>
      <!-- End Column -->

      <!-- Start Column -->
      <div class="hidden sm:block relative m-auto mb-5 mt-5 sm:mb-0 sm:mt-0">
        <svg
          class="w-36 -my-5"
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

        <div class="z-1 absolute top-2 right-7">
          <img class="w-24" src={dividendsLogo} alt="logo" loading="lazy" />
        </div>
      </div>
      <!-- End Column -->
    </div>
  </div>

  <!-- Page wrapper -->
  <div
    class="flex justify-center w-full max-w-5xl m-auto h-full overflow-hidden"
  >
    <!-- Content area -->
    <div class="relative flex flex-col flex-1 overflow-hidden">
      <!-- Cards -->
      <div
        class=" w-full flex flex-row justify-center m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0"
      >
        <!-- Start Columns -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          role="button"
          on:click={() => changeWeek("previous")}
          tabindex="0"
          class="{previousMax
            ? 'opacity-80'
            : ''} hidden sm:flex h-16 w-48 cursor-pointer border m-auto flex bg-[#3C40F0] hover:bg-[#161b22] border border-blue-600 mb-3"
        >
          <svg
            class="w-6 h-6 m-auto rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ><path
              fill="white"
              d="M8.025 22L6.25 20.225L14.475 12L6.25 3.775L8.025 2l10 10l-10 10Z"
            /></svg
          >
        </div>
        {#each weekday as day, index}
          <div
            class="w-full {index === selectedWeekday ? '' : 'hidden sm:block'}"
          >
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              role="button"
              tabindex="0"
              on:click={() => toggleDate(index)}
              class="w-11/12 m-auto sm:w-full cursor-pointer h-16 {index ===
              selectedWeekday
                ? 'bg-[#161b22] bg-opacity-[0.6] sm:bg-[#A24D51] sm:gradient-effect'
                : ''} flex rounded-lg sm:rounded-none bg-[#3C40F0] border border-blue-600 mb-3"
            >
              <div class=" flex flex-row justify-center items-center w-full">
                <div
                  tabindex="0"
                  role="button"
                  on:click={() => clickWeekday("previous", index)}
                  class="sm:hidden ml-auto"
                >
                  <svg
                    class="w-8 h-8 inline-block rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    ><path
                      fill="white"
                      d="M8.025 22L6.25 20.225L14.475 12L6.25 3.775L8.025 2l10 10l-10 10Z"
                    /></svg
                  >
                </div>
                <div class="flex flex-col text-white truncate m-auto p-1">
                  <span class="font-medium text-md"
                    >{formattedWeekday[index]}</span
                  >
                  <span class="text-sm m-auto pt-1 pb-1">
                    {day.length} Dividends</span
                  >
                </div>
                <div
                  role="button"
                  tabindex="0"
                  on:click={() => clickWeekday("next", index)}
                  class="sm:hidden mr-auto"
                >
                  <svg
                    class="w-8 h-8 inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    ><path
                      fill="white"
                      d="M8.025 22L6.25 20.225L14.475 12L6.25 3.775L8.025 2l10 10l-10 10Z"
                    /></svg
                  >
                </div>
              </div>
            </div>
          </div>
        {/each}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          role="button"
          tabindex="0"
          on:click={() => changeWeek("next")}
          class="{nextMax
            ? 'opacity-80'
            : ''} hidden sm:flex h-16 w-48 cursor-pointer border m-auto flex bg-[#3C40F0] hover:bg-[#161b22] border border-blue-600 mb-3"
        >
          <svg
            class="w-6 h-6 m-auto"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            ><path
              fill="white"
              d="M8.025 22L6.25 20.225L14.475 12L6.25 3.775L8.025 2l10 10l-10 10Z"
            /></svg
          >
        </div>
      </div>

      {#each weekday as day, index}
        {#if index === selectedWeekday}
          {#if day?.length !== 0}
            <table
              class="hidden sm:inline-table table table-sm table-compact rounded-none sm:rounded-md w-full border-[#141720] m-auto mt-4"
            >
              <thead>
                <tr>
                  <th class="text-white font-medium text-sm">Logo</th>
                  <th class="text-white font-medium text-sm">Company Name</th>
                  <th
                    class="text-white font-medium hidden sm:table-cell text-sm"
                    >Dividend Details</th
                  >
                  <th
                    class="text-white font-medium hidden sm:table-cell text-sm"
                    >Pay Out Date</th
                  >
                </tr>
              </thead>
              <tbody>
                {#each day as item, index}
                  <!-- row -->
                  <tr
                    on:click={() => goto("/stocks/" + item?.SecurityID)}
                    class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] odd:bg-[#0d1117] border-b-[#0d1117] cursor-pointer"
                  >
                    <th
                      class="{index % 2
                        ? 'bg-[#0d1117]'
                        : 'bg-[#161b22]'} border-b border-[#161b22] text-gray-200"
                    >
                      <div class="flex flex-row items-center">
                        <div
                          class="flex-shrink-0 rounded-full w-9 h-9 relative bg-[#0d1117] flex items-center justify-center"
                        >
                          <!-- svelte-ignore a11y-missing-attribute -->
                          <img
                            style="clip-path: circle(50%);"
                            class="rounded-full w-7"
                            src={item?.SecurityLogoUrl}
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <!--{item?.firstName} {item?.lastName}-->
                    </th>

                    <td
                      class="{index % 2
                        ? 'bg-[#0d1117]'
                        : 'bg-[#161b22]'} text-[#FFBE00] border-b border-[#161b22] font-bold"
                    >
                      {item?.SecurityName}
                    </td>
                    <td
                      class="{index % 2
                        ? 'bg-[#0d1117]'
                        : 'bg-[#161b22]'} text-white hidden sm:table-cell border-b border-[#161b22]"
                    >
                      {item?.Purpose}
                    </td>
                    <td
                      class="{index % 2
                        ? 'bg-[#0d1117]'
                        : 'bg-[#161b22]'} text-center text-white hidden sm:table-cell border-b border-[#161b22]"
                    >
                      {format(new Date(item.Date), "dd-MM-yyyy")}
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>

            <div class="relative p-2 sm:hidden pt-5">
              {#each day as item}
                <div
                  class="bg-[#0d1117] rounded-lg border border-slate-800 shadow-lg h-auto pb-3 pl-2 pr-2 pt-4 mb-7"
                >
                  <div class="flex flex-row items-center">
                    <div
                      class="rounded-full w-10 h-10 relative bg-[#101112] flex items-center justify-center"
                    >
                      <!-- svelte-ignore a11y-missing-attribute -->
                      <img
                        style="clip-path: circle(50%);"
                        class="w-6 h-6"
                        src={item?.SecurityLogoUrl}
                        loading="lazy"
                      />
                    </div>

                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div
                      role="button"
                      tabindex="0"
                      on:click={() => goto("/stocks/" + item?.SecurityID)}
                      class="cursor-pointer flex flex-col ml-3 w-40"
                    >
                      <span class="text-slate-300 text-sm font-bold"
                        >{item?.SecurityName}</span
                      >
                    </div>

                    <div class="flex flex-col justify-end items-end ml-auto">
                      <span class="font-medium text-slate-400 text-ends text-sm"
                        >Payment Date</span
                      >
                      <span
                        class="text-white text-opacity-[0.8] text-md text-end font-bold"
                      >
                        {format(new Date(item.Date), "dd-MM-yyyy")}
                      </span>
                    </div>
                  </div>
                  <div
                    class="border-1 border-b border-slate-800 w-full mt-5 mb-5"
                  />
                  <div class="flex flex-row items-center">
                    <div class="flex flex-col justify-end items-end ml-auto">
                      <span class="font-medium text-slate-400 text-ends text-sm"
                        >Dividend Details</span
                      >
                      <span class="text-white text-md font-bold text-end">
                        {item?.Purpose}
                      </span>
                    </div>
                  </div>
                </div>
              {/each}

              <ScrollToTop />
            </div>
          {:else}
            <h2
              class=" mt-20 justify-center items-center text-3xl font-bold text-slate-700 mb-5 m-auto"
            >
              No data available
            </h2>
          {/if}
        {/if}
      {/each}
    </div>
  </div>
</section>

<style>
</style>
