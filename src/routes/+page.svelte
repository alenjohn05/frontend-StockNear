<script lang="ts">
  import DotPattern from "$lib/components/DotPattern.svelte";
  import Marquee from "$lib/components/Marquee.svelte";

  //import Discount from '$lib/components/Discount.svelte';
  import { intersect } from "svelte-intersection-observer-action";

  export let data;

  let cloudFrontUrl = import.meta.env.VITE_IMAGE_URL;

  const frontendStars = data?.getFrontendStars;
  const backendStars = data?.getBackendStars;

  const threshold = 0.4; // change the threshold value to 0.4 for 40%
  const rootMargin = "-0px 0px";
  const intersectOptions = { callback, threshold, rootMargin };
  function callback(entry: IntersectionObserverEntry) {
    if (entry.intersectionRatio > threshold) {
      entry.target.classList.remove("invisible");
      entry.target.classList.add("fade-down");
    }
  }
</script>

<svelte:head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <title>Modern Stock Analysis Platform · octopi</title>

  <meta
    name="description"
    content="Octopi has everything you need to analyze stocks with help of AI, including detailed financial data, statistics, news and charts."
  />
  <!-- Other meta tags -->
  <meta property="og:title" content="Modern Stock Analysis Platform · octopi" />
  <meta
    property="og:description"
    content="Octopi has everything you need to analyze stocks with help of AI, including detailed financial data, statistics, news and charts."
  />
  <meta property="og:type" content="website" />
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Stock Analysis Information for Small Investors · octopi"
  />
  <meta
    name="twitter:description"
    content="Octopi has everything you need to analyze stocks with help of AI, including detailed financial data, statistics, news and charts."
  />
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>

<DotPattern
  width={20}
  height={20}
  cx={10}
  cy={10}
  cr={1}
  class="hidden sm:block [mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] "
/>

<div
  class="w-full max-w-screen overflow-hidden m-auto min-h-screen bg-[#111111]"
