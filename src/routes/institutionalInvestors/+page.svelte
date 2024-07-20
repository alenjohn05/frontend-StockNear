<script lang="ts">
  import democraticBackground from "$lib/images/bg-democratic.png";
  import { numberOfUnreadNotification, screenWidth } from "$lib/store";
  import { compareTwoStrings } from "string-similarity";
  import { onMount } from "svelte";
  export let data;

  let rawData = data?.GetInsititutionalInvestors;
  let displayList: any[] = [];
  let filterQuery = "";
  let isLoaded = false;
  let sortBy = "";
  let sortOrder = "desc";

  async function handleScroll() {
    const scrollThreshold = document.body.offsetHeight * 0.8; // 80% of the website height
    const isBottom = window.innerHeight + window.scrollY >= scrollThreshold;
    if (isBottom && displayList?.length !== rawData?.length) {
      const nextIndex = displayList?.length;
      const filteredNewResults = rawData?.slice(nextIndex, nextIndex + 20);
      displayList = [...displayList, ...filteredNewResults];
    }
  }
  onMount(async () => {
    displayList = rawData?.slice(0, 20) ?? [];
    isLoaded = true;

    window.addEventListener("scroll", handleScroll);
    //window.addEventListener('keydown', handleKeyDown);

    return () => {
      // Cleanup the event listeners when the component is unmounted
      window.removeEventListener("scroll", handleScroll);
      //window.removeEventListener('keydown', handleKeyDown);
    };
  });

  function applySorting() {
    if (sortBy) {
      rawData.sort((a: any, b: any) => {
        let comparison = 0;
        if (sortBy === "HoldingValue") {
          comparison = a.HoldingValue - b.HoldingValue;
        } else if (sortBy === "TopPeformingC3MZG") {
          comparison = a.TopPeformingC3MZG - b.TopPeformingC3MZG;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
    }
    displayList = rawData?.slice(0, 20);
  }

  function handleInput(event) {
    filterQuery = event.target.value?.toLowerCase();
    let newData = [];
    setTimeout(() => {
      if (filterQuery?.length !== 0) {
        newData = rawData?.filter((item) => {
          const representative = item?.Name?.toLowerCase();
          // Check if representative includes filterQuery
          if (representative?.includes(filterQuery)) return true;
          // Implement fuzzy search by checking similarity
          // You can adjust the threshold as needed
          const similarityThreshold = 0.5;
          const similarity = compareTwoStrings(representative, filterQuery);
          return similarity > similarityThreshold;
        });
        if (newData?.length !== 0) {
          rawData = newData;
          displayList = [...newData];
        } else {
          // Reset to original data if no matches found
          rawData = data?.GetInsititutionalInvestors;
          displayList = rawData?.slice(0, 20);
        }
      } else {
        // Reset to original data if filter is empty
        rawData = data?.GetInsititutionalInvestors;
        displayList = rawData?.slice(0, 20);
      }
    }, 300);
  }

  let charNumber = 40;
  $: {
    if ($screenWidth < 640) {
      charNumber = 20;
    } else {
      charNumber = 40;
    }
  }

  function handleSort(column: any) {
    if (sortBy === column) {
      sortOrder = sortOrder === "asc" ? "desc" : "asc";
    } else {
      sortBy = column;
      sortOrder = "desc";
    }
    applySorting();
  }
</script>

<!-- HEADER FOR BETTER SEO -->
<svelte:head>
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} Institutional
    Investors Details · octopi</title
  >
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />

  <meta
    name="description"
    content="What are Institutional Investors? An institutional investor is a company or organization that invests money on behalf of clients or members.   "
  />
  <!-- Other meta tags -->
  <meta
    property="og:title"
    content="Institutional Investors Details · octopi"
  />
  <meta
    property="og:description"
    content="What are Institutional Investors?   An institutional investor is a company or organization that invests money on behalf of clients or members.    "
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
    content="Institutional Investors Details · octopi"
  />
  <meta
    name="twitter:description"
    content="What are US Politicians trading? An institutional investor is a company or organization that invests money on behalf of clients or members. "
  />
  <meta
    name="twitter:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>

<section
  class="w-full max-w-6xl overflow-hidden m-auto min-h-screen pt-5 pb-60"
>
  <div class="text-sm breadcrumbs ml-4">
    <ul>
      <li><a href="/" class="text-gray-300">Home</a></li>
      <li class="text-gray-300">Institutional Investors</li>
    </ul>
  </div>
  <body class="w-full max-w-6xl overflow-hidden m-auto">
    {#if isLoaded}
      <section
        class="w-full max-w-6xl overflow-hidden m-auto sm:mt-10 px-0 sm:px-3 mt-10"
      >
        <div
          class="p-3 sm:p-0 flex justify-center w-full m-auto overflow-hidden"
        >
          <div
            class="relative flex justify-center items-center overflow-hidden w-full"
          >
            <main class="w-full">
              <div class="w-full pb-3">
                <div class="relative right-0 bg-[#09090b]">
                  <ul
                    class="relative grid grid-cols-1 sm:grid-cols-4 gap-y-3 gap-x-3 flex flex-wrap p-1 list-none rounded-[3px]"
                  >
                    <li
                      class="bg-[#141417] mb-4 rounded border border-[#141417]"
                    >
                      <label class="flex flex-row items-center">
                        <input
                          id="modal-search"
                          type="search"
                          class="text-white ml-2 text-xs placeholder-gray-400 border-transparent focus:border-transparent focus:ring-0 flex items-center justify-center w-full px-0 py-1 bg-inherit"
                          placeholder="Find by name"
                          bind:value={filterQuery}
                          on:input={handleInput}
                          autocomplete="off"
                        />
                        <svg
                          class="ml-auto mr-5 h-6 w-6 inline-block mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          ><path
                            fill="#fff"
                            d="m19.485 20.154l-6.262-6.262q-.75.639-1.725.989t-1.96.35q-2.402 0-4.066-1.663T3.808 9.503T5.47 5.436t4.064-1.667t4.068 1.664T15.268 9.5q0 1.042-.369 2.017t-.97 1.668l6.262 6.261zM9.539 14.23q1.99 0 3.36-1.37t1.37-3.361t-1.37-3.36t-3.36-1.37t-3.361 1.37t-1.37 3.36t1.37 3.36t3.36 1.37"
                          /></svg
                        >
                      </label>
                    </li>
                    <li
                      class="bg-[#141417] mb-4 rounded border border-[#141417] text-center rounded-[3px] cursor-pointer flex items-center justify-center"
                      on:click={() => handleSort("HoldingValue")}
                    >
                      <span
                        class="text-[0.75rem] sm:text-[1rem] text-gray-400 ml-2"
                      >
                        Sort by Holding Value {sortBy === "HoldingValue"
                          ? sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </span>
                    </li>
                    <li
                      class="bg-[#141417] mb-4 rounded border border-[#141417] text-center rounded-[3px] cursor-pointer flex items-center justify-center"
                      on:click={() => handleSort("TopPeformingC3MZG")}
                    >
                      <span
                        class="text-[0.75rem] sm:text-[1rem] text-gray-400 ml-2"
                      >
                        Sort by 3M Change {sortBy === "TopPeformingC3MZG"
                          ? sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="w-full m-auto mt-4">
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5"
                >
                  {#each displayList as item}
                    <a
                      href={`/institutionalInvestors/${item?.ID}`}
                      class="w-full cursor-pointer bg-[#09090b] sm:hover:bg-[#09090b] transition-colors ease-in-out border sm:hover:border-[#000] sm:hover:shadow-[#191919] border-slate-800 shadow-md rounded-lg h-auto pb-4 pt-4 mb-7"
                    >
                      <div class="flex flex-col relative">
                        <img
                          class="absolute -mt-4 w-[500px] m-auto rounded-lg"
                          src={democraticBackground}
                        />

                        <div
                          class="flex flex-col justify-center items-center rounded-2xl"
                        >
                          <div
                            class="-mt-3 shadow-lg rounded-full border border-slate-600 w-20 h-20 relative democratic-striped bg-[#295AC7] flex items-center justify-center"
                          >
                            <img
                              style="clip-path: circle(50%);"
                              class="rounded-full w-16"
                              src={"https://i.pinimg.com/736x/3c/a9/fa/3ca9fa66cb2ad4c871c77b487a975819.jpg"}
                              loading="lazy"
                            />
                          </div>
                          <span
                            class="text-white text-2xl text-center font-medium mt-2 mb-2"
                          >
                            {item?.Name}
                          </span>
                          <span class="text-white text-sm mb-8">
                            {item?.Description}
                          </span>
                        </div>

                        <div
                          class="flex flex-row justify-between items-center w-full px-10 pb-4"
                        >
                          <label
                            class="cursor-pointer flex flex-col items-center"
                          >
                            <span class="text-white text-[1rem] font-semibold"
                              >{item?.ActiveStockCount}</span
                            >
                            <!-- <span class="text-white text-[1rem] font-semibold"
                              >{abbreviateNumber(item?.totalTrades)}</span
                            > -->
                            <span
                              class="text-slate-300 font-medium text-xs code-font"
                              >Holding Stocks
                            </span>
                          </label>

                          <div class="flex flex-col items-center">
                            <span class="text-white text-[1rem] font-semibold">
                              {item?.HoldingValue}
                            </span>
                            <span
                              class="text-slate-300 font-medium text-xs code-font"
                              >Estimated Holdings(in Cr)</span
                            >
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col items-center">
                        <span class="text-white text-[1rem] flex font-semibold">
                          {#if item?.TopPeformingC3MZG >= 0}
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
                            <span class="text-[#10DB06] text-xs"
                              >+{item?.TopPeformingC3MZG?.toFixed(2)}%</span
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
                            <span class="text-[#FF2F1F] text-xs"
                              >{item?.TopPeformingC3MZG?.toFixed(2)}%
                            </span>
                          {/if}
                        </span>
                        <span
                          class="text-slate-300 font-medium text-xs code-font"
                          >3M change in %</span
                        >
                      </div>
                    </a>
                  {/each}

                  <!--<InfiniteLoading on:infinite={infiniteHandler} />-->
                </div>
              </div>
            </main>
          </div>
        </div>
      </section>
    {:else}
      <div class="flex justify-center items-center h-80">
        <div class="relative">
          <label
            class="bg-[#09090b] rounded-xl h-14 w-14 flex justify-center items-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <span class="loading loading-spinner loading-md"></span>
          </label>
        </div>
      </div>
    {/if}
  </body>
</section>

<style>
  .democratic-striped {
    background-image: repeating-linear-gradient(
      -45deg,
      #295ac7,
      #295ac7 10px,
      #164d9d 10px,
      #164d9d 20px
    );
  }
</style>
