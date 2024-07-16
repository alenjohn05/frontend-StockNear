<script lang="ts">
  import { afterNavigate, beforeNavigate, goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Footer from "$lib/components/Footer.svelte";
  import NotificationBell from "$lib/components/NotificationBell.svelte";
  import Searchbar from "$lib/components/Searchbar.svelte";
  import {
    cachedPosts,
    clientSideCache,
    currentPagePosition,
    etfTicker,
    loginData,
    newAvatar,
    numberOfUnreadNotification,
    screenWidth,
    showCookieConsent,
    stockTicker,
    userRegion
  } from "$lib/store";
  import { getImageURL } from "$lib/utils";
  import NProgress from "nprogress";
  import "nprogress/nprogress.css";
  import { onMount } from "svelte";
  import { Toaster } from "svelte-french-toast";
  import "../app.css";
  import { writable } from "svelte/store";

  export let data;

  let cloudFrontUrl = import.meta.env.VITE_IMAGE_URL;

  async function pushNotification() {
    Notification?.requestPermission()?.then((perm) => {
      if (perm === "granted") {
        new Notification("Octopi", {
          body: "this is more text"
        });
      }
    });
  }

  //Check Service Worker (SW)
  async function detectSWUpdate() {
    const registration = await navigator.serviceWorker.ready;

    registration.addEventListener("updatefound", () => {
      const newSW = registration.installing;
      newSW?.addEventListener("statechange", () => {
        if (newSW.state === "installed") {
          if (confirm("New Update available! Reload to update?")) {
            newSW.postMessage({ type: "SKIP_WAITING" });
            window.location.reload();
          }
        }
      });
    });
  }

  $userRegion = data?.region?.split("::")[0];

  let stockGuide = false;
  let etfGuide = false;
  let calendarGuide = false;
  let optionsGuide = false;
  let politicianGuide = false;

  let showSidebar = false;
  let collapse = false;

  const usRegion = ["cle1", "iad1", "pdx1", "sfo1"];

  let apiURL;
  let fastifyURL;

  export const sidebarVisible = writable(false);

  userRegion.subscribe((value) => {
    if (usRegion?.includes(value)) {
      apiURL = import.meta.env.VITE_USEAST_API_URL;
      fastifyURL = import.meta.env.VITE_USEAST_FASTIFY_URL;
    } else {
      apiURL = import.meta.env.VITE_EU_API_URL;
      fastifyURL = import.meta.env.VITE_EU_FASTIFY_URL;
    }
  });

  let hideHeader = false;

  NProgress.configure({ showSpinner: false });

  $: {
    const currentPath = $page.url.pathname;

    if (
      currentPath.startsWith("/etf/etf-providers") ||
      currentPath.startsWith("/etf/new-launches")
    ) {
      hideHeader = false; // Show the header for "/etf/etf-providers"
    } else if (currentPath.startsWith("/etf/")) {
      hideHeader = true; // Hide the header for other routes under "/etf/"
    } else if (currentPath.startsWith("/crypto/")) {
      hideHeader = true; // Hide the header for other routes under "/etf/"
    } else {
      // Specify conditions for other routes where you want to hide the header
      hideHeader =
        currentPath.startsWith("/community/post") ||
        currentPath.startsWith("/stocks/");
    }
  }

  $: hideFooter =
    $page.url.pathname.startsWith("/options-flow") ||
    $page.url.pathname.startsWith("/login") ||
    $page.url.pathname.startsWith("/register") ||
    $page.url.pathname.startsWith("/etf") ||
    $page.url.pathname.startsWith("/stock-splits-calendar") ||
    $page.url.pathname.startsWith("/dividends-calendar") ||
    $page.url.pathname.startsWith("/earnings-calendar") ||
    $page.url.pathname.startsWith("/market-mover") ||
    $page.url.pathname.startsWith("/market-news") ||
    $page.url.pathname.startsWith("/portfolio") ||
    $page.url.pathname.startsWith("/hedge-funds") ||
    $page.url.pathname.startsWith("/watchlist") ||
    $page.url.pathname.startsWith("/stocks") ||
    $page.url.pathname.startsWith("/community") ||
    $page.url.pathname.startsWith("/stock-screener") ||
    $page.url.pathname.startsWith("/price-alert");

  $: hideSidebar =
    $page.url.pathname.startsWith("/contact") ||
    $page.url.pathname.startsWith("/imprint") ||
    $page.url.pathname.startsWith("/privacy-policy") ||
    $page.url.pathname.startsWith("/terms-of-use") ||
    $page.url.pathname.startsWith("/about") ||
    $page.url.pathname.startsWith("/community/create-post") ||
    $page.url.pathname.startsWith("/login") ||
    $page.url.pathname.startsWith("/register");

  let hasUnreadElement = false;
  let notificationList = [];

  function handleCollapse() {
    if ($screenWidth > 640) {
      collapse = !collapse;
      stockGuide = false;
      etfGuide = false;
      optionsGuide = false;
      calendarGuide = false;
    }
  }

  function handleStockGuide() {
    stockGuide = !stockGuide;
    collapse = false;
  }

  function handleETFGuide() {
    etfGuide = !etfGuide;
    collapse = false;
  }

  function handleCalendarGuide() {
    calendarGuide = !calendarGuide;
    collapse = false;
  }

  function handleOptionsGuide() {
    optionsGuide = !optionsGuide;
    collapse = false;
  }

  function handlePoliticianGuide() {
    politicianGuide = !politicianGuide;
    collapse = false;
  }

  /** Dispatch event on click outside of node */
  function clickOutside(node) {
    const handleClick = (event) => {
      // Get the element that was clicked
      const clickedElement = event.target;

      // Check if the clicked element or its parent matches the ignoreSelector
      if (clickedElement.closest("#navbar")) {
        // If it does, do nothing (the click was inside the ignored element)
        return;
      }

      // Original condition, plus the new check for the nav element
      if (node && !node.contains(event.target) && !event.defaultPrevented) {
        node.dispatchEvent(new CustomEvent("click_outside", node));
      }
    };

    document.addEventListener("click", handleClick, true);

    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      }
    };
  }
  //Define web workers:
  let syncWorker: Worker | undefined = undefined;
  // Handling messages from the worker
  const handleMessage = (event) => {
    const output = event.data?.output;
    notificationList = output?.notificationList;
    hasUnreadElement = output?.hasUnreadElement;
    //const unreadNotificationList = output?.unreadNotificationList;
    $numberOfUnreadNotification = output?.numberOfUnreadNotification;
    //pushNotification()
  };

  /*
const handleTwitchMessage = (event) => {
    const output = event.data?.output;
   $twitchStatus = output?.twitchStatus;
};
*/

  const loadWorker = async () => {
    if ("serviceWorker" in navigator) {
      const SyncWorker = await import("$lib/workers/notificationWorker?worker");
      syncWorker = new SyncWorker.default();

      syncWorker.postMessage({
        message: { fastifyURL: fastifyURL, userId: data?.user?.id }
      });
      syncWorker.onmessage = handleMessage;
    } else {
      // Fallback logic here
      await fallbackWorker();
    }
  };

  async function fallbackWorker() {
    // Implement fallback logic here, e.g., using timers or other techniques
    console.log("Fallback worker activated");

    const postData = { userId: data?.user?.id };
    const response = await fetch(fastifyURL + "/get-notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(postData)
    });

    notificationList = (await response.json())?.items;
    hasUnreadElement = notificationList?.length !== 0 ? true : false;
    $numberOfUnreadNotification = notificationList?.length;
  }

  /*
const loadTwitchWorker = async () => {

const SyncWorker = await import('$lib/workers/twitchStatusWorker?worker');
syncWorker = new SyncWorker.default();

syncWorker.postMessage({ message: {'fastifyURL': fastifyURL }});
syncWorker.onmessage = handleTwitchMessage;

};
*/

  let Cookie;
  $showCookieConsent =
    typeof data?.cookieConsent !== "undefined" ? false : true;

  onMount(async () => {
    await loadWorker();

    //await pushNotification()

    if ($showCookieConsent === true) {
      Cookie = (await import("$lib/components/Cookie.svelte")).default;
    }
    //await loadTwitchWorker();
    sidebarVisible.set($screenWidth >= 640);
  });

  beforeNavigate(async () => {
    NProgress.start();
  });

  afterNavigate(async () => {
    NProgress.done();
  });

  //Delete cached Posts when going to other directories
  $: {
    if (
      $page.url.pathname === "/community" ||
      $page.url.pathname.startsWith("/community/post")
    ) {
    } else {
      $cachedPosts = [];
      $currentPagePosition = 0;
    }
  }

  $: {
    if (innerWidth) {
      $screenWidth = innerWidth;
      if ($screenWidth < 640) {
        $sidebarVisible = false;
      } else if (data?.user) {
        $sidebarVisible = true;
      }
    }
  }

  $: {
    if ($page.url.pathname) {
      $loginData = data?.user;
      //data.currentPath = $page.url.pathname
    }
  }

  let innerWidth;

  $: {
    if ($stockTicker && !$clientSideCache[$stockTicker]) {
      $clientSideCache[$stockTicker] = {};
    }
  }

  $: {
    if ($etfTicker && !$clientSideCache[$etfTicker]) {
      $clientSideCache[$etfTicker] = {};
    }
  }

  $: {
    if ($newAvatar?.length !== 0) {
      data.user.avatar = $newAvatar;
      $newAvatar = "";
    }
  }

  $: {
    if (innerWidth) {
      $screenWidth = innerWidth;
    }
  }

  $: {
    if ($screenWidth < 1536) {
      collapse = false;
    }
  }