>
  <div
    class="m-auto flex flex-wrap flex-col justify-center items-center md:flex-row"
  >
    <!--Left Col-->

    <div class="flex flex-col w-full justify-center items-center">
      <div class="text-center w-full">
        <section>
          <div class="relative w-full mx-auto overflow-hidden">
            <div class="w-full m-auto flex justify-center overflow-hidden">
              <div class="py-7">
                <!-- Section content -->
                <div class="relative m-auto">
                  <!-- Section header -->
                  <div class="h-auto">
                    <div class="w-full sm:rounded-xl h-auto mt-10">
                      <div class="grid grid-cols-1 gap-10 mt-10">
                        <!-- Start Column -->
                        <div>
                          <div
                            class="flex flex-row justify-center items-center w-full sm:w-3/4 m-auto mt-10"
                          >
                            <h1
                              class="fade-down text-center text-5xl sm:text-7xl bg-gradient-to-r from-[#E8BB28] to-purple-500 bg-clip-text text-transparent font-bold mb-6 w-80 sm:w-full"
                            >
                              AI-driven insight for every investor.
                            </h1>
                          </div>

                          <div
                            class="w-5/6 sm:w-3/4 m-auto text-center flex-1 justify-center items-center text-white text-lg sm:text-2xl"
                          >
                            Track stock market influences with clear, actionable
                            data enhanced by AI analysis.
                          </div>

                          <div
                            class="flex flex-col gap-y-4 justify-center items-center mt-8 mb-6 m-auto w-full max-w-3xl"
                          >
                            <a
                              href="/register"
                              class="animate-shine transition-colors group relative grid overflow-hidden rounded-xl px-6 py-3 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors"
                            >
                              <span>
                                <span
                                  class="spark mask-gradient animate-flip before:animate-kitrotate absolute inset-0 h-[100%] w-[100%] overflow-hidden rounded-xl [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]"
                                />
                              </span>
                              <span
                                class="backdrop absolute inset-px rounded-[11px] bg-[#E8BB28] transition-colors duration-200 group-hover:bg-[#fac109]"
                              />
                              <span
                                class="z-10 text-black text-[1rem] sm:text-lg font-semibold"
                              >
                                <slot
                                  >Start free 7-day trial today!<span
                                    class="ml-2 mt-0.5 tracking-normal group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out"
                                  >
                                  </span></slot
                                >
                                <svg
                                  class="w-4 h-4 inline-block"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  ><g transform="rotate(90 12 12)"
                                    ><g fill="none"
                                      ><path
                                        d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"
                                      /><path
                                        fill="#000"
                                        d="M13.06 3.283a1.5 1.5 0 0 0-2.12 0L5.281 8.939a1.5 1.5 0 0 0 2.122 2.122L10.5 7.965V19.5a1.5 1.5 0 0 0 3 0V7.965l3.096 3.096a1.5 1.5 0 1 0 2.122-2.122L13.06 3.283Z"
                                      /></g
                                    ></g
                                  ></svg
                                >
                              </span>
                            </a>

                            <div
                              class="flex flex-row items-center gap-x-5 justify-center m-auto mt-3 w-ful"
                            >
                              <span class="text-white text-sm sm:text-lg">
                                <svg
                                  class="w-6 h-6 inline-block"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  ><path
                                    fill="none"
                                    stroke="#FBCE3C"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="32"
                                    d="M416 128L192 384l-96-96"
                                  /></svg
                                >
                                No credit card required
                              </span>
                              <span class="text-white text-sm sm:text-lg">
                                <svg
                                  class="w-6 h-6 inline-block"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 512 512"
                                  ><path
                                    fill="none"
                                    stroke="#FBCE3C"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="32"
                                    d="M416 128L192 384l-96-96"
                                  /></svg
                                >
                                Instant Access
                              </span>
                            </div>

                            <div
                              class="flex flex-col items-center justify-center mt-2 sm:mt-4"
                            >
                              <div class="flex items-center">
                                <svg
                                  class="w-5 h-5 sm:w-6 sm:h-6 ms-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  ><path
                                    fill="#FAC109"
                                    d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
                                  /></svg
                                >
                                <svg
                                  class="w-5 h-5 sm:w-6 sm:h-6 ms-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  ><path
                                    fill="#FAC109"
                                    d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
                                  /></svg
                                >
                                <svg
                                  class="w-5 h-5 sm:w-6 sm:h-6 ms-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  ><path
                                    fill="#FAC109"
                                    d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
                                  /></svg
                                >
                                <svg
                                  class="w-5 h-5 sm:w-6 sm:h-6 ms-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  ><path
                                    fill="#FAC109"
                                    d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
                                  /></svg
                                >
                                <svg
                                  class="w-5 h-5 sm:w-6 sm:h-6 ms-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  ><path
                                    fill="#FAC109"
                                    d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z"
                                  /></svg
                                >
                              </div>
                              <span
                                class="text-sm font-semibold text-white mt-1.5"
                              >
                                Used by over 1,000+ traders
                              </span>
                            </div>
                          </div>

                          <!--<Discount />-->
                        </div>
                      </div>
                      <!-- End Column -->

                      <h1
                        class="text-white w-5/6 sm:w-full m-auto text-3xl sm:text-4xl font-bold mt-14 mb-5"
                      >
                        Explore high-quality datasets now!
                      </h1>
                      <div
                        class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 w-full m-auto"
                      >
                        <div
                          use:intersect={intersectOptions}
                          class="card bg-[#111111] border border-[#2a2e39] sm:w-96 shadow-xl rounded-none sm:rounded-lg invisible"
                        >
                          <div class="card-body">
                            <h2
                              class="card-title text-white text-2xl font-bold"
                            >
                              <svg
                                class="w-9 h-9 inline-block mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 15 15"
                                ><path
                                  fill="none"
                                  stroke="#fff"
                                  stroke-linejoin="round"
                                  d="M.5 3.498L7.5.5l7 2.998m-14 0l7 2.998m-7-2.998V3.5m14-.002l-7 2.998m7-2.998V11.5l-7 3m7-11.002L7.5 6.5v8m0-8.004V14.5m0-8.004L.5 3.5m7 11l-7-3v-8"
                                /></svg
                              >
                              Dark Pool
                            </h2>
                            <span class="text-start text-white">
                              Access high-volume, privately negotiated trades
                              from exclusive exchanges, typically used by
                              institutional investors. This data is now
                              available to you!
                            </span>
                          </div>
                        </div>

                        <div
                          use:intersect={intersectOptions}
                          class="card bg-[#111111] border border-[#2a2e39] sm:w-96 shadow-xl rounded-none sm:rounded-lg invisible"
                        >
                          <div class="card-body">
                            <h2
                              class="card-title text-white text-2xl font-bold"
                            >
                              <svg
                                class="w-10 h-10 inline-block"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                ><path
                                  fill="none"
                                  stroke="#fff"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1.5"
                                  d="M14 16V8c0-.943 0-1.414-.293-1.707S12.943 6 12 6s-1.414 0-1.707.293S10 7.057 10 8v8c0 .943 0 1.414.293 1.707S11.057 18 12 18s1.414 0 1.707-.293S14 16.943 14 16m7-7V7c0-.943 0-1.414-.293-1.707S19.943 5 19 5s-1.414 0-1.707.293S17 6.057 17 7v2c0 .943 0 1.414.293 1.707S18.057 11 19 11s1.414 0 1.707-.293S21 9.943 21 9M7 14v-2c0-.943 0-1.414-.293-1.707S5.943 10 5 10s-1.414 0-1.707.293S3 11.057 3 12v2c0 .943 0 1.414.293 1.707S4.057 16 5 16s1.414 0 1.707-.293S7 14.943 7 14m5 7v-3m7-5v-2m-7-5V3m7 2V3M5 18v-2m0-6V8"
                                  color="#F9784E"
                                /></svg
                              >
                              Market Maker
                            </h2>
                            <span class="text-start text-white">
                              Access Market Maker Activity to monitor their
                              trading volume and identify the companies they are
                              focusing on to spot potential hot stocks.
                            </span>
                          </div>
                        </div>

                        <div
                          use:intersect={intersectOptions}
                          class="card bg-[#111111] border border-[#2a2e39] sm:w-96 shadow-xl rounded-none sm:rounded-lg invisible"
                        >
                          <div class="card-body">
                            <h2
                              class="card-title text-white text-2xl font-bold"
                            >
                              <svg
                                class="w-10 h-10 inline-block"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 32 32"
                                ><path
                                  fill="#fff"
                                  d="M4 7a1 1 0 0 0 0 2h2.22l2.624 10.5c.223.89 1.02 1.5 1.937 1.5h12.47c.903 0 1.67-.6 1.907-1.47L27.75 10h-2.094l-2.406 9H10.78L8.157 8.5A1.984 1.984 0 0 0 6.22 7zm18 14c-1.645 0-3 1.355-3 3s1.355 3 3 3s3-1.355 3-3s-1.355-3-3-3m-9 0c-1.645 0-3 1.355-3 3s1.355 3 3 3s3-1.355 3-3s-1.355-3-3-3m3-14v5h-3l4 4l4-4h-3V7zm-3 16c.564 0 1 .436 1 1c0 .564-.436 1-1 1c-.564 0-1-.436-1-1c0-.564.436-1 1-1m9 0c.564 0 1 .436 1 1c0 .564-.436 1-1 1c-.564 0-1-.436-1-1c0-.564.436-1 1-1"
                                /></svg
                              >
                              Retail Trader Tracker
                            </h2>
                            <span class="text-start text-white">
                              Gain exclusive insights with our Retail Trader
                              Tracker to discover where retail traders are
                              investing and identify the next potential hype
                              stocks.
                            </span>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-row max-w-6xl mx-auto h-[400px]">
                        <div
                          class="flex-1 p-4 flex flex-col items-start justify-end"
                        >
                          <h1
                            class="fade-down text-left text-5xl sm:text-7xl bg-gradient-to-r from-[#E8BB28] to-purple-500 bg-clip-text text-transparent font-bold mb-6 w-80 sm:w-full"
                          >
                            A solution for every investor.
                          </h1>
                        </div>
                        <div
                          class="flex-1 p-4 flex flex-col items-end justify-center"
                        >
                          <h2 class=" text-white text-end text-xl">
                            We believe awesome data should be available to
                            everyone, no matter the size of your portfolio.
                            That’s why we have a price plan to suit everyone.
                          </h2>
                          <h1
                            class="fade-down mt-10 text-end text-2xl sm:text-3xl bg-gradient-to-r from-[#E8BB28] to-purple-500 bg-clip-text text-transparent font-bold mb-6 w-80 sm:w-full"
                          >
                            Discover how we can help you
                          </h1>
                        </div>
                      </div>

                      <div>
                        <h2
                          use:intersect={intersectOptions}
                          class="invisible text-white text-3xl sm:text-4xl font-bold mt-16 w-5/6 sm:w-1/2 text-center m-auto"
                        >
                          AI-Powered Algorithms to assist you in any way
                        </h2>
                      </div>

                      <section>
                        <div class="max-w-6xl mx-auto px-4 sm:px-6">
                          <div class="pt-10 pb-12 md:pt-16 md:pb-20">
                            <!-- Items -->
                            <div
                              class="max-w-sm mx-auto grid gap-8 md:grid-cols-3 lg:gap-16 items-start md:max-w-none"
                            >
                              <!-- 1st item -->
                              <div
                                use:intersect={intersectOptions}
                                class="relative flex flex-col items-center invisible"
                              >
                                <div
                                  class="mb-4 rounded-full flex-shrink-0 w-16 h-16 relative flex items-center justify-center bg-gradient-to-r from-purple-800 to-purple-500"
                                >
                                  <svg
                                    class="w-7 h-7"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 14 14"
                                    ><path
                                      fill="none"
                                      stroke="#fff"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      d="M6.15.555a.389.389 0 0 0-.399 0a.26.26 0 0 0-.06.34c1.227 2.123 1.486 5.016-.19 6.611a5.505 5.505 0 0 1-1.495-1.994a3.88 3.88 0 0 0-1.995 3.49a4.688 4.688 0 0 0 4.987 4.488c3.211 0 4.877-1.994 4.986-4.488C12.114 6.01 9.99 2.33 6.15.555"
                                    /></svg
                                  >
                                </div>
                                <h4
                                  class="text-xl text-white font-semibold mb-2"
                                >
                                  AI Market Forecast
                                </h4>
                                <p
                                  class="text-[1rem] sm:text-lg text-white text-center"
                                >
                                  Forecasting upcoming trends for each company
                                  in the months ahead through detailed analysis
                                  and predictions.
                                </p>
                              </div>

                              <!-- 2nd item -->
                              <div
                                use:intersect={intersectOptions}
                                class="relative flex flex-col items-center invisible"
                              >
                                <div
                                  class="mb-4 rounded-full flex-shrink-0 w-16 h-16 relative flex items-center justify-center bg-gradient-to-r from-purple-800 to-purple-500"
                                >
                                  <svg
                                    class="w-7 h-7"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 32 32"
                                    ><path
                                      fill="#fff"
                                      d="m24 20l-1.41 1.41L26.17 25H10a4 4 0 0 1 0-8h12a6 6 0 0 0 0-12H5.83l3.58-3.59L8 0L2 6l6 6l1.41-1.41L5.83 7H22a4 4 0 0 1 0 8H10a6 6 0 0 0 0 12h16.17l-3.58 3.59L24 32l6-6Z"
                                    /></svg
                                  >
                                </div>
                                <h4
                                  class="text-xl text-white font-semibold mb-2"
                                >
                                  Price Movements
                                </h4>
                                <p
                                  class="text-[1rem] sm:text-lg text-white text-center"
                                >
                                  We predict price movements for each company,
                                  using AI to empower your investment strategy
                                  with confidence
                                </p>
                              </div>

                              <!-- 3rd item -->
                              <div
                                use:intersect={intersectOptions}
                                class="relative flex flex-col items-center invisible"
                              >
                                <div
                                  class="mb-4 rounded-full flex-shrink-0 w-16 h-16 relative flex items-center justify-center bg-gradient-to-r from-purple-800 to-purple-500"
                                >
                                  <svg
                                    class="w-7 h-7"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    ><g
                                      fill="none"
                                      stroke="#fff"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                      stroke-width="1.5"
                                      color="#F9784E"
                                      ><path
                                        d="M18 15V9c0-2.828 0-4.243-.879-5.121C16.243 3 14.828 3 12 3H8c-2.828 0-4.243 0-5.121.879C2 4.757 2 6.172 2 9v6c0 2.828 0 4.243.879 5.121C3.757 21 5.172 21 8 21h12M6 8h8m-8 4h8m-8 4h4"
                                      /><path
                                        d="M18 8h1c1.414 0 2.121 0 2.56.44c.44.439.44 1.146.44 2.56v8a2 2 0 1 1-4 0z"
                                      /></g
                                    ></svg
                                  >
                                </div>
                                <h4
                                  class="text-xl text-white font-semibold mb-2"
                                >
                                  News Sentiments
                                </h4>
                                <p
                                  class="text-[1rem] sm:text-lg text-white text-center"
                                >
                                  We analyze millions of news articles to gauge
                                  market sentiment and insights on each company.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</div>
