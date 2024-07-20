<script lang="ts">
  import { goto } from "$app/navigation";
  import dividendsLogo from "$lib/images/dividends_calendar_logo.png";
  import { numberOfUnreadNotification } from "$lib/store";
  import { format } from "date-fns";

  export let data;
  let rightsIssues = data?.getRightsCalenderDetails;
  let bonusIssues = data?.getBounsCalenderDetails;
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} Bonus
    and Rights Calendar · octopi
  </title>
  <meta
    name="description"
    content={`A list of upcoming Bonus and Rights on the Indian stock market, with dates, times and estimated revenue and Bonus and Rights growth.`}
  />

  <!-- Other meta tags -->
  <meta property="og:title" content={`Bonus and Rights Calendar · octopi`} />
  <meta
    property="og:description"
    content={`A list of upcoming Bonus and Rights on the Indian stock market, with dates, times and estimated revenue and Bonus and Rights growth.`}
  />
  <meta
    property="og:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <meta property="og:type" content="website" />
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={`Bonus and Rights Calendar · octopi`} />
  <meta
    name="twitter:description"
    content={`A list of upcoming Bonus and Rights on the Indian stock market, with dates, times and estimated revenue and Bonus and Rights growth.`}
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
            Bonus and Rights Calendar
          </h1>
        </div>

        <span
          class="hidden sm:block text-white text-md font-medium text-center flex justify-center items-center"
        >
          Stay updated on upcoming Bonus and Rights in the stock market.
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
        class=" w-full justify-center m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0 mb-10"
      >
        <div class="flex flex-row items-center">
          <label
            for=""
            class="mr-1 cursor-pointer flex flex-row items-center text-white text-xl sm:text-2xl font-bold"
          >
            Upcoming Rights
          </label>
        </div>
        <table
          class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#0d1117] m-auto mt-4"
        >
          <table
            class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#0d1117] m-auto mt-4"
          >
            <thead>
              <tr class="border-b border-gray-800">
                <th class="text-slate-200 font-medium text-sm text-start"></th>
                <th class="text-slate-200 font-medium text-sm text-start"
                  >Company Name</th
                >
                <th
                  class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                  >Split Details</th
                >
                <th
                  class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                  >Ex Date</th
                >
              </tr>
            </thead>
            <tbody>
              {#if rightsIssues.length === 0}
                <tr>
                  <td
                    colspan="4"
                    class="text-center text-white bg-[#0d1117] border-b-[#0d1117] py-4"
                  >
                    No data available
                  </td>
                </tr>
              {:else}
                {#each rightsIssues as item, index}
                  <!-- row -->
                  <tr
                    on:click={() => goto("/stocks/" + item?.symbol)}
                    class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#0d1117] border-b border-[#161b22] shake-ticker cursor-pointer"
                  >
                    <th
                      class="{index % 2
                        ? 'bg-[#0d1117]'
                        : 'bg-[#161b22]'} text-gray-200"
                    >
                      <div class="flex flex-row items-center">
                        <div
                          class="flex-shrink-0 rounded-full w-9 h-9 relative bg-[#0d1117] flex items-center justify-center"
                        >
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
                        : 'bg-[#161b22]'} border-b-[#0d1117]"
                    >
                      <label
                        on:click={() => goto("/stocks/" + item?.SecurityID)}
                        class="cursor-pointer text-[#FFBE00] font-bold"
                      >
                        {item?.SecurityName}
                      </label>
                    </td>
                    <td
                      class="{index % 2
                        ? 'bg-[#0d1117]'
                        : 'bg-[#161b22]'} text-white border-b-[#0d1117]"
                    >
                      {item?.Purpose}
                    </td>
                    <td
                      class="{index % 2
                        ? 'bg-[#0d1117]'
                        : 'bg-[#161b22]'} text-white border-b-[#0d1117]"
                    >
                      {format(new Date(item.Date), "dd-MM-yyyy")}
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>
        </table>
      </div>
      <div class=" w-full m-auto items-center pl-2 pr-2 sm:pl-0 sm:pr-0 mt-10">
        <div class="flex flex-row items-center">
          <label
            for=""
            class="mr-1 cursor-pointer flex flex-row items-center text-white text-xl sm:text-2xl font-bold"
          >
            Upcoming Bonus Issues
          </label>
        </div>
        <table
          class="hidden sm:inline-table table-sm table-compact rounded-none sm:rounded-md w-full border-bg-[#0d1117] m-auto mt-4"
        >
          <thead>
            <tr class="border-b border-gray-800">
              <th class="text-slate-200 font-medium text-sm text-start"></th>
              <th class="text-slate-200 font-medium text-sm text-start"
                >Company Name</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                >Bonus Details</th
              >
              <th
                class="text-slate-200 font-medium hidden sm:table-cell text-sm text-start"
                >Ex Date</th
              >
            </tr>
          </thead>
          <tbody>
            {#if bonusIssues.length === 0}
              <tr>
                <td
                  colspan="4"
                  class="text-center text-white bg-[#0d1117] border-b-[#0d1117] py-4"
                >
                  No data available
                </td>
              </tr>
            {:else}
              {#each bonusIssues as item, index}
                <!-- row -->
                <tr
                  on:click={() => goto("/stocks/" + item?.symbol)}
                  class="sm:hover:bg-[#245073] sm:hover:bg-opacity-[0.2] bg-[#0d1117] border-b border-[#161b22] shake-ticker cursor-pointer"
                >
                  <th
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-gray-200"
                  >
                    <div class="flex flex-row items-center">
                      <div
                        class="flex-shrink-0 rounded-full w-9 h-9 relative bg-[#0d1117] flex items-center justify-center"
                      >
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
                      : 'bg-[#161b22]'} border-b-[#0d1117]"
                  >
                    <label
                      on:click={() => goto("/stocks/" + item?.SecurityID)}
                      class="cursor-pointer text-[#FFBE00] font-bold"
                    >
                      {item?.SecurityName}
                    </label>
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-white border-b-[#0d1117]"
                  >
                    {item?.Purpose}
                  </td>
                  <td
                    class="{index % 2
                      ? 'bg-[#0d1117]'
                      : 'bg-[#161b22]'} text-white border-b-[#0d1117]"
                  >
                    {format(new Date(item.Date), "dd-MM-yyyy")}
                  </td>
                </tr>
              {/each}
            {/if}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</section>

<style>
  .gradient-effect {
    background: linear-gradient(100deg, #b46266, #a24d51);
    color: #fff;
    position: relative;
    overflow: hidden;
  }
</style>
