<script lang="ts">
  import { onMount, onDestroy, afterUpdate } from "svelte";
  import {
    searchBarData,
    userRegion,
    globalForm,
    screenWidth,
    openPriceAlert,
    currentPortfolioPrice,
    realtimePrice,
    isCrosshairMoveActive,
    currentPrice,
    priceIncrease,
    displayCompanyName,
    traded,
    stockTicker,
    assetType,
    isOpen,
  } from "$lib/store";
  import { abbreviateNumber, formatDate, formatString } from "$lib/utils";
  import toast from "svelte-french-toast";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Markethour from "$lib/components/Markethour.svelte";
  import { format } from "date-fns";
  import * as Card from "$lib/components/shadcn/card/index.ts";
  export let data: Data;
  const usRegion = ["cle1", "iad1", "pdx1", "sfo1"];
  interface BasicIndex {
    [key: string]: any;
  }
  interface Data {
    [key: string]: any;
  }
  let basicIndexdetails: BasicIndex = {};
  let priceDetails: BasicIndex = {};
  let newsDisPlayDetails: BasicIndex[] = [];
  let isScrolled: boolean;
  let userWatchList = data?.getUserWatchlist ?? [];
  let isTickerIncluded: any;
  let userPortfolio = data?.getUserPortfolio ?? [];
  let displaySection: string = "";
  let holdingShares = 0;
  let availableCash = 0;

  let fastifyURL: string;
  let wsURL;
  let apiURL;
  let apiKey = import.meta.env.VITE_STOCKNEAR_API_KEY;

  userRegion?.subscribe((value) => {
    if (usRegion?.includes(value)) {
      apiURL = import.meta.env.VITE_USEAST_API_URL;
      fastifyURL = import.meta.env.VITE_USEAST_FASTIFY_URL;
      wsURL = import.meta.env.VITE_USEAST_WS_URL;
    } else {
      apiURL = import.meta.env.VITE_EU_API_URL;
      fastifyURL = import.meta.env.VITE_EU_FASTIFY_URL;
      wsURL = import.meta.env.VITE_EU_WS_URL;
    }
  });

  function handleScroll() {
    // Check the scroll position
    isScrolled = window.scrollY > 0;
  }
  onMount(async () => {
    basicIndexdetails = { ...data?.basicIndexDetails };
    priceDetails = { ...data?.Get_Latest_Listing_Price };
    newsDisPlayDetails = data?.get_news_items_by_security?.slice(0, 6);

    window.addEventListener("scroll", handleScroll);
    return () => {
      // Remove the event listener when the component is unmounted
      window.removeEventListener("scroll", handleScroll);
    };
  });
  async function loadSearchData() {
    return;
  }
  function shareContent(url: string) {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url,
        })
        .then(() => console.log("Content shared successfully."))
        .catch((error) => console.log("Error sharing content:", error));
    } else {
      toast.error("Sharing is not supported by your device", {
        style: "background: #333; color: #fff;",
      });
    }
  }
  async function toggleUserWatchlist(watchListId: string) {
    try {
      isTickerIncluded = !isTickerIncluded;

      const watchlistIndex = userWatchList?.findIndex(
        (item: any) => item?.id === watchListId,
      );

      if (watchlistIndex !== -1) {
        const existingTickerIndex =
          userWatchList[watchlistIndex]?.ticker?.indexOf($stockTicker);

        if (existingTickerIndex !== -1) {
          // If the $stockTicker exists, remove it from the array
          userWatchList[watchlistIndex]?.ticker?.splice(existingTickerIndex, 1);
        } else {
          // If the $stockTicker doesn't exist, add it to the array
          userWatchList[watchlistIndex]?.ticker?.push($stockTicker);
        }

        // Update the userWatchList
        userWatchList = [...userWatchList];
      }

      const postData = {
        userId: data?.user?.id,
        watchListId: watchListId,
        ticker: $stockTicker,
      };

      const response = await fetch(fastifyURL + "/update-watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const output = (await response.json())?.items;

      // Update the userWatchList with the response from the server
      if (watchlistIndex !== -1) {
        userWatchList[watchlistIndex] = output;
        userWatchList = [...userWatchList];
      } else {
        userWatchList = [...userWatchList, output];
      }
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  }

  let charNumber = 12;

  $: {
    if ($screenWidth < 640) {
      charNumber = 12;
    } else {
      charNumber = 25;
    }
  }

  function scrollToItem(itemId: string) {
    const item = document.getElementById(itemId);
    if (item) {
      item.scrollIntoView({ behavior: "smooth" });
      window.scrollTo(0, 0);
    }
  }

  function changeSection(state: any, item: any) {
    scrollToItem(item);

    const sectionMap: any = {
      insider: "/insider",
      options: "/options",
      dividends: "/dividends",
      stats: "/stats",
      analyst: "/analyst",
      news: "/news",
    };

    if (state !== "overview" && sectionMap[state]) {
      displaySection = state;
      //goto(`/marketview/indices/${$stockTicker}${sectionMap[state]}`);
    } else {
      displaySection = "overview";
      //goto(`/marketview/indices/${$stockTicker}/`);
    }
  }
</script>

<body class="bg-[#09090B] pb-40">
  <div
    class="flex flex-col min-h-screen overflow-hidden m-auto w-full mt-5 supports-[overflow:clip]:overflow-clip pb-40"
  >
    <main class="grow">
      <section>
        <div class="w-full">
          <div class="sm:flex sm:justify-start w-full">
            <!--Start Mobile Navbar-->
            <div
              class="navbar w-screen sticky top-0 z-30 bg-[#09090B] sm:hidden"
            >
              <div
                class="{isScrolled
                  ? 'border-b border-slate-800 ease-in'
                  : 'ease-out'} m-auto w-full"
              >
                <div
                  class="flex-1 flex-shrink-0 flex flex-row items-center justify-between -mt-2"
                >
                  <button
                    on:click={() => goto("/")}
                    class="ml-2 cursor-pointer"
                  >
                    <svg
                      class="w-5 h-5 inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1024 1024"
                      ><g transform="rotate(-90 512 512)"
                        ><path
                          fill="white"
                          d="M104.704 685.248a64 64 0 0 0 90.496 0l316.8-316.8l316.8 316.8a64 64 0 0 0 90.496-90.496L557.248 232.704a64 64 0 0 0-90.496 0L104.704 594.752a64 64 0 0 0 0 90.496z"
                        /></g
                      ></svg
                    >
                  </button>

                  <div
                    class={!isScrolled
                      ? "hidden"
                      : "flex flex-col items-center ml-6 transition-transform ease-in"}
                  >
                    <span
                      class="text-white text-[0.70rem] font-medium text-opacity-[0.6]"
                    >
                      {$stockTicker}
                    </span>
                    <span class="text-white font-medium text-sm">
                      {#if $currentPortfolioPrice !== null && $currentPortfolioPrice !== 0}
                        {$stockTicker?.includes(".DE") ||
                        $stockTicker?.includes(".F")
                          ? `${$currentPortfolioPrice}€`
                          : ` $${$currentPortfolioPrice}`}
                      {:else}
                        {data?.Get_Latest_Listing_Price?.C}
                      {/if}
                    </span>
                  </div>
                  <!--Start Search Button-->
                  <!-- svelte-ignore missing-declaration -->
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <label
                    on:click={loadSearchData}
                    class="ml-auto mr-4"
                    for="searchBarModal"
                  >
                    <svg
                      class="w-6 h-6 inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      ><path
                        fill="none"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"
                      /></svg
                    >
                  </label>
                  <!--End Search Button-->

                  <!--Start Share Button-->
                  <!-- svelte-ignore missing-declaration -->
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <!-- svelte-ignore a11y-label-has-associated-control -->
                  <label
                    class="mr-4"
                    on:click={() =>
                      shareContent(
                        "https://stocknear.com/marketview/indices/" +
                          $stockTicker,
                      )}
                  >
                    <svg
                      class="w-6 h-6 inline-block"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      ><path
                        fill="none"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="32"
                        d="M336 192h40a40 40 0 0 1 40 40v192a40 40 0 0 1-40 40H136a40 40 0 0 1-40-40V232a40 40 0 0 1 40-40h40m160-64l-80-80l-80 80m80 193V48"
                      /></svg
                    >
                  </label>
                  <!--End Share Button-->

                  <!--Start Watchlist-->

                  {#if data?.user}
                    <div class="flex flex-col mr-4">
                      {#if userWatchList?.length !== 0}
                        <label
                          for="addWatchListModal"
                          class="cursor-pointer flex-shrink-0"
                        >
                          {#if isTickerIncluded}
                            <svg
                              class="w-6 h-6 inline-block"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              ><path
                                fill="#FBCE3C"
                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327l4.898.696c.441.062.612.636.282.95l-3.522 3.356l.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                              /></svg
                            >
                          {:else}
                            <svg
                              class="w-6 h-6 inline-block"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              ><path
                                fill="white"
                                d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575l-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957l-3.686-1.894a.503.503 0 0 0-.461 0z"
                              /></svg
                            >
                          {/if}
                        </label>
                      {:else if userWatchList?.length === 0}
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label
                          on:click={() => toggleUserWatchlist("firstList")}
                          class="cursor-pointer flex-shrink-0"
                        >
                          {#if isTickerIncluded}
                            <svg
                              class="w-6 h-6 inline-block"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              ><path
                                fill="#FBCE3C"
                                d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327l4.898.696c.441.062.612.636.282.95l-3.522 3.356l.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                              /></svg
                            >
                          {:else}
                            <svg
                              class="w-6 h-6 inline-block"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              ><path
                                fill="white"
                                d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575l-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957l-3.686-1.894a.503.503 0 0 0-.461 0z"
                              /></svg
                            >
                          {/if}
                        </label>
                      {/if}
                    </div>
                  {:else}
                    <label
                      for="userLogin"
                      class="cursor-pointer flex-shrink-0 text-white mr-4"
                    >
                      <svg
                        class="w-6 h-6 inline-block"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        ><path
                          fill="white"
                          d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575l-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957l-3.686-1.894a.503.503 0 0 0-.461 0z"
                        /></svg
                      >
                    </label>
                  {/if}
                  <!--End Watchlist-->

                  <!--Start Price Alert-->
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                  <label
                    on:click={() => ($openPriceAlert = true)}
                    for={data?.user ? "priceAlertModal" : "userLogin"}
                    class="mr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-7 h-7 inline-block mt-1"
                      viewBox="0 0 24 24"
                      ><g
                        fill="none"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        ><path d="M3 5.231L6.15 3M21 5.231L17.85 3" /><circle
                          cx="12"
                          cy="13"
                          r="8"
                        /><path d="M9.5 13h5M12 10.5v5" /></g
                      ></svg
                    >
                  </label>
                  <!--End Price Alert -->
                </div>
              </div>
            </div>
            <!--End Mobile Navbar-->
            <div class="w-full xl:w-fit max-w-3xl sm:max-w-6xl m-auto px-3">
              <div
                class="md:flex md:justify-between md:divide-x md:divide-slate-800"
              >
                <!-- Main content -->
                <div class="sm:grid sm:grid-cols-3 sm:gap-4">
                  <div class="sm:col-span-2">
                    <!-----Start-Header-CandleChart-Indicators------>

                    <div
                      class="m-auto pl-0 sm:pl-4 max-w-3xl overflow-hidden mb-5 md:mt-10"
                    >
                      <div
                        class="hidden sm:flex flex-row w-full justify-between items-center pb-10"
                      >
                        <Markethour />

                        <!--Start Watchlist-->

                        {#if data?.user}
                          <div class="flex flex-col ml-auto mr-2">
                            {#if userWatchList?.length !== 0}
                              <div
                                class="flex-shrink-0 rounded-full hover:bg-white hover:bg-opacity-[0.02] transition ease-out w-12 h-12 relative bg-[#09090B] flex items-center justify-center"
                              >
                                <label
                                  for="addWatchListModal"
                                  class="cursor-pointer flex-shrink-0"
                                >
                                  {#if isTickerIncluded}
                                    <svg
                                      class="w-7 h-7 inline-block"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 16 16"
                                      ><path
                                        fill="#FBCE3C"
                                        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327l4.898.696c.441.062.612.636.282.95l-3.522 3.356l.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                                      /></svg
                                    >
                                  {:else}
                                    <svg
                                      class="w-7 h-7 inline-block"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 16 16"
                                      ><path
                                        fill="white"
                                        d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575l-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957l-3.686-1.894a.503.503 0 0 0-.461 0z"
                                      /></svg
                                    >
                                  {/if}
                                </label>
                              </div>
                            {:else if userWatchList?.length === 0}
                              <!-- svelte-ignore a11y-click-events-have-key-events -->
                              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                              <div
                                class="flex-shrink-0 rounded-full hover:bg-white hover:bg-opacity-[0.02] transition ease-out w-12 h-12 relative bg-[#09090B] flex items-center justify-center"
                              >
                                <!-- svelte-ignore a11y-click-events-have-key-events -->
                                <!-- svelte-ignore a11y-label-has-associated-control -->
                                <label
                                  on:click={() =>
                                    toggleUserWatchlist("firstList")}
                                  class="cursor-pointer flex-shrink-0"
                                >
                                  {#if isTickerIncluded}
                                    <svg
                                      class="w-7 h-7 inline-block"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 16 16"
                                      ><path
                                        fill="#FBCE3C"
                                        d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327l4.898.696c.441.062.612.636.282.95l-3.522 3.356l.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"
                                      /></svg
                                    >
                                  {:else}
                                    <svg
                                      class="w-7 h-7 inline-block"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 16 16"
                                      ><path
                                        fill="white"
                                        d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575l-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957l-3.686-1.894a.503.503 0 0 0-.461 0z"
                                      /></svg
                                    >
                                  {/if}
                                </label>
                              </div>
                            {/if}
                          </div>
                        {:else}
                          <div
                            class="flex-shrink-0 ml-auto mr-2 rounded-full hover:bg-white hover:bg-opacity-[0.02] transition ease-out w-12 h-12 relative bg-[#09090B] flex items-center justify-center"
                          >
                            <label
                              for="userLogin"
                              class="cursor-pointer flex-shrink-0 text-white"
                            >
                              <svg
                                class="w-7 h-7 inline-block"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                ><path
                                  fill="white"
                                  d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256l4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73l3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356l-.83 4.73zm4.905-2.767l-3.686 1.894l.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575l-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957l-3.686-1.894a.503.503 0 0 0-.461 0z"
                                /></svg
                              >
                            </label>
                          </div>
                        {/if}
                        <!--End Watchlist-->

                        <!--Start Price Alert -->

                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <div
                          class="flex-shrink-0 rounded-full hover:bg-white hover:bg-opacity-[0.02] transition ease-out w-12 h-12 relative bg-[#09090B] flex items-center justify-center"
                        >
                          <!-- svelte-ignore a11y-click-events-have-key-events -->
                          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
                          <label
                            on:click={() => ($openPriceAlert = true)}
                            for={data?.user ? "priceAlertModal" : "userLogin"}
                            class="cursor-pointer flex-shrink-0 text-white"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="w-8 h-8 inline-block"
                              viewBox="0 0 24 24"
                              ><g
                                fill="none"
                                stroke="white"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1.5"
                                ><path
                                  d="M3 5.231L6.15 3M21 5.231L17.85 3"
                                /><circle cx="12" cy="13" r="8" /><path
                                  d="M9.5 13h5M12 10.5v5"
                                /></g
                              ></svg
                            >
                          </label>
                        </div>
                        <!--End Price Alert -->
                      </div>

                      <!-- svelte-ignore a11y-click-events-have-key-events -->
                      <!-- svelte-ignore a11y-label-has-associated-control -->

                      <div class="flex items-center w-full">
                        <div
                          class="flex flex-row justify-start items-center mb-5 mt-2"
                        >
                          <!--<img class="rounded-full w-10 h-10" src={logoUrl} alt="" />-->
                          <div
                            class="flex-shrink-0 rounded-full w-10 h-10 relative bg-[#101112] flex items-center justify-center border border-slate-800"
                          >
                            <img
                              style="clip-path: circle(50%);"
                              class="avatar w-6 h-6"
                              src={basicIndexdetails?.SecurityLogoUrl}
                              alt=" "
                              loading="lazy"
                            />
                          </div>

                          <div class="flex flex-col items-start ml-2 sm:ml-3">
                            <span class="text-xs text-blue-400">
                              {basicIndexdetails?.Type?.toUpperCase()}
                            </span>
                            <span
                              class="text-sm sm:text-xl font-medium text-slate-100"
                            >
                              {$displayCompanyName?.length > charNumber
                                ? $displayCompanyName?.slice(0, charNumber) +
                                  "..."
                                : $displayCompanyName}
                            </span>
                          </div>
                        </div>
                        <div class="ml-auto sm:hidden">
                          <Markethour />
                        </div>
                      </div>
                      <div
                        class="flex flex-row items-start justify-between w-full sm:pl-6 mt-4"
                      >
                        <div
                          class="flex flex-col items-start justify-start w-full"
                        >
                          <div
                            class="text-2xl md:text-3xl font-bold text-white flex flex-row items-center w-full"
                          >
                            {priceDetails?.C}
                          </div>

                          <div class="flex flex-row items-center w-full">
                            {#if priceDetails?.CZG >= 0}
                              <svg
                                class="inline-block w-5 h-5 mt-0.5 -mr-0.5"
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
                              <span
                                class="items-center justify-start text-[#10DB06] font-medium text-xs sm:text-sm"
                                >+{priceDetails?.CZG}%</span
                              >
                            {:else if priceDetails?.CZG < 0}
                              <svg
                                class="inline-block w-5 h-5 mt-0.5 -mr-0.5 rotate-180"
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
                              <span
                                class="items-center justify-start text-[#FF2F1F] font-medium text-xs sm:text-sm"
                                >{priceDetails?.CZG}%
                              </span>
                            {/if}

                            <span class="ml-3 text-white text-xs sm:text-sm"
                              >{new Date().toLocaleTimeString()}{new Date().toDateString()}</span
                            >
                          </div>
                        </div>
                        <div
                          class="flex items-end w-full"
                        >
                          <div
                            class="text-lg md:text-lg font-bold text-white flex flex-row items-end w-full"
                          >
                            {data?.DefaultExchange === 1 ? "NSE" : "BSE"}
                          </div>

                        </div>
                      </div>
                      <!-----End-Header-CandleChart-Indicators------>
                      <!--Start Ticker Section-->
                      <!--<div class="w-full max-w-3xl sm:max-w-2xl m-auto pt-2 pb-5 sm:pl-3 sticky z-20 bg-[#09090B]"  style="top: {$screenWidth < 520 && $isScrollingUp ? '4rem' : '0rem'};">-->
                      <div
                        class="-ml-2 sm:ml-4 w-screen sm:w-full {$screenWidth <
                        640
                          ? 'overflow-auto scrollbar no-scrollbar'
                          : ''} mb-2"
                      >
                        <ul
                          class="pr-4 sm:pr-0 w-screen font-medium flex flex-row items-center bg-[#09090B] overflow-x-scroll space-x-3 rtl:space-x-reverse py-2"
                        >
                          <li class="cursor-pointer flex flex-col items-center">
                            <a
                              href={`/marketview/indices/${$stockTicker}`}
                              id="item1"
                              on:click={() =>
                                changeSection("overview", "item1")}
                              class="px-3 text-sm sm:text-[0.9rem] font-medium text-gray-400 sm:hover:text-white {displaySection ===
                              'overview'
                                ? 'text-white '
                                : 'bg-[#09090B]'}"
                            >
                              Overview
                            </a>
                            <div
                              class="{displaySection === 'overview'
                                ? 'bg-[#75D377]'
                                : 'bg-[#09090B]'} mt-1 h-[3px] rounded-full w-[4.2rem]"
                            />
                          </li>
                          <li class="cursor-pointer flex flex-col items-center">
                            <a
                              href={`/marketview/indices/${$stockTicker}/stats`}
                              id="item2"
                              on:click={() => changeSection("stats", "item2")}
                              class="px-3 text-sm sm:text-[0.9rem] font-medium text-gray-400 sm:hover:text-white {displaySection ===
                              'stats'
                                ? 'text-white '
                                : 'bg-[#09090B]'}">Stats</a
                            >
                            <div
                              class="{displaySection === 'stats'
                                ? 'bg-[#75D377]'
                                : 'bg-[#09090B]'} mt-1 h-[3px] rounded-full w-[2.8rem]"
                            />
                          </li>
                          <li class="cursor-pointer flex flex-col items-center">
                            <a
                              href={`/marketview/indices/${$stockTicker}/options`}
                              id="item3"
                              on:click={() => changeSection("options", "item3")}
                              class="px-3 text-sm sm:text-[0.9rem] font-medium text-gray-400 sm:hover:text-white {displaySection ===
                              'options'
                                ? 'text-white '
                                : 'bg-[#09090B]'}"
                            >
                              Options
                            </a>
                            <div
                              class="{displaySection === 'options'
                                ? 'bg-[#75D377]'
                                : 'bg-[#09090B]'} mt-1 h-[3px] rounded-full w-[3.5rem]"
                            />
                          </li>
                          <li class="cursor-pointer flex flex-col items-center">
                            <a
                              href={`/marketview/indices/${$stockTicker}/analyst`}
                              id="item3"
                              on:click={() => changeSection("analyst", "item3")}
                              class="px-3 text-sm sm:text-[0.9rem] font-medium text-gray-400 sm:hover:text-white {displaySection ===
                              'analyst'
                                ? 'text-white '
                                : 'bg-[#09090B]'}"
                            >
                              Analyst
                            </a>
                            <div
                              class="{displaySection === 'analyst'
                                ? 'bg-[#75D377]'
                                : 'bg-[#09090B]'} mt-1 h-[3px] rounded-full w-[3.5rem]"
                            />
                          </li>
                          <li class="cursor-pointer flex flex-col items-center">
                            <a
                              href={`/marketview/indices/${$stockTicker}/insider`}
                              id="item4"
                              on:click={() => changeSection("insider", "item4")}
                              class="px-3 text-sm sm:text-[0.9rem] font-medium text-gray-400 sm:hover:text-white {displaySection ===
                              'insider'
                                ? 'text-white '
                                : 'bg-[#09090B]'}"
                            >
                              Insider
                            </a>
                            <div
                              class="{displaySection === 'insider'
                                ? 'bg-[#75D377]'
                                : 'bg-[#09090B]'} mt-1 h-[3px] rounded-full w-[3.5rem]"
                            />
                          </li>
                          <li class="cursor-pointer flex flex-col items-center">
                            <a
                              href={`/marketview/indices/${$stockTicker}/dividends`}
                              id="item5"
                              on:click={() =>
                                changeSection("dividends", "item5")}
                              class="px-3 text-sm sm:text-[0.9rem] font-medium text-gray-400 sm:hover:text-white {displaySection ===
                              'dividends'
                                ? 'text-white '
                                : 'bg-[#09090B]'}"
                            >
                              Dividends
                            </a>
                            <div
                              class="{displaySection === 'dividends'
                                ? 'bg-[#75D377]'
                                : 'bg-[#09090B]'} mt-1 h-[3px] rounded-full w-[4rem]"
                            />
                          </li>
                          <li class="cursor-pointer flex flex-col items-center">
                            <a
                              href={`/marketview/indices/${$stockTicker}/news`}
                              id="item7"
                              on:click={() => changeSection("news", "item7")}
                              class="px-3 text-sm sm:text-[0.9rem] font-medium text-gray-400 sm:hover:text-white {displaySection ===
                              'news'
                                ? 'text-white '
                                : 'bg-[#09090B]'}"
                            >
                              News
                            </a>
                            <div
                              class="{displaySection === 'news'
                                ? 'bg-[#75D377]'
                                : 'bg-[#09090B]'} mt-1 h-[3px] rounded-full w-[2.8rem]"
                            />
                          </li>
                        </ul>
                      </div>
                      <!--Start-Main Content-->
                      <slot />
                      <!--End Main Content-->
                    </div>
                  </div>
                  <div
                    class="hidden lg:block w-fit max-w-xl 2xl:w-[120px] m-auto sm:m-0 md:shrink-0 md:pt-10 pb-12 md:pb-20"
                  >
                    <div class="sm:pl-10">
                      <div class="sm:space-y-3">
                        <div
                          class="rounded-2xl shadow-lg lg:border lg:border-slate-800 bg-[#000] lg:bg-[#09090B] h-auto w-screen pt-16 sm:w-full lg:w-96 lg:pt-0"
                        >
                          <Card.Root>
                            <Card.Header>
                              <Card.Title class="text-start"
                                >Market News</Card.Title
                              >
                            </Card.Header>
                            <Card.Content class="">
                              <div class="mb-4 rounded-lg text-start">
                                {#each newsDisPlayDetails as item}
                                  <div
                                    class="flex flex-col items-start pt-4 pb-4 border-t border-gray-800"
                                  >
                                    <div
                                      class="flex flex-row items-center mb-3"
                                    >
                                      <span class="text-gray-300 text-xs">
                                        {formatDate(item?.Date)} ago
                                      </span>
                                    </div>
                                    <div
                                      class="text-sm text-blue-400 sm:hover:text-white transition duration-100"
                                    >
                                      {item?.Description}
                                    </div>
                                  </div>
                                {/each}
                              </div>
                            </Card.Content>
                          </Card.Root>
                        </div>
                      </div>

                      <!--Start Company Info -->
                      <!--End Company Info -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</body>