<section class="bg-[#0A0A0A] w-full max-w-screen p-10">
  <div class="flex flex-row max-w-6xl mx-auto h-[600px]">
    <div class="flex-1 p-4 flex flex-col items-start justify-end">
      <h1
        class="fade-down text-left text-3xl sm:text-6xl bg-gradient-to-r from-[#E8BB28] to-purple-500 bg-clip-text text-transparent font-bold mb-6 w-80 sm:w-full"
      >
        To equip every investor in the world, with the best data and tools;
        empowering them to achieve more.
      </h1>
    </div>
    <div class="flex-1 p-4 flex flex-col items-end justify-center">
      <h2 class=" text-white text-end text-xl">
        Humans love to visualize. Graphs drive today’s investing. Octopi's craft
        starts with fitting all the world’s data into radiant views. No more
        clunky interfaces! It’s the look and feel you wished for.
      </h2>
      <h1
        class="fade-down mt-10 text-end text-2xl sm:text-3xl bg-gradient-to-r from-[#E8BB28] to-purple-500 bg-clip-text text-transparent font-bold mb-6 w-80 sm:w-full"
      >
      Built by investors, for investors.
      </h1>
    </div>
  </div>
  <h2
    use:intersect={intersectOptions}
    class="invisible text-white text-3xl sm:text-xl text-center m-auto font-bold mt-20 w-11/12 sm:w-1/2 mb-10"
  ></h2>
  <div
    class="overlay m-auto flex justify-center items-center w-fit sm:w-[820px] h-full"
  >
    <img
      class="w-full"
      src={cloudFrontUrl + "/assets/showcase-options-flow.png"}
      loading="lazy"
      alt="logo"
    />
  </div>
