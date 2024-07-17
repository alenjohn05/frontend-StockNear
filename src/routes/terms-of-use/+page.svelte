<script>
  import logo from "$lib/images/terms_of_use_logo_v3.png";
  import { numberOfUnreadNotification } from "$lib/store";
</script>

<svelte:head>
  <title>
    {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ""} Terms
    of Use · Octopi</title
  >
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />

  <!-- Other meta tags -->
  <meta property="og:title" content="Terms of Use · Octopi" />
  <meta
    property="og:image"
    content="https://Octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <meta property="og:type" content="website" />
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Terms of Use · Octopi" />
  <meta
    name="twitter:image"
    content="https://Octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"
  />
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>

<section
  class="w-full max-w-4xl overflow-hidden m-auto min-h-screen pt-5 pb-40"
>
  <!--
    <div class="text-sm breadcrumbs ml-4">
      <ul>
        <li><a href="/" class="text-gray-300">Home</a></li> 
        <li class="text-gray-300">Terms of Use</li>
      </ul>
    </div>
    -->

  <div
    class="w-full m-auto sm:bg-[#111111] sm:rounded-xl h-auto p-10 mt-3 mb-10"
  >
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
      <!-- Start Column -->
      <div>
        <div class="flex flex-row justify-center items-center">
          <h1
            class="text-3xl sm:text-4xl text-white text-center font-bold mb-5"
          >
            Terms of Use
          </h1>
        </div>

        <span
          class="text-white text-md font-medium text-center flex justify-center items-center"
        >
          The most captivating bedtime story you'll nod off to before you know
          it.
        </span>
      </div>
      <!-- End Column -->

      <!-- Start Column -->
      <div class="relative m-auto">
        <svg
          class="w-40 -my-5"
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

        <div class="z-1 absolute top-5">
          <img class="w-28 ml-5" src={logo} alt="logo" />
        </div>
      </div>
      <!-- End Column -->
    </div>
  </div>

  <div
    class="card w-full bg-[#111111] border-t sm:border rounded-none sm:rounded-xl border-[#3F3F4080] m-auto"
  >
    <div class="card-body">
      <p class="text-gray-400 italic mb-2 text-sm">Last updated: 21.06.2024</p>

      <p class="text-gray-300 mb-5">
        Please review the terms and conditions carefully before using this
        website. By using the site, you agree to these terms and our
        <a
          href="/privacy-policy"
          class="text-[#03CA9B] hover:text-white hover:underline"
          >Privacy Policy</a
        >. Octopi reserves the right to change or amend these conditions at any
        time.
      </p>

      <h1 class="text-white text-2xl font-medium text-start underline">
        Octopi does not provide investment advice
      </h1>
      <p class="text-gray-300 mb-5">
        The information provided is solely for educational purposes only. Before
        making any investments or financial decisions, we recommend that you
        consult with a knowledgeable financial adviser.
        <br />
        <br />
        Octopi's content is not financial advice in any way. We do not and will never
        make recommendations on our website. Our analyst data is sourced from a third
        party, and we caution against making decisions solely based on analyst price
        predictions or projections. This information is provided to help users learn
        more about equities and understand analysts' perspectives, recognizing that
        analysts can make errors which can pose risks if solely relied upon.
        <br />
        <br />
        Octopi does not know your personal investment goals or risk tolerance, and
        therefore, we do not provide financial advice on our platform.
        <br />
        <br />
        We strongly advise seeking expert assistance, whether for financial, legal,
        or tax guidance. Such services are not offered by Octopi.
        <br />
        <br />
        Octopi is not a broker/dealer or a licensed investment advisor.
        <br />
        <br />
        IN NO EVENT SHALL ANY OF THE OCTOPI PARTIES BE LIABLE FOR ANY INVESTMENT
        GAIN OR LOSS YOU INCUR IN THE STOCK MARKET.
        <br />
        <br />
        YOU AGREE THAT THE SERVICE DOES NOT PROVIDE TRADING, INVESTING, FINANCIAL,
        TAX, LEGAL, OR OTHER ADVICE, AND YOU ACCEPT SOLE RESPONSIBILITY FOR ANY DECISIONS
        YOU MAKE BASED ON INFORMATION OBTAINED FROM THE SERVICE. THE SERVICE DOES
        NOT PROVIDE FINANCIAL PLANNING, INVESTMENT ADVICE, BROKERAGE, OR TAX ADVICE.
      </p>

      <h1 class="text-2xl font-medium text-white text-start underline">
        Octopi does not guarantee accuracy of data
      </h1>
      <p class="text-gray-300 mb-5">
        Our stock data is sourced from various providers. While we strive for
        accuracy, we cannot guarantee it at all times. Prior to making any
        investment decisions, Octopi advises verifying the accuracy of data by
        reviewing a company's SEC filings.
      </p>

      <h1 class="text-2xl font-medium text-white text-start underline">
        Use of our content
      </h1>
      <p class="text-gray-300 mb-5">
        Republishing our content in its entirety without our express
        authorization is not permitted. However, you may use snippets of the
        content provided that you do not modify them and clearly attribute where
        you obtained them from.
      </p>

      <h1 class="text-2xl font-medium text-white text-start underline">
        Liability of Octopi and its authors
      </h1>
      <p class="text-gray-300 mb-5">
        Octopi and its authors will not be liable to any party for damages
        resulting from the use of the site's content. While we strive for
        accuracy, completeness, and timeliness in the content we provide, we
        cannot guarantee it.
        <br /><br />
        As a service provider, we are responsible for our own content on these pages
        under the general laws according to § 7 para.1 TMG. However, according to
        §§ 8 to 10 TMG, we are not obligated as a service provider to monitor transmitted
        or stored third-party information or to investigate circumstances indicating
        illegal activity. Obligations to remove or block the use of information under
        the general laws remain unaffected. Liability in this regard is only possible
        from the point in time at which a concrete infringement of the law becomes
        known to us. If we become aware of such infringements, we will promptly remove
        the content in question.
      </p>

      <h1 class="text-2xl font-medium text-white text-start underline">
        Copyright
      </h1>
      <p class="text-gray-300 mb-5">
        The content and works created by the site operators on these pages are
        subject to German copyright law. Reproduction, editing, distribution,
        and any kind of exploitation beyond the limits of copyright require the
        written consent of the respective author or creator. Downloads and
        copies of this site are permitted only for private, non-commercial use.
        Where content on this site was not created by the operator, the
        copyrights of third parties are respected, with third-party content
        appropriately identified.
        <br /><br />
        If you become aware of a copyright infringement, please inform us accordingly.
        Upon becoming aware of such infringements, we will promptly remove the content
        in question.
        <br /><br />
        We respect the intellectual property rights of others. It is our policy to
        respond to any allegations that content submitted on the service violates
        the copyright or other intellectual property rights of any person or entity
        ("Infringement").
        <br /><br />
        If you are a copyright owner or authorized to act on their behalf and believe
        that copyrighted work has been copied in a way that constitutes copyright
        infringement, please submit your claim via email to dcma@stockunlock.com,
        with the subject line: "Copyright Infringement." Include in your claim a
        detailed description of the alleged infringement as specified under "DMCA
        Notice and Procedure for Copyright Infringement Claims."
        <br /><br />
        You may be held liable for damages (including costs and attorneys' fees)
        for misrepresentation or bad-faith claims regarding infringement of any content
        found on or through the service regarding your copyright.
        <br /><br />
        Some images used on this website are from
        <a
          href="https://de.freepik.com/"
          class="text-[#03CA9B] sm:hover:text-white">FreePik</a
        >.
      </p>

      <h3 class="text-2xl font-medium text-white text-start underline">
        Subscriptions
      </h3>
      <p class="text-gray-300 mb-5">
        We may offer you the ability to purchase subscriptions via Lemon
        Squeezy. Specific terms related to a subscription will be disclosed to
        you at or before the time of purchase, and by purchasing the
        subscription, you agree to those terms.
        <br /><br />
        Subscription fees are due in advance, and your subscription will automatically
        renew for the original subscription period (e.g., annual) until you decide
        to cancel. You can cancel via the billing portal on the Account Settings
        page or by emailing support@Octopi.com.
        <br /><br />
        If you are not completely satisfied with your purchase, you can receive a
        full refund of subscription fees within 30 days from the initial purchase
        date. After 30 days, subscription fees are non-refundable. Refund requests
        can be sent to support@Octopi.com.
      </p>

      <h3 class="text-2xl font-medium text-white text-start underline">
        Changes to the Price and Service Plans
      </h3>
      <p class="text-gray-300 mb-5">
        We reserve the right to adjust the price of our subscription plans as
        necessary to reflect changes in costs associated with our service, such
        as production, licensing, technical provision, and customer service
        costs. Price changes will take effect no sooner than 7 days after notice
        to you. You can cancel your membership at any time during the notice
        period to avoid future charges.
      </p>

      <h1 class="text-2xl font-medium text-white text-start underline">
        Termination
      </h1>

      <div class="text-gray-300">
        We may terminate or suspend your account and access to the Service at
        any time, without prior notice and for any reason, including breaches of
        the Terms.
        <br /><br />
        To close your account, simply stop using the Service or contact us via email,
        and we will delete your account.
        <br /><br />
        All provisions of the Terms that should logically survive termination will
        do so, including ownership provisions, warranty disclaimers, indemnity, and
        liability limitations.
      </div>

      <h1 class="text-2xl font-medium text-white text-start underline">
        Amendments To Terms
      </h1>

      <div class="text-gray-300">
        We may amend the Terms at any time by posting the amended terms on this
        site. It is your responsibility to review these Terms periodically.
        <br /><br />
        Your continued use of the Platform following the posting of revised Terms
        means that you accept and agree to the changes. You are expected to check
        this page frequently to stay informed of any changes, as they are binding
        on you.
        <br /><br />
        By continuing to access or use our Service after any revisions become effective,
        you agree to be bound by the revised terms. If you do not agree to the new
        terms, you are no longer authorized to use the Service.
      </div>

      <h1 class="text-2xl font-medium text-white text-start underline">
        Data Disclaimer
      </h1>

      <div class="text-gray-300">
        All data on this website is provided solely for informational purposes
        and should not be used to make trading or investing decisions.
        <br /><br />
        We strive to display the highest-quality and most accurate statistics possible.
        If you identify any errors or inconsistencies, please notify us via the contact
        form or by emailing us directly at support@Octopi.com.
        <br /><br />
        Our Financial Data is provided solely by
        <a
          href="https://site.financialmodelingprep.com/"
          class="text-[#03CA9B] hover:underline">FMP</a
        >
        and
        <a
          href="https://docs.benzinga.com/home"
          class="text-[#03CA9B] hover:underline">Benzinga</a
        >.
      </div>

      <h1 class="text-2xl font-medium text-white text-start underline">
        Complete Agreement
      </h1>
      <p class="text-gray-300 mb-5">
        These terms and conditions of use, together with our
        <a
          href="/privacy-policy"
          class="text-[#03CA9B] hover:text-white hover:underline"
          >Privacy Policy</a
        >
        and
        <a
          href="/imprint"
          class="text-[#03CA9B] hover:text-white hover:underline">Imprint</a
        >, represent the entire agreement between you and Octopi.
        <br /><br />
        YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE
        BOUND BY THEM BY USING THE SERVICE OR OTHER SERVICES PROVIDED BY US.
      </p>
    </div>
  </div>
</section>
