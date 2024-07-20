<script lang="ts">
  import InfiniteLoading from "$lib/components/InfiniteLoading.svelte";
  import { numberOfUnreadNotification } from "$lib/store";

  export let data;

  let rawData = data?.GetLatestNewsItems;
  let allNews = rawData ?? [];
  let displayedNews = allNews.slice(0, 15);
  let searchTerm = "";

  function searchNews() {
    const lowercaseSearch = searchTerm.toLowerCase();
    displayedNews = allNews
      .filter(
        (item) =>
          item.NewsitemSecurities?.some((security) =>
            security.SecurityName.toLowerCase().includes(lowercaseSearch)
          ) ||
          item.NewsitemSectors?.some((sector) =>
            sector.SectorName.toLowerCase().includes(lowercaseSearch)
          )
      )
      .slice(0, 15);
  }

  async function infiniteHandler({ detail: { loaded, complete } }) {
    if (displayedNews.length === allNews.length) {
      complete();
    } else {
      const nextIndex = displayedNews.length;
      const newArticles = allNews.slice(nextIndex, nextIndex + 5);
      displayedNews = [...displayedNews, ...newArticles];
      loaded();
    }
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} Today's
    General News and Breaking Stories · octopi
  </title>
  <meta
    name="description"
    content="Get the latest general news and breaking stories from the world's best finance and investing websites."
  />
  <meta
    property="og:title"
    content="Today's General News and Breaking Stories · octopi"
  />
  <meta
    property="og:description"
    content="Get the latest general news and breaking stories from the world's best finance and investing websites."
  />
  <meta
    property="og:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Today's General News and Breaking Stories · octopi"
  />
  <meta
    name="twitter:description"
    content="Get the latest general news and breaking stories from the world's best finance and investing websites."
  />
  <meta
    name="twitter:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
</svelte:head>

<div class="flex justify-center w-full m-auto overflow-hidden">
  <div class="relative flex justify-center items-center overflow-hidden">
    <main>
      <div class="w-screen sm:w-full m-auto">
        <div class="mb-5 mt-5 w-full">
          <input
            type="text"
            bind:value={searchTerm}
            on:input={searchNews}
            placeholder="Search by security or sector.."
            class="w-60 p-2 border border-slate-700 rounded-md p-1 bg-[#09090b]"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {#if displayedNews.length !== 0}
            {#each displayedNews as item}
              <article
                class="max-w-xl flex p-3 flex-col w-full items-start bg-[#141417]  shadow-lg h-auto sm:h-[350px] pb-10 sm:pb-5 rounded-none sm:rounded-lg m-auto"
              >
                <div
                  class="flex items-center justify-between w-full gap-x-4 text-xs cursor-pointer p-2"
                >
                  <div class="text-white-500 code-font ml-auto">
                    {new Date(item?.Date).toDateString()}
                  </div>
                </div>
                <div class="relative mt-4 mb-4 flex items-start gap-x-4 mt-2 p-2">
                  <!-- {#if item?.NewsitemIndustries && item.NewsitemIndustries.length > 0}
                    <img
                      src={item?.NewsitemIndustries?.[0]?.IndustryImageUrl}
                      alt=""
                      class="h-10 w-10 rounded-full bg-gray-50 mt-3"
                    />
                  {/if} -->
                  <div class="text-sm leading-6">
                    <div class="text-lg text-white">
                      {item?.Description}
                    </div>
                  </div>
                </div>
                <div class="flex mt-2 items-center gap-x-4 text-xs flex-wrap ml-auto">
                  {#if item?.NewsitemSecurities && item.NewsitemSecurities.length > 0}
                    {#each item.NewsitemSecurities as security}
                      <a
                        href={"/stocks/" + security?.SecurityID}
                        class={`relative z-10 rounded-full code-font mb-2 ${
                          item?.sentiment_category === "negative"
                            ? "bg-red-600"
                            : item?.sentiment_category === "positive"
                              ? "bg-green-600"
                              : "bg-red-500"
                        } px-3 py-0.5 font-medium text-white hover:bg-red-700`}
                      >
                        {@html security?.SecurityName?.length > 60
                          ? security?.SecurityName?.slice(0, 60) + "..."
                          : security?.SecurityName}
                      </a>
                    {/each}
                  {/if}
                </div>
                <div class="flex mt-2 items-center gap-x-4 text-xs flex-wrap ml-auto">
                  {#if item?.NewsitemSectors && item.NewsitemSectors.length > 0}
                    {#each item.NewsitemSectors as sector}
                      <a
                        href={"/stocks/" + sector?.SectorID}
                        class={`relative z-10 rounded-full code-font mb-2 ${
                          item?.sentiment_category === "negative"
                            ? "bg-red-600"
                            : item?.sentiment_category === "positive"
                              ? "bg-green-600"
                              : "bg-[#374151]"
                        } px-3 py-0.5 font-medium text-white hover:bg-[#4b5563]`}
                      >
                        {@html sector?.SectorName?.length > 60
                          ? sector?.SectorName?.slice(0, 60) + "..."
                          : sector?.SectorName}
                      </a>
                    {/each}
                  {/if}
                </div>
              </article>
            {/each}

            <InfiniteLoading on:infinite={infiniteHandler} />
          {/if}
        </div>
      </div>
    </main>
  </div>
</div>