</section>

<section class="bg-[#0A0A0A] w-full max-w-screen">
  <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
    <div
      class="flex flex-col sm:flex-row items-center mt-10 mb-10 mx-auto justify-center"
    >
      <div class="m-auto sm:mx-8 text-center sm:text-start">
        <h2
          class="mb-4 text-4xl tracking-tight font-bold leading-tight text-white"
        >
          Start your free trial today
        </h2>
        <p class="mb-8 font-light font-medium text-white md:text-[1rem]">
          Try Octopi Platform for 7 days. No credit card required.
        </p>

        <a
          href="/register"
          class="animate-shine w-fit m-auto group relative grid overflow-hidden rounded-xl px-6 py-3 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors"
        >
          <span>
            <span
              class="spark mask-gradient animate-flip before:animate-kitrotate absolute inset-0 h-[100%] w-[100%] overflow-hidden rounded-xl [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]"
            />
          </span>
          <span
            class="backdrop absolute inset-px rounded-[11px] bg-[#FBCE3C] transition-colors duration-200 group-hover:bg-[#be9204"
          />
          <span class="z-10 text-black text-[1rem] sm:text-lg font-semibold">
            <slot>Free trial for 7 days</slot>
          </span>
        </a>
      </div>
      <!--<img class="w-72 sm:w-[450px] -my-8 mt-8 sm:mt-0 sm:-my-16" src={test} alt="logo">-->
    </div>
  </div>
</section>

<style lang="scss">
  .overlay {
    position: relative;
  }

  .overlay img {
    width: 100%;
    height: auto;
  }

  .overlay::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0) 50%);
    pointer-events: none; /* Ensure the overlay doesn't interfere with interaction */
  }

  .bg-radial-gradient {
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: radial-gradient(
      circle at top,
      rgba(255, 165, 0, 1) 0%,
      rgba(255, 165, 0, 0.7) 30%,
      rgba(128, 0, 128, 0.7) 70%,
      rgba(128, 0, 128, 1) 100%
    );
    filter: blur(200px);
  }

  .fade-down {
    -webkit-transform: translate3d(0, -25px, 0);
    transform: translate3d(0, -25px, 0);
    opacity: 0;
    animation: fadeDown 0.6s ease-out forwards;
  }

  @keyframes fadeDown {
    to {
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }
</style>
