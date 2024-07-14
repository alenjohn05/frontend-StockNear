<script lang="ts">
  import { numberOfUnreadNotification } from "$lib/store";
  /*
  import { intersect } from 'svelte-intersection-observer-action';

  
  const threshold = 0.4 // change the threshold value to 0.4 for 40%
	const rootMargin = '-0px 0px'
	const intersectOptions = { callback, threshold, rootMargin }
	function callback(entry: IntersectionObserverEntry) {
		if (entry.intersectionRatio > threshold) {
      entry.target.classList.remove('invisible')
			entry.target.classList.add('')
    }
  }
  */

  let cloudFrontUrl = import.meta.env.VITE_IMAGE_URL;
</script>

<svelte:head>
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} About
    · Octopi</title
  >
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />

  <meta
    name="description"
    content="Welcome to Octopi — a site that aims to be the internet's best source of free stock data and information for small investors."
  />
  <!-- Other meta tags -->
  <meta property="og:title" content="About · Octopi" />
  <meta
    property="og:description"
    content="Welcome to Octopi — a site that aims to be the internet's best source of free stock data and information for small investors."
  />
  <meta property="og:type" content="website" />
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="About · Octopi" />
  <meta
    name="twitter:description"
    content="Welcome to Octopi — a site that aims to be the internet's best source of free stock data and information for small investors."
  />
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>

<body>
  <div class="w-full max-w-4xl overflow-hidden m-auto min-h-screen pt-10 mb-40">
    <!--Start Mission-->
    <div
      class="bg-[#131722] w-full hover:border-slate-500 border-[#3F3F4080] h-auto sm:p-10 mt-3"
    >
      <div class="text-white text-4xl sm:text-5xl text-center p-3 sm:mt-5">
        <span class="font-bold">
          Empowering Users with Transparent Stock Analysis.
        </span>
      </div>

      <div class="text-white text-lg mt-3 text-center pl-10 pr-10">
        Our mission is to pioneer a comprehensive stock analysis platform where
        user interests come first. Rooted in ethical design principles,
        transparency is central to our ethos. That's why our entire codebase is
        open to scrutiny, ensuring complete trust and accountability. We believe
        in empowering users with the tools and insights they need to make
        informed investment decisions confidently. At our core, we are committed
        to fostering a community-driven approach to stock analysis. By
        prioritizing user needs and maintaining transparency in our operations,
        we aim to build a platform that truly serves its users. Join us in
        reshaping the landscape of stock analysis with a commitment to integrity
        and user-centric innovation..
        <!-- Start Image -->
        <div class="m-auto flex justify-center mt-6">
          <div class="relative">
            <div
              class="z-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <img
                class="w-28 mr-4"
                src={cloudFrontUrl + "/assets/globe.png"}
                alt="logo"
                loading="lazy"
              />
            </div>
            <svg
              id="visual"
              viewBox="0 0 960 540"
              width="380"
              height="200"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="12" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g transform="translate(506.6556351091302 253.49315711627338)">
                <path
                  d="M141.5 -60.2C185.5 -5.4 224.8 73.5 200.5 122.1C176.1 170.7 88 188.8 -4.7 191.5C-97.4 194.3 -194.9 181.5 -236.6 122.9C-278.3 64.3 -264.3 -40.1 -215.6 -97.5C-166.9 -155 -83.4 -165.5 -17.4 -155.5C48.7 -145.5 97.4 -114.9 141.5 -60.2"
                  fill="#1E40AF"
                  stroke-width="10"
                  filter="url(#glow)"
                ></path>
              </g>
            </svg>
          </div>
        </div>
        <!-- End Image -->
      </div>
    </div>
    <!--End Mission-->

    <!-- Start Section-->
    <div
      class="bg-[#131722] w-full hover:border-slate-500 border-[#3F3F4080] h-auto pl-1 pr-1 sm:pl-0 sm:pr-0 pb-10 mb-8"
    >
      <div
        class="text-4xl sm:text-5xl text-white text-center p-3 mt-10 sm:mt-5"
      >
        <span class="font-bold">
          Empowering Retail Traders with Institutional-Grade Insights
        </span>
      </div>

      <div class="text-white text-lg mt-3 text-center pl-10 pr-10">
        At Octopi, we bring institutional-quality data and AI analysis directly
        to retail traders. By bridging the gap between institutions and
        individual investors, we enrich your stock analysis with diverse data
        sources. Take charge of your investments, leverage informed
        decision-making, and execute profitable trades through our intuitive
        user interface. We believe in democratizing access to high-quality,
        accurate information previously exclusive to hedge funds and
        institutional investors. Our platform equips you with comprehensive
        data, ensuring you have the tools needed to succeed in the market.
        Whether you're exploring opportunities or fine-tuning strategies, Octopi
        empowers you with the insights to navigate confidently. Join us in
        transforming your trading experience with reliable data and
        sophisticated analysis. Octopi is your gateway to smarter investments
        and enhanced decision-making capabilities.
      </div>
    </div>
    <!--End Section-->
    <!--Start Why we need this -->
    <div
      class="bg-[#131722] w-full bg-[#131722] sm:border-t hover:border-slate-500 border-[#3F3F4080] h-auto sm:p-10 mt-3 mb-8"
    >
      <div
        class="text-4xl sm:text-5xl font-bold text-white text-center p-3 mt-10 sm:mt-5"
      >
        What we offer
      </div>

      <div
        class="text-white text-lg mt-3 text-center pl-3 pr-3 sm:pl-10 sm:pr-10"
      >
        Empower retail traders with exclusive institutional-grade data and AI
        analysis. Bridge the gap between institutions and individuals, enhancing
        stock analysis with diverse data sources. Take charge of your
        investments, make informed decisions, and execute profitable trades
        through our intuitive UI and comprehensive insights.
        <!-- Start Image -->
        <div class="m-auto flex justify-center mt-5">
          <div class="relative">
            <div
              class="z-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <img
                class="w-20 mr-8"
                src={cloudFrontUrl + "/assets/no_money_logo.png"}
                alt="logo"
                loading="lazy"
              />
            </div>
            <svg
              id="visual"
              viewBox="0 0 960 540"
              width="380"
              height="200"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              version="1.1"
            >
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="12" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g transform="translate(506.6556351091302 253.49315711627338)">
                <path
                  d="M141.5 -60.2C185.5 -5.4 224.8 73.5 200.5 122.1C176.1 170.7 88 188.8 -4.7 191.5C-97.4 194.3 -194.9 181.5 -236.6 122.9C-278.3 64.3 -264.3 -40.1 -215.6 -97.5C-166.9 -155 -83.4 -165.5 -17.4 -155.5C48.7 -145.5 97.4 -114.9 141.5 -60.2"
                  fill="#1E40AF"
                  stroke-width="10"
                  filter="url(#glow)"
                ></path>
              </g>
            </svg>
          </div>
        </div>
        <!-- End Image -->
      </div>
    </div>
    <!--End Why we need this -->
  </div>
</body>
