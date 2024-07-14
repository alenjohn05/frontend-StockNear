
<script>
  import { numberOfUnreadNotification } from '$lib/store';

  const emailAddress = 'support@Octopi.com';
  let cloudFrontUrl = import.meta.env.VITE_IMAGE_URL;


</script>


<svelte:head>
  <title> {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ''} Imprint · Octopi</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />

  <meta name="description" content="Imprint of Octopi. Contact Information if you need help.">
  <!-- Other meta tags -->
  <meta property="og:title" content="Imprint · Octopi"/>
  <meta property="og:description" content="Imprint of Octopi. Contact Information if you need help.">
  <meta property="og:image" content="https://Octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"/>
  <meta property="og:type" content="website"/>
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="Imprint · Octopi"/>
  <meta name="twitter:description" content="Imprint of Octopi. Contact Information if you need help.">
  <meta name="twitter:image" content="https://Octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"/>
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>


<section class="w-full max-w-4xl overflow-hidden m-auto min-h-screen pt-5 pb-40">
  <!--  
  <div class="text-sm breadcrumbs ml-4">
    <ul>
      <li><a href="/" class="text-gray-300">Home</a></li> 
      <li class="text-gray-300">Imprint</li>
    </ul>
  </div>
  -->

  <div  class="w-full m-auto sm:bg-[#131722] sm:rounded-xl h-auto p-10 mt-3 mb-5 sm:mb-10">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
  
      <!-- Start Column -->
      <div>
        <div class="flex flex-row justify-center items-center">
          <h1 class="text-3xl sm:text-4xl text-white text-center font-bold mb-5">
            Imprint
          </h1>
        </div>

        <span class="text-white text-md font-medium text-center flex justify-center  items-center ">
          because India loves democracy
        </span>
      </div>
      <!-- End Column -->
  
      <!-- Start Column -->
      <div class="relative m-auto">
        <svg class="w-40 -my-5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="5" result="glow"/>
              <feMerge>
                <feMergeNode in="glow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path fill="#1E40AF" d="M57.6,-58.7C72.7,-42.6,81.5,-21.3,82,0.5C82.5,22.3,74.7,44.6,59.7,60.1C44.6,75.6,22.3,84.3,0,84.3C-22.3,84.2,-44.6,75.5,-61.1,60.1C-77.6,44.6,-88.3,22.3,-87.6,0.7C-86.9,-20.8,-74.7,-41.6,-58.2,-57.7C-41.6,-73.8,-20.8,-85.2,0.2,-85.4C21.3,-85.6,42.6,-74.7,57.6,-58.7Z" transform="translate(100 100)" filter="url(#glow)" />
        </svg>
        
        
        <div class="z-1 absolute top-4 left-4">
          <img class="w-[70px] ml-5" src={cloudFrontUrl+"/assets/imprint_logo.png"} alt="logo" loading='lazy'>
        </div>
      </div>
      <!-- End Column -->
  
    </div>
    
  </div>


  <div class="card w-full bg-[#131722] border-t rounded-none sm:rounded-xl sm:border border-[#3F3F4080] m-auto">
    <div class="card-body">
      <p class="text-white italic mb-2">
        As per Indian regulations
      </p>
  
      <p class="text-white mb-5">
        Octopi India Pvt. Ltd.
        <br>
        3rd Floor, Revias Nivas
        <br>
        Calicut
        <br>
        Email: <a href="mailto:your@email.com" class="text-[#03CA9B] hover:text-white hover:underline">itsalenjohn@email.com</a>.
        <br>
        <br>
        Managing Director: Alen John
        <br>
        <br>
        Registered with the Registrar of Companies under: 243547453452638GDHJ
        <br>
        GSTIN: GDT409GH
      </p>
  
      <p class="text-white mb-5">
        Responsible for content as per Indian law
        <br>
        Notice according to the Online Dispute Resolution Regulation
      </p>
  
      <p class="text-white mb-5">
        Under applicable law, we inform consumers about the existence of the Indian Consumer Dispute Resolution platform for resolving disputes without going to court. The platform can be accessed at:
        <a target="_blank" href="http://www.consumerhelpline.gov.in">http://www.consumerhelpline.gov.in</a>.
        <br>
        However, we are not currently participating in the dispute resolution procedure through this platform. Please contact us using the email provided above.
      </p>
  
      <h1 class="text-white text-2xl text-start mb-5">
        Notice in accordance with Indian Consumer Dispute Settlement Act (CDSA)
      </h1>
      <p class="text-white mb-5">
        We are not obligated to participate in dispute resolution proceedings before a consumer arbitration board in India.
      </p>
  
      <h1 class="text-white text-2xl font-bold text-start mb-5">
        Disclaimer - Legal Notice
      </h1>
      
      <h1 class="text-white text-xl font-bold text-start mb-3 ml-2">
        § 1 Content Disclaimer
      </h1>
  
      <p class="text-white mb-3 ml-2">
        The content of this website has been created with the utmost care, but the provider does not guarantee the accuracy and timeliness of the information. Opinions expressed in contributed content belong to their respective authors and not necessarily to the provider. Accessing the content does not establish a contractual relationship between the user and the provider.
      </p>
  
      <h1 class="text-white text-xl font-bold text-start mb-3 ml-2">
        § 2 External Links
      </h1>
  
      <p class="text-white mb-3 ml-2">
        This website may contain links to third-party websites ("external links"), which are under the liability of their respective operators. The provider reviewed external content for legal violations at the time of linking, but ongoing monitoring is not feasible without concrete evidence of violations. Upon awareness of legal violations, such links will be promptly removed.
      </p>
  
      <h1 class="text-white text-xl font-bold text-start mb-3 ml-2">
        § 3 Copyrights and Ancillary Rights
      </h1>
  
      <p class="text-white mb-3 ml-2">
        The content on this website is subject to Indian copyright and ancillary rights laws. Unauthorized use requires prior written consent from the provider or copyright holder, except for personal, private, and non-commercial purposes. Third-party content is marked accordingly. Reproduction or transmission of content, in whole or in part, without permission is prohibited and punishable by law. Displaying this website within frames of other sites requires written permission.
      </p>
  
      <h1 class="text-white text-xl font-bold text-start mb-3 ml-2">
        § 4 Special Conditions of Use
      </h1>
  
      <p class="text-white mb-3 ml-2">
        Specific terms and conditions applicable to certain uses of this website will be explicitly stated where relevant. Such terms and conditions will prevail in those specific cases.
      </p>
  
    </div>
  </div>
  

  
      



</section>