<script lang="ts">
  import InfiniteLoading from "$lib/components/InfiniteLoading.svelte";
  import { numberOfUnreadNotification } from "$lib/store";
  import { formatDate } from "$lib/utils.js";

  export let data;

  let rawData = data?.getCryptoNews;
  let news = rawData?.slice(0, 15) ?? [];

  async function infiniteHandler({ detail: { loaded, complete } }) {
    if (news?.length === rawData?.length) {
      complete();
    } else {
      const nextIndex = news?.length;
      const newArticles = rawData?.slice(nextIndex, nextIndex + 5);
      news = [...news, ...newArticles];
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
    content={`Get the latest general news and breaking stories from the world's best finance and investing websites.`}
  />

  <!-- Other meta tags -->
  <meta
    property="og:title"
    content={`Today's General News and Breaking Stories · octopi`}
  />
  <meta
    property="og:description"
    content={`Get the latest general news and breaking stories from the world's best finance and investing websites.`}
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
    content={`Today's General News and Breaking Stories · octopi`}
  />
  <meta
    name="twitter:description"
    content={`Get the latest general news and breaking stories from the world's best finance and investing websites.`}
  />
  <meta
    name="twitter:image"
    content="https://octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>

<div class="flex justify-center w-full m-auto overflow-hidden">
  <div class="relative flex justify-center items-center overflow-hidden">
    <main>
      <div class="w-screen sm:w-full m-auto">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {#if news.length !== 0}
            {#each news as item}
              <article
                class="max-w-xl flex p-3 flex-col w-full mt-5 items-start justify-between bg-[#111111] border border-[#2a2e39] shadow-lg h-auto sm:h-[280px] pb-10 sm:pb-5 rounded-none sm:rounded-lg m-auto"
              >
                <div
                  class="flex items-center justify-between w-full gap-x-4 text-xs cursor-pointer"
                >
                  <div class="text-white-500">{formatDate(item?.publishedDate)} ago</div>

                  <div class="flex items-center gap-x-4 text-xs">
                   
                    <div
                      class={`relative z-10 rounded-full ${item?.sentiment_category === "negative" ? "bg-red-600" : item?.sentiment_category === "positive" ? "bg-green-600" : "bg-purple-600"} px-3 py-1.5 font-medium text-white hover:bg-purple-400`}
                    >
                      {item?.symbol}
                    </div>
                  </div>
                </div>
                <div class="relative mt-2 flex items-center gap-x-4">
                  <img
                    src={item?.image}
                    alt=""
                    class="h-10 w-10 rounded-full bg-gray-50"
                  />
                  <div class="text-sm leading-6">
                    <a href={item?.url} target="_blank" class="text-lg font-bold text-white hover:underline">
                      {item?.title}
                    </a>
                  </div>
                </div>
                <div class="group relative">
                  <p class="text-white text-sm mt-2"> {@html item?.text?.length > 150
                    ? item?.text?.slice(0, 150) + "..."
                    : item?.text}</p>
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
