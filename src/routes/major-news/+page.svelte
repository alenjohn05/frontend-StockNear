<script lang="ts">
  export let data;
  let loading = true;
  let error: any = null;

  $: {
    if (data) {
      loading = false;
      const rawData = data?.getMarketMajorNews;
      if (!rawData) {
        error = "Failed to fetch news data";
      } else {
        majorNewsData = rawData?.GetMajorNews?.data?.[0];
        GetHot_PursuitsData = rawData?.GetHot_Pursuits?.data;
        GetMarketResultsAnnouncementsData =
          rawData?.GetMarketResultsAnnouncements?.data;
      }
    }
  }

  let majorNewsData, GetHot_PursuitsData, GetMarketResultsAnnouncementsData;

  // Sample data for live news and currency news (replace with actual data later)
  const liveNews = [
    { title: "Live Update 1", image: "https://example.com/live1.jpg" },
    { title: "Live Update 2", image: "https://example.com/live2.jpg" }
  ];

  const currencyNews = [
    { title: "USD Strengthens", image: "https://example.com/usd.jpg" },
    { title: "Euro Fluctuates", image: "https://example.com/euro.jpg" }
  ];
</script>

<div class="container mx-auto max-w-7xl overflow-hidden">
  {#if loading}
    <div class="flex justify-center items-center h-screen">
      <div
        class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"
      ></div>
    </div>
  {:else if error}
    <div
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      role="alert"
    >
      <strong class="font-bold">Error!</strong>
      <span class="block sm:inline">{error}</span>
    </div>
  {:else}
  <div class="mt-10 mb-10">

      <h2 class="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">Back End Developer</h2>
  </div>
    <div class="md:flex">
      <div class="flex md:w-7/12 p-2">
        <div class="md:flex bg-[#131722] border border-[#2a2e39]">
            <div class="md:shrink-0 h-38">
              <img class=" w-full object-cover md:h-full md:w-48" src={majorNewsData?.IllustrationImage} alt="Modern building architecture">
            </div>
            <div class="p-8">
              <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Company retreats</div>
              <a href="#" class="block mt-1 text-2xl leading-tight font-medium text-white hover:underline">{majorNewsData?.heading}</a>
              <p class="mt-2 text-white text-sm">{majorNewsData?.Arttext}</p>
            </div>
          </div>
      </div>
      <div class="flex md:w-3/12 p-2">
        
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Live News Section -->
      <div>
        <h3 class="text-xl font-bold mb-4">Live News</h3>
        <ul class="space-y-4">
          {#each GetHot_PursuitsData || [] as news}
            <li class="flex items-center space-x-4">
              <img
                src={news.image || "default-image-url.jpg"}
                alt={news.title}
                class="w-8 h-8 object-cover rounded"
              />
              <span>{news.title}</span>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Currency News Section -->
      <div>
        <h3 class="text-xl font-bold mb-4">Market Results & Announcements</h3>
        <ul class="space-y-4">
          {#each GetMarketResultsAnnouncementsData || [] as news}
            <li class="flex items-center space-x-4">
              <img
                src={news.image || "default-image-url.jpg"}
                alt={news.title}
                class="w-8 h-8 object-cover rounded"
              />
              <span>{news.title}</span>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>