</script>

<svelte:window bind:innerWidth />

<div class="app {$page?.url?.pathname === '/' ? 'bg-[#131722]' : ''}">
  <!--<ViewTransition />-->

  <!--Start Navbar-->
  {#if !data?.user}
    <header
      class="sticky {$screenWidth < 640 && hideHeader
        ? 'invisible -mt-20'
        : ''} inset-x-0 top-0 z-30 mx-auto w-full max-w-screen-md border border-[#202020] py-3 sm:py-4 shadow-lg sm:backdrop-blur-sm bg-[#131722] sm:bg-opacity-80 md:top-3 md:rounded-2xl lg:max-w-screen-lg"
    >
      <div class="px-4">
        <div class="flex items-center justify-between">
          <div class="flex shrink-0">
            <a
              href="/"
              class="flex-shrink-0 flex flex-row items-center {!data?.user
                ? 'ml-4'
                : 'ml-2'}"
            >
              <div
                class="flex justify-center items-center text-lg sm:text-xl font-medium mr-auto"
              >
                <div class="flex flex-row items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    width="30"
                    height="30"
                    class="fill-current text-white"
                  >
                    <path
                      fill="white"
                      d="M12,24C5.383,24,0,18.617,0,12S5.383,0,12,0s12,5.383,12,12-5.383,12-12,12ZM12,1C5.935,1,1,5.935,1,12s4.935,11,11,11,11-4.935,11-11S18.065,1,12,1Zm0,19c-4.411,0-8-3.589-8-8S7.589,4,12,4s8,3.589,8,8-3.589,8-8,8Zm0-15c-3.86,0-7,3.14-7,7s3.14,7,7,7,7-3.14,7-7-3.14-7-7-7Zm0,11c-2.206,0-4-1.794-4-4s1.794-4,4-4,4,1.794,4,4-1.794,4-4,4Zm0-7c-1.654,0-3,1.346-3,3s1.346,3,3,3,3-1.346,3-3-1.346-3-3-3Z"
                    />
                  </svg>
                  <span
                    class="ml-2 text-gray-200 font-semibold whitespace-nowrap"
                    >Octopi</span
                  >
                </div>
              </div>
            </a>
          </div>
          <div
            class="hidden md:flex md:items-center md:justify-center md:gap-5"
          >
            <a
              aria-current="page"
              class="inline-block rounded-lg px-2 py-1 text-[0.90rem] font-semibold text-white hover:text-yellow-200 transition-all duration-200 hover:bg-purple-600"
              href="/">Home</a
            >
            <a
              aria-current="page"
              class="inline-block rounded-lg px-2 py-1 text-[0.90rem] font-semibold text-white hover:text-yellow-200 transition-all duration-200 hover:bg-purple-600"
              href="/about">About Us</a
            >
            <a
              class="inline-block rounded-lg px-2 py-1 text-[0.90rem] font-semibold text-white hover:text-yellow-200 transition-all duration-200 hover:bg-purple-600"
              href="/pricing">Pricing</a
            >
          </div>
          <div class="flex items-center justify-end gap-3">
            <a
              class="items-center justify-center rounded-xl bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all duration-150 hover:bg-white sm:inline-flex"
              href="/register">Start Trial</a
            >
            <a
              class="inline-flex items-center justify-center rounded-xl bg-purple-600 px-3 py-2 text-sm font-semibold text-yellow-200 shadow-sm transition-all duration-150 hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              href="/login">Login</a
            >
          </div>
        </div>
      </div>
    </header>
  {:else}
    <div
      id="navbar"
      class="navbar {$screenWidth < 640 && hideHeader
        ? 'invisible -mt-20'
        : ''} border-b border-[#2a2e39] w-screen shadow-lg sticky top-0 z-40 bg-[#131722]"
    >
      <div class="w-full m-auto">
        <div class="flex flex-row items-center w-full xl:px-2">
          <div class="flex flex-row items-center cursor-pointer">
            <button
              on:click={() => {
                $sidebarVisible = !$sidebarVisible;
              }}
              class="{!data?.user
                ? 'hidden'
                : ''} cursor-pointer sm:ml-3 mr-1.5"
            >
              {#if !$sidebarVisible}
                <svg
                  class="w-8 h-8 cusor-pointer text-slate-300 fill-current inline-block transition-transform duration-300 ease-in-out"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="4" y="7" width="14" height="1" />
                  <rect x="4" y="11" width="14" height="1" />
                  <rect x="4" y="15" width="14" height="1" />
                </svg>
              {:else}
                <svg
                  class="w-8 h-8 rotate-180 transition-transform duration-300 ease-in-out cusor-pointer text-slate-300 fill-current inline-block"
                  viewBox="0 0 1024 1024"
                  xmlns="http://www.w3.org/2000/svg"
                  ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g><g id="SVGRepo_iconCarrier"
                    ><path
                      fill="#BEC8D3"
                      d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
                    ></path></g
                  ></svg
                >
              {/if}
            </button>
            <a
              href="/"
              class="flex-shrink-0 flex flex-row items-center {!data?.user
                ? 'ml-4'
                : 'ml-2'}"
            >
              <div
                class="flex justify-center items-center text-lg sm:text-xl font-medium mr-auto"
              >
                <div class="flex flex-row items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    width="30"
                    height="30"
                    class="fill-current text-white"
                  >
                    <path
                      fill="white"
                      d="M12,24C5.383,24,0,18.617,0,12S5.383,0,12,0s12,5.383,12,12-5.383,12-12,12ZM12,1C5.935,1,1,5.935,1,12s4.935,11,11,11,11-4.935,11-11S18.065,1,12,1Zm0,19c-4.411,0-8-3.589-8-8S7.589,4,12,4s8,3.589,8,8-3.589,8-8,8Zm0-15c-3.86,0-7,3.14-7,7s3.14,7,7,7,7-3.14,7-7-3.14-7-7-7Zm0,11c-2.206,0-4-1.794-4-4s1.794-4,4-4,4,1.794,4,4-1.794,4-4,4Zm0-7c-1.654,0-3,1.346-3,3s1.346,3,3,3,3-1.346,3-3-1.346-3-3-3Z"
                    />
                  </svg>
                  <span
                    class="ml-2 text-gray-200 font-semibold whitespace-nowrap"
                    >Octopi</span
                  >
                </div>
              </div>
            </a>

            <!--<Searchbar />-->
          </div>
        </div>

        <div class="flex justify-between items-center">
          <div class="mr-2">
            <Searchbar />
          </div>
          {#if !data?.user}
            <div class="mr-4">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
              <a
                href="/login"
                class="inline-flex items-center justify-center w-full sm:h-8 font-medium bg-blue-600 hover:bg-blue-500 ml-1 mr-2 rounded-full cursor-pointer"
              >
                <span
                  class="text-white text-sm sm:text-[1rem] px-1.5 py-1.5 sm:pl-2 sm:pr-2"
                >
                  Login
                </span>
              </a>
            </div>
          {:else}
            <NotificationBell {data} {hasUnreadElement} />
            <div class="dropdown dropdown-end">
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->

              <label
                for="mobileProfileData"
                class="sm:hidden btn btn-ghost btn-circle avatar"
              >
                <div class="w-9 h-9 rounded-full">
                  <img
                    alt=""
                    style="clip-path: circle(50%);"
                    class="w-8 sm:w-36 bg-slate-300 rounded-full inline-block"
                    src={data?.user?.avatar
                      ? getImageURL(
                          data?.user.collectionId,
                          data?.user.id,
                          data?.user.avatar
                        )
                      : `https://avatar.vercel.sh/${data?.user?.username}`}
                  />
                </div>
              </label>

              <button
                tabindex="0"
                class="cursor-pointer hidden sm:block w-9 h-9 rounded-full avatar mr-4"
              >
                <!--Remove mr-4 when you add Post button again -->
                <img
                  alt=""
                  style="clip-path: circle(50%);"
                  class="flex-shrink-0 bg-slate-300 rounded-full inline-block"
                  src={data?.user?.avatar
                    ? getImageURL(
                        data?.user.collectionId,
                        data?.user.id,
                        data?.user.avatar
                      )
                    : `https://avatar.vercel.sh/${data?.user?.username}`}
                />
              </button>

              <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
              <!-- svelte-ignore a11y-positive-tabindex -->
              <ul
                tabindex="1"
                class="border border-gray-700 mt-2 p-2 menu dropdown-content text-white bg-[#131722] border border-slate-800rounded-md w-52"
              >
                <li class="mb-3 hover:bg-[#2B3139] rounded-lg">
                  <a href="/community/profile">
                    <div
                      class="avatar flex-shrink-0 w-8 h-8 rounded-full -ml-0.5"
                    >
                      <svg
                        style="clip-path: circle(50%);"
                        class="flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        ><g fill="white"
                          ><path
                            d="M32 20a8 8 0 1 1-16 0a8 8 0 0 1 16 0"
                          /><path
                            fill-rule="evenodd"
                            d="M23.184 43.984C12.517 43.556 4 34.772 4 24C4 12.954 12.954 4 24 4s20 8.954 20 20s-8.954 20-20 20h-.274q-.272 0-.542-.016M11.166 36.62a3.028 3.028 0 0 1 2.523-4.005c7.796-.863 12.874-.785 20.632.018a2.99 2.99 0 0 1 2.498 4.002A17.94 17.94 0 0 0 42 24c0-9.941-8.059-18-18-18S6 14.059 6 24c0 4.916 1.971 9.373 5.166 12.621"
                            clip-rule="evenodd"
                          /></g
                        ></svg
                      >
                    </div>
                    <div class=" flex flex-row justify-start items-center">
                      <span class="text-white">Profile</span>
                    </div>
                  </a>
                  <!--Set to /profile/ to make it default active -->
                </li>
                <li class="mb-3 hover:bg-[#2B3139] rounded-lg">
                  <a href="/watchlist">
                    <svg
                      class="shrink-0 h-6 w-6"
                      fill="white"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                      stroke="#1A1A27"
                      ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g><g id="SVGRepo_iconCarrier">
                        <title>star-solid</title>
                        <g id="Layer_2" data-name="Layer 2">
                          <g id="invisible_box" data-name="invisible box">
                            <rect width="48" height="48" fill="none"></rect>
                          </g>
                          <g id="icons_Q2" data-name="icons Q2">
                            <path
                              d="M24,3a2.1,2.1,0,0,0-1.8,1.1L16.5,15.7,3.7,17.5A2.1,2.1,0,0,0,2.6,21l9.2,8.9L9.7,42.7A2,2,0,0,0,11.6,45l1-.2,11.4-6,11.4,6,1,.2a2,2,0,0,0,1.9-2.3L36.2,29.9,45.4,21a2.1,2.1,0,0,0-1.1-3.5L31.5,15.7,25.8,4.1A2.1,2.1,0,0,0,24,3Z"
                            ></path>
                          </g>
                        </g>
                      </g></svg
                    >
                    <span class="ml-1 text-white font-medium">Watchlist</span>
                  </a>
                  <!--Set to /profile/ to make it default active -->
                </li>

                <li class="mb-3 hover:bg-[#2B3139] rounded-lg">
                  <a href="/price-alert">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-7 h-7 inline-block"
                      viewBox="0 0 24 24"
                      ><g
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        ><path d="M0 0h24v24H0z" /><path
                          fill="white"
                          d="M16 6.072a8 8 0 1 1-11.995 7.213L4 13l.005-.285A8 8 0 0 1 16 6.072M12 10a1 1 0 0 0-1 1v1h-1l-.117.007A1 1 0 0 0 10 14h1v1l.007.117A1 1 0 0 0 13 15v-1h1l.117-.007A1 1 0 0 0 14 12h-1v-1l-.007-.117A1 1 0 0 0 12 10"
                        /><path
                          fill="white"
                          d="M6.412 3.191A1 1 0 0 1 7.685 4.73l-.097.08l-2.75 2a1 1 0 0 1-1.273-1.54l.097-.08zm9.779.221a1 1 0 0 1 1.291-.288l.106.067l2.75 2a1 1 0 0 1-1.07 1.685l-.106-.067l-2.75-2a1 1 0 0 1-.22-1.397z"
                        /></g
                      ></svg
                    >
                    <span class="ml-1 text-white font-medium">Price Alert</span>
                  </a>
                </li>

                <li class="mb-3 hover:bg-[#2B3139] rounded-lg">
                  <a href="/portfolio">
                    <svg
                      class="shrink-0 h-6 w-6"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></g><g id="SVGRepo_iconCarrier">
                        <path
                          d="M0 7.49996C0 3.52583 3.09098 0.27365 7 0.0163574V4.0354C5.30385 4.27801 4 5.73672 4 7.49996C4 9.43295 5.567 11 7.5 11C8.28618 11 9.01181 10.7407 9.5961 10.3031L12.438 13.1451C11.1188 14.3 9.39113 15 7.5 15C3.35786 15 0 11.6421 0 7.49996Z"
                          fill="#fff"
                        ></path>
                        <path
                          d="M13.1451 12.438C14.3001 11.1187 15 9.39107 15 7.49996C15 6.46644 14.7909 5.48175 14.4128 4.58586L10.7552 6.21147C10.9132 6.61024 11 7.04496 11 7.49996C11 8.28611 10.7408 9.01174 10.3032 9.59602L13.1451 12.438Z"
                          fill="#fff"
                        ></path>
                        <path
                          d="M8 4.0354V0.0163574C10.5416 0.183645 12.7373 1.61699 13.9626 3.69166L10.2541 5.33986C9.71063 4.64791 8.91203 4.16585 8 4.0354Z"
                          fill="#fff"
                        ></path>
                      </g></svg
                    >
                    <span class="ml-1 text-white font-medium">Portfolio</span>
                  </a>
                </li>

                <hr class="border-slate-700" />

                <li class="mt-3 hover:bg-[#2B3139] rounded-lg">
                  <form action="/logout" method="POST">
                    <button type="submit" class="w-full text-start">
                      <svg
                        class="w-6 h-6 inline-block mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 32 32"
                        ><path
                          fill="white"
                          d="M6 30h12a2.002 2.002 0 0 0 2-2v-3h-2v3H6V4h12v3h2V4a2.002 2.002 0 0 0-2-2H6a2.002 2.002 0 0 0-2 2v24a2.002 2.002 0 0 0 2 2Z"
                        /><path
                          fill="white"
                          d="M20.586 20.586L24.172 17H10v-2h14.172l-3.586-3.586L22 10l6 6l-6 6l-1.414-1.414z"
                        /></svg
                      >
                      <span class="text-start text-white">Logout</span>
                    </button>
                  </form>
                </li>
              </ul>
            </div>

            <div class="m-auto ml-2 mr-4 hidden">
              <button
                on:click={() => goto("/community/create-post")}
                class="shadow-lg inline-flex items-center justify-center w-full sm:h-10 font-medium bg-purple-600 duration-150 ml-1 mr-0 sm:mr-2 rounded-full cursor-pointer"
              >
                <svg
                  class="ml-4 w-4 h-4 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  ><path
                    fill="white"
                    d="m362.7 19.3l-48.4 48.4l130 130l48.4-48.4c25-25 25-65.5 0-90.5l-39.4-39.5c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2c-2.5 8.5-.2 17.6 6 23.8s15.3 8.5 23.7 6.1L151 475.7c14.1-4.2 27-11.8 37.4-22.2l233.3-233.2l-130-130z"
                  /></svg
                >
                <span class="text-white text-md pl-2 pr-4"> Post </span>
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  {/if}
  <!--End Navbar-->

  <div class="w-full {!data?.user ? 'hidden' : ''}">
    <aside
      class={`fixed top-0 left-0 xl:left-auto w-56 z-30 min-h-screen pt-12 sm:pt-16 border transition-transform bg-[#131722] border-r border-slate-800 border-[#2a2e39] ${
        $sidebarVisible ? "translate-x-0" : "-translate-x-full"
      } ${collapse ? "sm:w-20" : "sm:w-56"}`}
    >
      <div class="pb-4 overflow-y-auto scroller bg-[#131722] h-screen">
        <ul class="mt-1 bg-[#131722] menu pt-5 pb-20">
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <li
            on:click={() => (showSidebar = !showSidebar)}
            class="px-1 rounded-sm mb-2 last:mb-0"
          >
            <a
              href="/"
              for="sidebar"
              class="block text-slate-200 hover:text-white sm:hover:bg-purple-700 truncate transition duration-150 {$page
                .url.pathname === '/'
                ? 'text-white bg-[#131722]  border border-slate-800rounded-md '
                : ''}"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    class="w-5 h-5"
                    fill="#CCCCCC"
                    ><path
                      d="M14.5,18h-5c-.827,0-1.5-.673-1.5-1.5v-5c0-.827,.673-1.5,1.5-1.5h5c.827,0,1.5,.673,1.5,1.5v5c0,.827-.673,1.5-1.5,1.5Zm-5-7c-.275,0-.5,.225-.5,.5v5c0,.275,.225,.5,.5,.5h5c.275,0,.5-.225,.5-.5v-5c0-.275-.225-.5-.5-.5h-5Zm10,13H4.5c-2.481,0-4.5-2.019-4.5-4.5V9.561c0-1.497,.741-2.892,1.983-3.729L9.483,.771c1.527-1.033,3.505-1.033,5.034,0l7.499,5.061c1.242,.838,1.983,2.232,1.983,3.729v9.939c0,2.481-2.019,4.5-4.5,4.5ZM12,.996c-.682,0-1.363,.201-1.957,.603L2.542,6.659c-.966,.652-1.542,1.736-1.542,2.901v9.939c0,1.93,1.57,3.5,3.5,3.5h15c1.93,0,3.5-1.57,3.5-3.5V9.561c0-1.165-.576-2.249-1.542-2.901L13.958,1.599c-.595-.401-1.276-.603-1.958-.603Z"
                      fill="#CCCCCC"
                    /></svg
                  >
                  <span
                    class="2xl:{collapse
                      ? 'hidden'
                      : ''} text-md font-medium ml-3 duration-200"
                  >
                    Home
                  </span>
                </div>
              </div>
            </a>
          </li>

          <!-- Stock Guide-->
          <li class="px-1 rounded-sm mb-2 last:mb-0">
            <summary on:click={handleStockGuide}>
              <div class="flex flex-row items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  class="w-5 h-5"
                  fill="#CCCCCC"
                >
                  <path
                    d="m23.626,19.581l-2.395-2.582-.732.68,2.153,2.322h-2.652c-1.246,0-2.354-2.229-3.331-4.195-1.015-2.042-1.891-3.805-3.169-3.805s-2.154,1.763-3.169,3.805c-.978,1.966-2.085,4.195-3.331,4.195h-1.608c.801-1.228,1.523-3.554,2.488-6.812.966-3.26,2.425-8.188,3.62-8.188.846,0,1.824,2.47,2.666,5.069.44.085.839.252,1.202.485-1.285-4.123-2.331-6.554-3.868-6.554-1.811,0-2.938,3.364-4.579,8.904-.786,2.654-2.102,7.096-2.921,7.096V1.348l2.321,2.154.68-.733L4.434.387c-.249-.25-.581-.387-.934-.387h0c-.353,0-.684.138-.918.374L0,2.768l.68.733L3,1.349v19.651h19.652l-2.153,2.322.732.68,2.382-2.568c.249-.25.387-.581.387-.934s-.138-.684-.374-.919Zm-12.399-3.331c.72-1.448,1.615-3.25,2.273-3.25s1.554,1.802,2.273,3.25c.698,1.406,1.414,2.831,2.278,3.75h-9.103c.864-.919,1.58-2.344,2.278-3.75Z"
                    fill="#CCCCCC"
                  />
                </svg>
                <label
                  class="cursor-pointer 2xl:{collapse
                    ? 'hidden'
                    : ''} text-md text-white font-medium ml-3 duration-200"
                >
                  Stocks
                </label>
                <div
                  class="2xl:{collapse
                    ? 'hidden'
                    : ''} border-r border-slate-600 h-6 ml-3 mr-3"
                />
                <svg
                  class="2xl:{collapse ? 'hidden' : ''} w-2.5 {stockGuide
                    ? 'rotate-180'
                    : 'rotate-90'}"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="white"
                    d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"
                  /></svg
                >
              </div>
            </summary>
            {#if stockGuide}
              <ul class="mt-2">
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/analysts'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/analysts"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Top Analysts
                    </span>
                  </a>
                </li>
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/analysts/top-stocks'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/analysts/top-stocks"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Top Analyst Stocks
                    </span>
                  </a>
                </li>

                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/most-shorted-stocks'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/most-shorted-stocks"}
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Shorted Stocks
                    </span>
                  </a>
                </li>

                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/most-retail-volume'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/most-retail-volume"}
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Retail Trader Tracker
                    </span>
                  </a>
                </li>

                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/stock-screener'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/stock-screener"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Stock Screener
                    </span>
                  </a>
                </li>

                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/market-mover'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/market-mover"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Market Mover
                    </span>
                  </a>
                </li>

                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/heatmaps'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <label
                    for="sidebar"
                    on:click={() => goto("/heatmaps")}
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Heatmaps
                    </span>
                  </label>
                </li>

                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/list'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/list"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Stock Lists
                    </span>
                  </a>
                </li>
              </ul>
            {/if}
          </li>

          <!-- ETF Guide-->
          <li class="px-1 rounded-sm mb-2 last:mb-0">
            <summary on:click={handleETFGuide}>
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  class="w-5 h-5"
                  fill="#CCCCCC"
                >
                  <path
                    d="M22.19,17.105l-4.106-1.173c-.638-.182-1.084-.773-1.084-1.438,0-.824,.671-1.495,1.495-1.495h3.01c.824,0,1.495,.671,1.495,1.495,0,.276,.224,.5,.5,.5s.5-.224,.5-.5c0-1.376-1.119-2.495-2.495-2.495h-1.005v-2h1.468c.612,0,1.186-.272,1.574-.748,.387-.474,.539-1.088,.417-1.686C23.187,3.768,20.232,.813,16.433,.041c-.6-.125-1.213,.03-1.686,.417-.475,.388-.748,.962-.748,1.574v6.451c0,.836,.681,1.517,1.517,1.517h3.983v2h-1.005c-1.376,0-2.495,1.119-2.495,2.495,0,1.108,.744,2.095,1.81,2.399l4.106,1.173c.638,.182,1.084,.773,1.084,1.438,0,.824-.671,1.495-1.495,1.495h-3.01c-.824,0-1.495-.671-1.495-1.495,0-.276-.224-.5-.5-.5s-.5,.224-.5,.5c0,1.376,1.119,2.495,2.495,2.495h1.005v1.5c0,.276,.224,.5,.5,.5s.5-.224,.5-.5v-1.5h1.005c1.376,0,2.495-1.119,2.495-2.495,0-1.108-.744-2.095-1.81-2.399Zm-6.673-8.105c-.285,0-.517-.232-.517-.517V2.032c0-.311,.139-.602,.38-.799,.186-.152,.415-.233,.649-.233,.068,0,.136,.007,.204,.021,3.405,.693,6.053,3.341,6.746,6.746,.061,.302-.016,.613-.212,.854-.198,.242-.489,.38-.799,.38h-6.451Zm-.546,13.736c.092,.26-.044,.546-.305,.638-1.176,.416-2.407,.626-3.662,.626-.1,0-.199-.001-.299-.004C5.177,23.852,.492,19.431,.038,13.932-.425,8.307,3.387,3.263,8.905,2.2c.242-.048,1.498-.245,2.366,.472,.504,.416,.759,1.031,.759,1.829,0,1.491-.017,5.205-.026,7,0,.133,.051,.259,.145,.354s.22,.147,.355,.147h.995c.276,0,.5,.224,.5,.5s-.224,.5-.5,.5h-.995c-.402,0-.78-.157-1.064-.441-.283-.285-.438-.662-.436-1.064,.009-1.794,.026-5.504,.026-6.995,0-.492-.129-.837-.396-1.058-.434-.357-1.171-.331-1.54-.261C4.078,4.148,.613,8.735,1.035,13.85c.412,4.998,4.671,9.016,9.697,9.146,1.233,.034,2.447-.158,3.602-.565,.261-.092,.546,.044,.638,.305Z"
                    fill="#CCCCCC"
                  />
                </svg>
                <span
                  class="2xl:{collapse
                    ? 'hidden'
                    : ''} text-md text-white font-medium ml-3 duration-200"
                >
                  ETFs
                </span>
                <div
                  class="2xl:{collapse
                    ? 'hidden'
                    : ''} border-r border-slate-600 h-6 ml-3 mr-3"
                />
                <svg
                  class="2xl:{collapse ? 'hidden' : ''} w-2.5 {etfGuide
                    ? 'rotate-180'
                    : 'rotate-90'}"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="white"
                    d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"
                  /></svg
                >
              </div>
            </summary>
            {#if etfGuide}
              <ul class="mt-2">
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/stock-screener'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/etf/new-launches"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      New Launches
                    </span>
                  </a>
                </li>

                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/dividends-calendar'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/etf/etf-providers"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      ETF Providers
                    </span>
                  </a>
                </li>
              </ul>
            {/if}
          </li>

          <!-- Options Guide-->
          <li class="px-1 rounded-sm mb-2 last:mb-0">
            <summary on:click={handleCalendarGuide}>
              <div class="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Layer_1"
                  data-name="Layer 1"
                  viewBox="0 0 24 24"
                  class="w-5 h-5"
                  fill="#CCCCCC"
                >
                  <path
                    d="M19.5,2h-1.5V.5c0-.276-.224-.5-.5-.5s-.5,.224-.5,.5v1.5H7V.5c0-.276-.224-.5-.5-.5s-.5,.224-.5,.5v1.5h-1.5C2.019,2,0,4.019,0,6.5v13c0,2.481,2.019,4.5,4.5,4.5h15c2.481,0,4.5-2.019,4.5-4.5V6.5c0-2.481-2.019-4.5-4.5-4.5ZM4.5,3h15c1.93,0,3.5,1.57,3.5,3.5v1.5H1v-1.5c0-1.93,1.57-3.5,3.5-3.5Zm15,20H4.5c-1.93,0-3.5-1.57-3.5-3.5V9H23v10.5c0,1.93-1.57,3.5-3.5,3.5Zm-.5-9.5c0,.276-.224,.5-.5,.5H5.5c-.276,0-.5-.224-.5-.5s.224-.5,.5-.5h13c.276,0,.5,.224,.5,.5Zm-7,5c0,.276-.224,.5-.5,.5H5.5c-.276,0-.5-.224-.5-.5s.224-.5,.5-.5h6c.276,0,.5,.224,.5,.5Z"
                    fill="#CCCCCC"
                  />
                </svg>
                <span
                  class="2xl:{collapse
                    ? 'hidden'
                    : ''} text-md text-white font-medium ml-3 duration-200"
                >
                  Calendar
                </span>
                <div
                  class="2xl:{collapse
                    ? 'hidden'
                    : ''} border-r border-slate-600 h-6 ml-3 mr-3"
                />
                <svg
                  class="2xl:{collapse ? 'hidden' : ''} w-2.5 {calendarGuide
                    ? 'rotate-180'
                    : 'rotate-90'}"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="white"
                    d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"
                  /></svg
                >
              </div>
            </summary>
            {#if calendarGuide}
              <ul class="mt-2">
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/dividends-calendar'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/dividends-calendar"}
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Dividends Calendar
                    </span>
                  </a>
                </li>
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/earnings-calendar'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/earnings-calendar"}
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Earnings Calendar
                    </span>
                  </a>
                </li>
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page.url.pathname?.includes(
                    '/ipos'
                  )
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/ipos/2024"}
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      IPO Calendar
                    </span>
                  </a>
                </li>
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page.url.pathname?.includes(
                    '/fda-calendar'
                  )
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/fda-calendar"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      FDA Calendar
                    </span>
                  </a>
                </li>
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/economic-calendar'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/economic-calendar"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Economic Calendar
                    </span>
                  </a>
                </li>

                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/stock-splits-calendar'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/stock-splits-calendar"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Stock Splits Calendar
                    </span>
                  </a>
                </li>
              </ul>
            {/if}
          </li>

          <li class="px-1 rounded-sm mb-2 last:mb-0">
            <summary on:click={handleOptionsGuide}>
              <div class="flex items-center">
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#CCCCCC"
                  ><path
                    d="m13.904,1.241C13.559.47,12.846.01,12,.01s-1.559.461-1.906,1.235L0,24h24L13.904,1.241Zm5.453,14.759H4.642l2.662-6h9.392l2.662,6ZM11.007,1.652c.183-.408.545-.642.993-.642s.81.233.991.638l3.261,7.352H7.748l3.26-7.348Zm-6.809,15.348h15.603l2.662,6H1.537l2.662-6Z"
                  /></svg
                >
                <span
                  class="2xl:{collapse
                    ? 'hidden'
                    : ''} text-md text-white font-medium ml-3 duration-200"
                >
                  Options
                </span>
                <div
                  class="2xl:{collapse
                    ? 'hidden'
                    : ''} border-r border-slate-600 h-6 ml-3 mr-3"
                />
                <svg
                  class="2xl:{collapse ? 'hidden' : ''} w-2.5 {optionsGuide
                    ? 'rotate-180'
                    : 'rotate-90'}"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="white"
                    d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"
                  /></svg
                >
              </div>
            </summary>
            {#if optionsGuide}
              <ul class="mt-2">
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/options-flow'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/options-flow"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Flow Data
                    </span>
                  </a>
                </li>
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/options-zero-dte'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/options-zero-dte"}
                    for="sidebar"
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      0DTE Flow
                    </span>
                  </a>
                </li>
              </ul>
            {/if}
          </li>

          <li class="px-1 rounded-sm mb-2 last:mb-0">
            <summary on:click={handlePoliticianGuide}>
              <div class="flex items-center">
                <svg
                  class="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="#CCCCCC"
                    fill-rule="evenodd"
                    d="m24,20.605c0,1.321-1.074,2.395-2.395,2.395h-.605v.5c0,.276-.224.5-.5.5s-.5-.224-.5-.5v-.5h-.5c-1.379,0-2.5-1.122-2.5-2.5,0-.276.224-.5.5-.5s.5.224.5.5c0,.827.673,1.5,1.5,1.5h2.105c.769,0,1.395-.626,1.395-1.395,0-.685-.49-1.263-1.165-1.375l-2.834-.473c-1.159-.193-2.001-1.186-2.001-2.362,0-1.321,1.074-2.395,2.395-2.395h.605v-.5c0-.276.224-.5.5-.5s.5.224.5.5v.5h.5c1.379,0,2.5,1.122,2.5,2.5,0,.276-.224.5-.5.5s-.5-.224-.5-.5c0-.827-.673-1.5-1.5-1.5h-2.105c-.769,0-1.395.626-1.395,1.395,0,.685.49,1.263,1.165,1.375l2.834.473c1.159.193,2.001,1.186,2.001,2.362Zm-6-14.605c0,3.309-2.691,6-6,6s-6-2.691-6-6S8.691,0,12,0s6,2.691,6,6Zm-1,0c0-2.757-2.243-5-5-5s-5,2.243-5,5,2.243,5,5,5,5-2.243,5-5Zm-2.354,8.396c-.854-.262-1.745-.396-2.646-.396-4.963,0-9,4.038-9,9v.5c0,.276.224.5.5.5s.5-.224.5-.5v-.5c0-4.411,3.589-8,8-8,.802,0,1.594.118,2.354.352.262.081.543-.067.624-.331.081-.264-.066-.544-.331-.625Z"
                    clip-rule="evenodd"
                  /></svg
                >
                <span
                  class="2xl:{collapse
                    ? 'hidden'
                    : ''} text-md text-white font-medium ml-3 duration-200"
                >
                  Investors
                </span>
                <div
                  class="2xl:{collapse
                    ? 'hidden'
                    : ''} border-r border-slate-600 h-6 ml-3 mr-3"
                />
                <svg
                  class="2xl:{collapse ? 'hidden' : ''} w-2.5 {politicianGuide
                    ? 'rotate-180'
                    : 'rotate-90'}"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  ><path
                    fill="white"
                    d="M3 19h18a1.002 1.002 0 0 0 .823-1.569l-9-13c-.373-.539-1.271-.539-1.645 0l-9 13A.999.999 0 0 0 3 19z"
                  /></svg
                >
              </div>
            </summary>
            {#if politicianGuide}
              <ul class="mt-2">
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/options-zero-dte'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/politicians/flow-data"}
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Flow Data
                    </span>
                  </a>
                </li>
                <li
                  on:click={() => (showSidebar = !showSidebar)}
                  class="mb-1 last:mb-0 sm:hover:bg-purple-700 rounded-md {$page
                    .url.pathname === '/options-flow'
                    ? 'text-white bg-purple-700 rounded-md '
                    : ''}"
                >
                  <a
                    href={"/politicians"}
                    class="block text-slate-400 hover:text-slate-200 transition duration-150 truncate"
                  >
                    <span class="text-sm font-medium text-white">
                      Politicians
                    </span>
                  </a>
                </li>
              </ul>
            {/if}
          </li>

          <li
            on:click={() => (showSidebar = !showSidebar)}
            class="px-1 rounded-sm mb-2 last:mb-0"
          >
            <a
              href="/dark-pool-flow"
              class="block text-slate-200 hover:text-white sm:hover:bg-purple-700 truncate transition duration-150 {$page?.url?.pathname?.startsWith(
                '/dark-pool-flow'
              )
                ? 'text-white bg-purple-700 rounded-md '
                : ''}"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5"
                    fill="#CCCCCC"
                    xmlns="http://www.w3.org/2000/svg"
                    id="Layer_1"
                    data-name="Layer 1"
                    viewBox="0 0 24 24"
                    ><path
                      d="m11.306,11.407l2.308.972.922,2.306c.076.19.26.314.464.314s.388-.125.464-.314l.92-2.301,2.301-.92c.19-.076.314-.26.314-.464s-.125-.388-.314-.464l-2.301-.92-.92-2.301c-.152-.38-.776-.38-.929,0l-.918,2.296-2.294.868c-.191.073-.319.254-.323.458s.117.391.306.47Zm2.871-.939c.131-.05.235-.152.288-.282l.536-1.339.536,1.339c.051.127.151.228.279.279l1.339.536-1.339.536c-.127.051-.228.151-.279.279l-.536,1.339-.536-1.339c-.05-.124-.147-.223-.27-.275l-1.348-.568,1.33-.503ZM5.37,6.445l1.716.461.429,1.715c.056.223.255.379.485.379s.429-.156.485-.379l.427-1.709,1.709-.427c.223-.056.379-.255.379-.485s-.156-.429-.379-.485l-1.709-.427-.427-1.709c-.111-.445-.858-.445-.97,0l-.426,1.703-1.702.393c-.223.052-.383.249-.387.479-.004.229.148.432.37.492ZM17.5,0H6.5C4.019,0,2,2.019,2,4.5v16c0,1.93,1.57,3.5,3.5,3.5h12c2.481,0,4.5-2.019,4.5-4.5V4.5c0-2.481-2.019-4.5-4.5-4.5ZM3,4.5c0-1.93,1.57-3.5,3.5-3.5h11c1.93,0,3.5,1.57,3.5,3.5v12.5H5.5c-.978,0-1.864.404-2.5,1.053V4.5Zm14.5,18.5H5.5c-1.378,0-2.5-1.122-2.5-2.5s1.122-2.5,2.5-2.5h15.5v1.5c0,1.93-1.57,3.5-3.5,3.5Z"
                    /></svg
                  >

                  <span
                    class="2xl:{collapse
                      ? 'hidden'
                      : ''} text-md font-medium ml-3 duration-200"
                  >
                    Dark Pool
                  </span>
                </div>
              </div>
            </a>
          </li>

          <li
            on:click={() => (showSidebar = !showSidebar)}
            class="px-1 rounded-sm mb-2 last:mb-0"
          >
            <a
              href={"/hedge-funds"}
              class="block text-slate-200 hover:text-white sm:hover:bg-purple-700 truncate transition duration-150 {$page?.url?.pathname?.startsWith(
                '/hedge-funds'
              )
                ? 'text-white bg-purple-700 rounded-md '
                : ''}"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="#CCCCCC"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                      opacity="0.97"
                      d="m13.5,13c.276,0,.5-.224.5-.5s-.224-.5-.5-.5H1.731c-.403,0-.731-.328-.731-.731,0-.281.157-.533.41-.657l8.066-3.949c.161-.086.342-.131.524-.131s.363.045.54.14l7.24,3.544c.07.034.146.051.22.051.185,0,.362-.103.449-.28.121-.248.019-.548-.229-.669l-7.224-3.535c-.156-.084-.324-.146-.496-.188v-.384l3.435-1.72c.354-.243.565-.656.565-1.104s-.211-.86-.565-1.104c-.025-.018-2.328-1.051-2.328-1.051-.157-.07-.317-.13-.478-.178-.38-.116-.782-.044-1.105.196-.328.243-.523.631-.523,1.037v4.305c-.169.041-.332.101-.479.18L.97,9.713c-.598.294-.97.89-.97,1.556,0,.955.777,1.731,1.731,1.731h.269v8.051c-1.14.232-2,1.242-2,2.449,0,.276.224.5.5.5s.5-.224.5-.5c0-.827.673-1.5,1.5-1.5h8c.276,0,.5-.224.5-.5s-.224-.5-.5-.5h-1.5v-8h2v4.5c0,.276.224.5.5.5s.5-.224.5-.5v-4.5h1.5ZM10.5,1.287c0-.132.083-.207.119-.234.029-.021.083-.052.151-.052.022,0,.046.003.071.011.12.035,2.553,1.115,2.553,1.115.066.06.105.154.105.259,0,.118-.049.223-.072.244l-2.928,1.462V1.287Zm-5.5,11.713v8h-2v-8h2Zm3,8h-2v-8h2v8Zm11.686-5.829c.399-.36.843-.825,1.152-1.352.217-.371.218-.817,0-1.195-.221-.385-.632-.624-1.072-.624h-2.533c-.44,0-.852.239-1.072.624-.217.378-.216.824,0,1.195.309.526.753.992,1.152,1.352-2.316.682-4.314,3.232-4.314,5.829,0,1.647,1.346,2.988,3,2.988h5c1.654,0,3-1.341,3-2.988,0-2.597-1.998-5.147-4.314-5.829Zm-2.661-1.857c-.045-.076-.022-.146.004-.192.016-.028.079-.121.204-.121h2.533c.125,0,.188.093.204.121.026.046.049.116.004.192-.39.665-1.088,1.252-1.475,1.545-.387-.293-1.085-.88-1.475-1.545Zm3.975,9.675h-5c-1.103,0-2-.892-2-1.988,0-2.482,2.271-5.012,4.5-5.012s4.5,2.529,4.5,5.012c0,1.097-.897,1.988-2,1.988Z"
                      fill="currentColor"
                    ></path></svg
                  >
                  <span
                    class="2xl:{collapse
                      ? 'hidden'
                      : ''} text-md font-medium ml-3 duration-200"
                  >
                    Mutual Funds
                  </span>
                </div>
              </div>
            </a>
          </li>

          <li
            on:click={() => (showSidebar = !showSidebar)}
            class="px-1 rounded-sm mb-2 last:mb-0"
          >
            <a
              href={"/major-news"}
              class="block text-slate-200 hover:text-white sm:hover:bg-purple-700 truncate transition duration-150 {[
                '/market-news',
                '/market-news/crypto',
                '/market-news/general'
              ]?.includes($page.url.pathname)
                ? 'text-white bg-purple-700 rounded-md '
                : ''}"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    ><path
                      fill="#CCCCCC"
                      fill-rule="evenodd"
                      d="m19.5,0h-10c-2.481,0-4.5,2.019-4.5,4.5v2.5h-1c-2.206,0-4,1.794-4,4v10c0,1.654,1.346,3,3,3h16.5c2.481,0,4.5-2.019,4.5-4.5V4.5c0-2.481-2.019-4.5-4.5-4.5ZM5,21c0,1.103-.897,2-2,2s-2-.897-2-2v-10c0-1.654,1.346-3,3-3h1v13Zm18-1.5c0,1.93-1.57,3.5-3.5,3.5H5.234c.476-.531.766-1.232.766-2V4.5c0-1.93,1.57-3.5,3.5-3.5h10c1.93,0,3.5,1.57,3.5,3.5v15Zm-2-12c0,.276-.224.5-.5.5h-5c-.276,0-.5-.224-.5-.5s.224-.5.5-.5h5c.276,0,.5.224.5.5Zm0,4c0,.276-.224.5-.5.5h-12c-.276,0-.5-.224-.5-.5s.224-.5.5-.5h12c.276,0,.5.224.5.5Zm0,4c0,.276-.224.5-.5.5h-12c-.276,0-.5-.224-.5-.5s.224-.5.5-.5h12c.276,0,.5.224.5.5Zm0,4c0,.276-.224.5-.5.5h-12c-.276,0-.5-.224-.5-.5s.224-.5.5-.5h12c.276,0,.5.224.5.5Zm-11.5-11.5h2c.827,0,1.5-.673,1.5-1.5v-2c0-.827-.673-1.5-1.5-1.5h-2c-.827,0-1.5.673-1.5,1.5v2c0,.827.673,1.5,1.5,1.5Zm-.5-3.5c0-.276.224-.5.5-.5h2c.276,0,.5.224.5.5v2c0,.276-.224.5-.5.5h-2c-.276,0-.5-.224-.5-.5v-2Z"
                      clip-rule="evenodd"
                    /></svg
                  >
                  <span
                    class="2xl:{collapse
                      ? 'hidden'
                      : ''} text-md font-medium ml-3 duration-200"
                  >
                    News
                  </span>
                </div>
              </div>
            </a>
          </li>

          <!-- Community -->
          <li
            on:click={() => (showSidebar = !showSidebar)}
            class="px-1 rounded-sm mb-2 last:mb-0"
          >
            <a
              href={"/community"}
              for="sidebar"
              class="block text-slate-200 hover:text-white sm:hover:bg-purple-700 truncate transition duration-150 {$page
                .url.pathname === '/community'
                ? 'text-white bg-purple-700 rounded-md '
                : ''}"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="#CCCCCC"
                    xmlns="http://www.w3.org/2000/svg"
                    ><path
                      d="M17,4c0,1.654,1.346,3,3,3,.568,0,1.094-.168,1.547-.443,.709,1.241,1.174,2.584,1.36,4.007l.992-.129c-.212-1.622-.748-3.151-1.583-4.553,.421-.516,.683-1.166,.683-1.883,0-1.654-1.346-3-3-3-.721,0-1.375,.266-1.893,.692-1.393-.824-2.942-1.382-4.542-1.591l-.129,.991c1.406,.183,2.769,.66,4.005,1.364-.274,.452-.441,.977-.441,1.543Zm5,0c0,1.103-.897,2-2,2s-2-.897-2-2,.897-2,2-2,2,.897,2,2ZM7,20c0-1.654-1.346-3-3-3-.568,0-1.094,.168-1.547,.443-.709-1.241-1.174-2.584-1.36-4.007l-.992,.129c.212,1.622,.748,3.151,1.583,4.553-.421,.516-.683,1.166-.683,1.883,0,1.654,1.346,3,3,3,.716,0,1.366-.263,1.883-.683,1.403,.835,2.932,1.371,4.553,1.582l.129-.991c-1.422-.185-2.766-.65-4.007-1.36,.275-.453,.443-.979,.443-1.547Zm-3,2c-1.103,0-2-.897-2-2s.897-2,2-2,2,.897,2,2-.897,2-2,2ZM13.512,6l-1.843-1.625,.662-.75,2.239,1.975c.271,.235,.43,.578,.43,.938s-.158,.703-.434,.941l-2.235,1.971-.662-.75,1.927-1.699h-1.596c-2.757,0-5,2.243-5,5,0,1.159,.412,2.213,1.077,3.062-.263,.238-.473,.518-.643,.82-.892-1.047-1.433-2.402-1.433-3.882,0-3.309,2.691-6,6-6h1.512Zm-3.024,12l1.843,1.625-.662,.75-2.239-1.975c-.271-.235-.43-.578-.43-.938s.158-.703,.434-.941l2.235-1.971,.662,.75-1.927,1.699h1.596c2.757,0,5-2.243,5-5,0-1.159-.412-2.213-1.077-3.062,.263-.238,.473-.518,.643-.82,.892,1.047,1.433,2.402,1.433,3.882,0,3.309-2.691,6-6,6h-1.512ZM1.093,10.564c.186-1.424,.65-2.767,1.36-4.008,.453,.275,.979,.443,1.547,.443,1.654,0,3-1.346,3-3,0-.568-.168-1.094-.443-1.547,1.242-.71,2.585-1.175,4.007-1.36l-.129-.991c-1.621,.211-3.15,.747-4.553,1.582-.516-.421-1.166-.683-1.883-.683-1.654,0-3,1.346-3,3,0,.716,.263,1.366,.683,1.883C.849,7.285,.312,8.814,.101,10.436l.992,.129ZM4,2c1.103,0,2,.897,2,2s-.897,2-2,2-2-.897-2-2,.897-2,2-2ZM22.907,13.436c-.186,1.423-.65,2.766-1.36,4.007-.453-.275-.979-.443-1.547-.443-1.654,0-3,1.346-3,3,0,.568,.168,1.094,.443,1.547-1.242,.71-2.585,1.175-4.007,1.36l.129,.991c1.621-.211,3.15-.747,4.553-1.582,.516,.421,1.166,.683,1.883,.683,1.654,0,3-1.346,3-3,0-.716-.263-1.365-.683-1.882,.834-1.403,1.37-2.932,1.582-4.554l-.992-.129Zm-2.907,8.564c-1.103,0-2-.897-2-2s.897-2,2-2,2,.897,2,2-.897,2-2,2Z"
                      fill="#CCCCCC"
                    ></path></svg
                  >
                  <span
                    class="2xl:{collapse
                      ? 'hidden'
                      : ''} text-md font-medium ml-3 duration-200"
                  >
                    Community
                  </span>
                </div>
              </div>
            </a>
          </li>

          <li
            on:click={() => (showSidebar = !showSidebar)}
            class="px-1 rounded-sm mb-2 last:mb-0"
          >
            <a
              href={"/leaderboard"}
              for="sidebar"
              class="block text-slate-200 hover:text-white sm:hover:bg-purple-700 truncate transition duration-150 {$page
                .url.pathname === '/leaderboard'
                ? 'text-white bg-purple-700 rounded-md '
                : ''}"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg
                    class="w-5 h-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    ><path
                      fill="#CCCCCC"
                      d="m21,11h-2.5c-1.654,0-3,1.346-3,3v.766c-.531-.476-1.232-.766-2-.766h-3c-1.654,0-3,1.346-3,3v.269c-.294-.171-.636-.269-1-.269h-3.5c-1.654,0-3,1.346-3,3v1c0,1.654,1.346,3,3,3h18c1.654,0,3-1.346,3-3v-7c0-1.654-1.346-3-3-3Zm-12.5,6c0-1.103.897-2,2-2h3c1.103,0,2,.897,2,2v6h-7v-6Zm-7.5,4v-1c0-1.103.897-2,2-2h3.5c.552,0,1,.449,1,1v4H3c-1.103,0-2-.897-2-2Zm22,0c0,1.103-.897,2-2,2h-4.5v-9c0-1.103.897-2,2-2h2.5c1.103,0,2,.897,2,2v7Zm-6.609-16.966l1.119.911-.442,1.329c-.138.438.017.917.385,1.193.187.139.417.215.648.215.214,0,.422-.063.603-.183l1.306-.874,1.33.866c.385.251.887.229,1.251-.049.365-.28.514-.762.365-1.208l-.455-1.297,1.114-.907c.347-.292.476-.774.32-1.2s-.564-.712-1.018-.712h-1.398l-.503-1.413c-.157-.422-.565-.706-1.016-.706s-.858.284-1.018.712l-.501,1.406h-1.398c-.452,0-.861.285-1.016.708-.157.424-.03.907.323,1.207Zm.692-.916h1.751c.212,0,.4-.133.471-.332l.619-1.738h.152l.619,1.738c.07.199.259.332.471.332h1.751l.06.142-1.38,1.125c-.164.133-.227.354-.156.553l.571,1.628-.128.088-1.606-1.046c-.168-.109-.384-.107-.551.003l-1.578,1.057c-.015.01-.03.015-.048.015l-.082-.101.549-1.649c.065-.197.002-.415-.159-.545l-1.387-1.128.062-.14Zm-8.692,3.807l1.119.911-.442,1.329c-.138.438.017.917.384,1.192.188.142.413.216.649.216.214,0,.422-.063.603-.183l1.306-.874,1.33.866c.385.25.886.229,1.251-.049.365-.28.514-.762.365-1.208l-.455-1.297,1.114-.907c.347-.292.476-.774.32-1.2s-.564-.712-1.018-.712h-1.398l-.503-1.413c-.157-.422-.565-.706-1.016-.706s-.858.284-1.018.712l-.501,1.406h-1.398c-.453,0-.861.286-1.016.708-.157.425-.03.907.323,1.207Zm.692-.916h1.751c.212,0,.4-.133.471-.332l.619-1.738h.152l.619,1.738c.07.199.259.332.471.332h1.751l.06.142-1.38,1.125c-.164.133-.227.354-.156.553l.571,1.628-.128.088-1.606-1.046c-.167-.109-.384-.107-.551.003l-1.578,1.057c-.015.01-.03.015-.048.015l-.082-.101.549-1.649c.065-.197.002-.415-.159-.545l-1.387-1.128.062-.14ZM.391,10.925l1.119.911-.442,1.329c-.138.438.017.917.384,1.192.188.142.413.216.649.216.214,0,.422-.063.603-.183l1.306-.874,1.33.866c.385.25.886.23,1.251-.049.365-.28.514-.762.365-1.208l-.455-1.297,1.114-.907c.347-.292.476-.774.32-1.2s-.564-.712-1.018-.712h-1.398l-.503-1.413c-.157-.422-.565-.706-1.016-.706s-.858.284-1.018.712l-.501,1.406h-1.398c-.453,0-.861.286-1.016.708-.157.425-.03.907.323,1.207Zm.692-.916h1.751c.212,0,.4-.133.471-.332l.619-1.738h.152l.619,1.738c.07.199.259.332.471.332h1.751l.06.142-1.38,1.125c-.164.133-.227.354-.156.553l.571,1.628-.128.088-1.606-1.046c-.167-.109-.384-.108-.551.003l-1.578,1.057c-.015.01-.03.015-.048.015l-.082-.101.549-1.649c.065-.197.002-.415-.159-.545l-1.387-1.128.062-.14Z"
                    /></svg
                  >
                  <span
                    class="2xl:{collapse
                      ? 'hidden'
                      : ''} text-md font-medium ml-3 duration-200"
                  >
                    Leaderboard
                  </span>
                </div>
              </div>
            </a>
          </li>

          <li
            on:click={() => (showSidebar = !showSidebar)}
            class="{data?.user?.tier === 'Pro'
              ? 'hidden'
              : ''} px-1 rounded-sm pb-40 sm:pb-6 last:mb-0"
          >
            <a
              href={"/pricing"}
              for="sidebar"
              class="block text-slate-200 hover:text-white sm:hover:bg-purple-700 truncate transition duration-150 {$page
                .url.pathname === '/pricing'
                ? 'text-white bg-purple-700 rounded-md '
                : ''}"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg
                    class="w-7 h-7"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    ><path
                      fill="#CCCCCC"
                      d="M17.938,5.57c-1.175-1.511-2.389-3.073-3.26-4.786-.228-.447-.615-.722-1.063-.753-.515-.032-1.017,.24-1.364,.736-.795,1.138-1.251,2.681-1.251,4.232,0,2.201,.648,3.516,1.219,4.677,.5,1.015,.895,1.816,.783,3.023-.12,1.305-1.315,2.315-2.698,2.3-2.856-.032-3.174-2.772-3.305-6.485-.025-.704-.484-1.276-1.169-1.459-.69-.188-1.38,.088-1.755,.691-1.003,1.61-2.074,4.123-2.075,6.343,0,5.461,4.53,9.905,10.002,9.905,5.512-.034,9.997-4.477,9.997-9.896,.056-3.234-1.944-5.807-4.061-8.529Zm3.061,8.521c0,4.879-4.039,8.874-9.002,8.904-4.929,0-8.997-3.995-8.997-8.905,0-2.011,1.037-4.39,1.924-5.815,.126-.202,.314-.274,.486-.274,.057,0,.112,.008,.163,.021,.097,.026,.413,.141,.427,.528,.108,3.078,.305,7.404,4.336,7.45,1.891,0,3.495-1.401,3.662-3.208,.138-1.488-.357-2.493-.882-3.558-.549-1.114-1.116-2.267-1.116-4.234,0-1.352,.39-2.686,1.071-3.66,.17-.242,.354-.31,.475-.312,.093,.007,.175,.077,.242,.209,.914,1.799,2.158,3.398,3.362,4.946,2.006,2.58,3.9,5.017,3.851,7.907Z"
                    /></svg
                  >

                  <span
                    class="2xl:{collapse
                      ? 'hidden'
                      : ''} text-md font-medium ml-3 duration-200"
                  >
                    Pricing
                  </span>
                </div>
              </div>
            </a>
          </li>

          <!--
      <li on:click={handleCollapse} class="hidden 2xl:block px-1 pb-20 rounded-sm" >
        <label for="sidebar" class="block text-slate-200 hover:text-white sm:hover:bg-purple-700 truncate transition duration-150">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <svg class="w-7 h-7 {collapse ? 'rotate-180' : ''}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="m4.836 12l6.207 6.207l1.414-1.414L7.664 12l4.793-4.793l-1.414-1.414zm5.65 0l6.207 6.207l1.414-1.414L13.314 12l4.793-4.793l-1.414-1.414z"/></svg>
                    <span class="2xl:{collapse ? 'hidden' : ''} text-md font-medium ml-3 duration-200">
                      Collapse
                  </span>
                  </div>
            </div>
          </label>
      </li>
    -->
        </ul>
      </div>
    </aside>
  </div>

  {#if $screenWidth < 640}
    <!--Start Mobile Profile Data Modal-->
    <input type="checkbox" id="mobileProfileData" class="modal-toggle" />

    <dialog id="mobileProfileData" class="modal modal-bottom">
      <label
        for="mobileProfileData"
        class="cursor-pointer modal-backdrop bg-[#131722] bg-opacity-[0.5]"
      ></label>

      <div class="modal-box bg-[#131722]">
        {#if data?.user}
          <ul
            class="menu menu-compact dropdown-content text-white bg-[#131722] border border-slate-800rounded"
          >
            <li class="mb-3">
              <label
                for="mobileProfileData"
                on:click={() => goto("/community/profile/")}
              >
                <div class="avatar flex-shrink-0 w-10 h-10 -ml-1">
                  <svg
                    style="clip-path: circle(50%);"
                    class="flex-shrink-0 w-10 h-10"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    ><g fill="white"
                      ><path d="M32 20a8 8 0 1 1-16 0a8 8 0 0 1 16 0" /><path
                        fill-rule="evenodd"
                        d="M23.184 43.984C12.517 43.556 4 34.772 4 24C4 12.954 12.954 4 24 4s20 8.954 20 20s-8.954 20-20 20h-.274q-.272 0-.542-.016M11.166 36.62a3.028 3.028 0 0 1 2.523-4.005c7.796-.863 12.874-.785 20.632.018a2.99 2.99 0 0 1 2.498 4.002A17.94 17.94 0 0 0 42 24c0-9.941-8.059-18-18-18S6 14.059 6 24c0 4.916 1.971 9.373 5.166 12.621"
                        clip-rule="evenodd"
                      /></g
                    ></svg
                  >
                </div>
                <div class="flex-row items-center text-[1rem]">Profile</div>
              </label>
              <!--Set to /profile/ to make it default active -->
            </li>
            <li class="mb-3">
              <label
                class="cursor-pointer"
                for="mobileProfileData"
                on:click={() => goto("/watchlist/")}
              >
                <svg
                  class="shrink-0 h-7 w-7"
                  fill="white"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#1A1A27"
                  ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g><g id="SVGRepo_iconCarrier">
                    <title>star-solid</title>
                    <g id="Layer_2" data-name="Layer 2">
                      <g id="invisible_box" data-name="invisible box">
                        <rect width="48" height="48" fill="none"></rect>
                      </g>
                      <g id="icons_Q2" data-name="icons Q2">
                        <path
                          d="M24,3a2.1,2.1,0,0,0-1.8,1.1L16.5,15.7,3.7,17.5A2.1,2.1,0,0,0,2.6,21l9.2,8.9L9.7,42.7A2,2,0,0,0,11.6,45l1-.2,11.4-6,11.4,6,1,.2a2,2,0,0,0,1.9-2.3L36.2,29.9,45.4,21a2.1,2.1,0,0,0-1.1-3.5L31.5,15.7,25.8,4.1A2.1,2.1,0,0,0,24,3Z"
                        ></path>
                      </g>
                    </g>
                  </g></svg
                >
                <span class="ml-1 text-white font-medium text-[1rem]"
                  >Watchlist</span
                >
              </label>
              <!--Set to /profile/ to make it default active -->
            </li>

            <li class="mb-3">
              <label
                class="cursor-pointer"
                for="mobileProfileData"
                on:click={() => goto("/price-alert/")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-7 h-7 inline-block"
                  viewBox="0 0 24 24"
                  ><g
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    ><path d="M0 0h24v24H0z" /><path
                      fill="white"
                      d="M16 6.072a8 8 0 1 1-11.995 7.213L4 13l.005-.285A8 8 0 0 1 16 6.072M12 10a1 1 0 0 0-1 1v1h-1l-.117.007A1 1 0 0 0 10 14h1v1l.007.117A1 1 0 0 0 13 15v-1h1l.117-.007A1 1 0 0 0 14 12h-1v-1l-.007-.117A1 1 0 0 0 12 10"
                    /><path
                      fill="white"
                      d="M6.412 3.191A1 1 0 0 1 7.685 4.73l-.097.08l-2.75 2a1 1 0 0 1-1.273-1.54l.097-.08zm9.779.221a1 1 0 0 1 1.291-.288l.106.067l2.75 2a1 1 0 0 1-1.07 1.685l-.106-.067l-2.75-2a1 1 0 0 1-.22-1.397z"
                    /></g
                  ></svg
                >
                <span class="ml-1 text-white font-medium text-[1rem]"
                  >Price Alert</span
                >
              </label>
            </li>

            <li class="mb-3">
              <label
                class="cursor-pointer"
                for="mobileProfileData"
                on:click={() => goto("/portfolio/")}
              >
                <svg
                  class="shrink-0 h-7 w-7"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                    id="SVGRepo_tracerCarrier"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></g><g id="SVGRepo_iconCarrier">
                    <path
                      d="M0 7.49996C0 3.52583 3.09098 0.27365 7 0.0163574V4.0354C5.30385 4.27801 4 5.73672 4 7.49996C4 9.43295 5.567 11 7.5 11C8.28618 11 9.01181 10.7407 9.5961 10.3031L12.438 13.1451C11.1188 14.3 9.39113 15 7.5 15C3.35786 15 0 11.6421 0 7.49996Z"
                      fill="#fff"
                    ></path>
                    <path
                      d="M13.1451 12.438C14.3001 11.1187 15 9.39107 15 7.49996C15 6.46644 14.7909 5.48175 14.4128 4.58586L10.7552 6.21147C10.9132 6.61024 11 7.04496 11 7.49996C11 8.28611 10.7408 9.01174 10.3032 9.59602L13.1451 12.438Z"
                      fill="#fff"
                    ></path>
                    <path
                      d="M8 4.0354V0.0163574C10.5416 0.183645 12.7373 1.61699 13.9626 3.69166L10.2541 5.33986C9.71063 4.64791 8.91203 4.16585 8 4.0354Z"
                      fill="#fff"
                    ></path>
                  </g></svg
                >
                <span class="ml-1 text-white font-medium text-[1rem]"
                  >Portfolio</span
                >
              </label>
            </li>

            <hr class="border-slate-700" />
            <li class="mt-3">
              <form action="/logout" method="POST">
                <button type="submit" class="w-full text-start">
                  <svg
                    class="w-6 h-6 inline-block mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                    ><path
                      fill="white"
                      d="M6 30h12a2.002 2.002 0 0 0 2-2v-3h-2v3H6V4h12v3h2V4a2.002 2.002 0 0 0-2-2H6a2.002 2.002 0 0 0-2 2v24a2.002 2.002 0 0 0 2 2Z"
                    /><path
                      fill="white"
                      d="M20.586 20.586L24.172 17H10v-2h14.172l-3.586-3.586L22 10l6 6l-6 6l-1.414-1.414z"
                    /></svg
                  >
                  <span class="text-start">Logout</span>
                </button>
              </form>
            </li>
            <li>
              <span
                style="font-size: 9px;"
                class="block text-start text-gray-400"
                >© 2024 octopi. All Rights Reserved.
              </span>
            </li>
          </ul>
        {:else}
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <ul class="menu menu-compact dropdown-content text-gray-300 rounded">
            <li class="mb-3">
              <!-- svelte-ignore a11y-missing-attribute -->
              <label
                for="mobileProfileData"
                on:click={() => goto("/login")}
                class="cursor-pointer"
              >
                <svg
                  class="shrink-0 w-7 h-7"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  ><path
                    fill="white"
                    d="M6 30h12a2.002 2.002 0 0 0 2-2v-3h-2v3H6V4h12v3h2V4a2.002 2.002 0 0 0-2-2H6a2.002 2.002 0 0 0-2 2v24a2.002 2.002 0 0 0 2 2Z"
                  /><path
                    fill="white"
                    d="M20.586 20.586L24.172 17H10v-2h14.172l-3.586-3.586L22 10l6 6l-6 6l-1.414-1.414z"
                  /></svg
                >
                <span class="ml-2 text-start">Login</span>
              </label>
            </li>

            <hr class="border-slate-700" />
            <li>
              <span
                style="font-size: 9px;"
                class="block text-start text-gray-400"
                >© 2024 octopi. All Rights Reserved.
              </span>
            </li>
          </ul>
        {/if}
      </div>
    </dialog>
    <!--End Mobile Profile Data Modal-->
  {/if}

  <main>
    <!--<Firefly/>-->
    <Toaster class="bg-[#1A1A27] text-white text-medium" />
    {#if Cookie && $showCookieConsent === true}
      <Cookie />
    {/if}

    <!--
  {#if $screenWidth < 640}
    <PullToRefresh />
  {/if}
  -->

    <!--
    {#key data?.currentPath}

      <div in:pageTransitionIn={{ duration: 250 }} out:pageTransitionOut={{duration: 250}}>
        <slot />
      </div>

    {/key}
    -->
    <slot />

    {#if !hideFooter}
      <Footer />
    {/if}
  </main>
</div>

<style>
  .scroller {
    scrollbar-width: thin;
  }
</style>
