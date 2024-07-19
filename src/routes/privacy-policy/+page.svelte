<div  class="w-full m-auto sm:bg-[#0d1117] sm:rounded-xl h-auto pl-10 pr-10 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8 border-slate-700"></div>
<script>
    import logo from '$lib/images/privacy_policy_logo_v2.png';
    import { numberOfUnreadNotification } from '$lib/store';
    const emailAddress = 'support@Octopi.com';

</script>



<svelte:head>
  <title> {$numberOfUnreadNotification > 0 ? `(${$numberOfUnreadNotification})` : ''} Privacy Policy · Octopi</title>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />

  <!-- Other meta tags -->
  <meta property="og:title" content="Privacy Policy · Octopi"/>
  <meta property="og:image" content="https://Octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"/>
  <meta property="og:type" content="website"/>
  <!-- Add more Open Graph meta tags as needed -->

  <!-- Twitter specific meta tags -->
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="Privacy Policy · Octopi"/>
  <meta name="twitter:image" content="https://Octopi-pocketbase.s3.amazonaws.com/logo/meta_logo.jpg"/>
  <!-- Add more Twitter meta tags as needed -->
</svelte:head>
	    

<section class="w-full max-w-4xl overflow-hidden m-auto min-h-screen pt-5 pb-40">
  <!--
  <div class="text-sm breadcrumbs ml-4">
    <ul>
      <li><a href="/" class="text-gray-300">Home</a></li> 
      <li class="text-gray-300">Privacy Policy</li>
    </ul>
  </div>
  -->

  <div class="w-full m-auto sm:bg-[#0d1117] sm:rounded-xl h-auto pl-10 pr-10 pt-5 sm:pb-10 sm:pt-10 mt-3 mb-8">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
  
      <!-- Start Column -->
      <div>
        <div class="flex flex-row justify-center items-center">
          <h1 class="text-3xl sm:text-4xl text-white text-center font-bold mb-5">
            Privacy Policy
          </h1>
        </div>

        <span class="text-white text-md font-medium text-center flex justify-center  items-center ">
          We do not sell your data; we prioritize your privacy!
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
        
        
        <div class="z-1 absolute top-5">
          <img class="w-24 ml-7" src={logo} alt="logo">
        </div>
      </div>
      <!-- End Column -->
  
    </div>
    
  </div>

  



    <div class="card w-full bg-[#0d1117] border-t sm:border rounded-none sm:rounded-xl border-[#3F3F4080] m-auto ">
      <div class="card-body">

          <p class="text-gray-400 italic mb-2 text-sm">Last updated: 22.06.2023</p>

          <p class="text-gray-300 mb-5">
              Octopi (the "website" or "site") respects your privacy.
              This privacy statement describes what information and data we collect from you and how we use it.
              Please read the entire privacy policy as well as our
              <a href="/terms-of-use" class="text-[#03CA9B] hover:underline hover:text-white">Terms of use</a>.
              The use of our website is generally possible without providing personal data. Where personal data (e.g., name, address, or email addresses) is collected on our pages, it is always done on a voluntary basis whenever possible. This data will not be shared with third parties without your explicit consent.
              Please note that data transmission over the Internet (e.g., communication via email) may have security vulnerabilities. Complete protection of data from access by third parties is not possible.
              The use of contact information published under the imprint obligation by third parties for sending unsolicited advertising and information materials is expressly prohibited. The operators of the pages expressly reserve the right to take legal action in the event of unsolicited sending of advertising information, such as spam emails.
          </p>

         
          <h1 class="text-white text-2xl font-medium text-start underline">
              Cookies      
          </h1> 
          <p class="text-gray-300">
              We use cookies on our website. By visiting Octopi.com, you agree to the use of cookies in accordance with the Octopi Privacy Policy.
              Most interactive websites use cookies to enable us to retrieve user details for each visit.
              Cookies on our website are used to enhance the functionality of specific areas, making it easier for visitors.
          </p>

          <h1 class="text-white text-2xl font-medium text-start mt-5 underline">
              Links to Other Sites
          </h1>

          <div class="text-gray-300">
              Our Service may contain links to websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
              <br>
              <br>
              We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party sites or services. 
          </div>

          <h1 class="text-white text-2xl font-medium text-start mt-5 underline">
              Security of Data
          </h1>

          <div class="text-gray-300">
              We value the security of your data, but please be aware that no method of transmission over the Internet or electronic storage is completely secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. 
          </div>

          <h1 class="text-white text-2xl font-medium text-start mt-5 underline">
              Your Data Protection Rights Under the General Data Protection Regulation (GDPR)
          </h1>

          <div class="text-gray-300">
              If you are a resident of the European Union (EU) and European Economic Area (EEA), you have specific data protection rights under GDPR.
              <br>
              <br>
              We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data. 
          
              <br>
              <br>
              If you wish to know what Personal Data we hold about you or request its deletion from our systems, please email us at 
              <a href={`mailto:${emailAddress}`} class="text-[#03CA9B] hover:text-white hover:underline">{emailAddress}</a>.
          
              <br>
              <br>
              Under certain circumstances, you have the following data protection rights: 
              <ol class="list-decimal ml-8 mt-2">
                  <li>
                      The right to access, update, or delete the information we have on you 
                  </li>
                  <li>
                      The right of rectification. You have the right to have your information corrected if it is inaccurate or incomplete 
                  </li>
                  <li>
                      The right to object. You have the right to object to our processing of your Personal Data; 
                  </li>
                  <li>
                      The right to restriction. You have the right to request that we restrict the processing of your personal information
                  </li>
                  <li>
                      The right to data portability. You have the right to receive a copy of your Personal Data in a structured, machine-readable format; 
                  </li>
                  <li>
                      The right to withdraw consent. You also have the right to withdraw your consent at any time where we rely on your consent to process your personal information; 
                  </li>
                  
              </ol>
              <br>
              <br>
              Please note that we may ask you to verify your identity before responding to such requests. Please note that we may not be able to provide the Service without certain necessary data. 

              <br>
              <br>
              You have the right to lodge a complaint with a Data Protection Authority about our collection and use of your Personal Data. For more information, please contact your local data protection authority in the European Economic Area (EEA). 
          </div>



          <h1 class="text-white text-2xl font-medium text-start mt-5 underline">
              Your Data Protection Rights under the California Privacy Protection Act (CalOPPA)
          </h1>

          <div class="text-gray-300">
              CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law extends beyond California, requiring any person or company in the United States (and potentially globally) that operates websites collecting personally identifiable information from California consumers to prominently display a privacy policy on its website that details what information is being collected and with whom it is being shared, and to comply with this policy. 
          <br>
          <br>
              According to CalOPPA, we agree to the following:
              <ol class="list-decimal ml-8 mt-2">
                  <li>
                      Users can visit our site anonymously
                  </li>
                  <li>
                      Our Privacy Policy link includes the word "Privacy" and is easily found on the bottom page of our website
                  </li>
                  <li>
                      Users will be notified of any privacy policy changes on our Privacy Policy page.
                  </li>
                  <li>
                      Users can change their personal information by emailing us at
                      <a href={`mailto:${emailAddress}`} class="text-[#03CA9B] hover:text-white hover:underline">{emailAddress}</a>.
                  </li>
                  
              </ol>
          <br>
          <br>
          Our Policy on “Do Not Track” Signals:
          We honor Do Not Track signals and do not track, plant cookies, or use advertising when a Do Not Track browser mechanism is in place. Do Not Track is a preference you can set in your web browser to inform websites that you do not want to be tracked.
          You can enable or disable Do Not Track by visiting the Preferences or Settings page of your web browser. 
          </div>



          <h1 class="text-white text-2xl font-medium text-start mt-5 underline">
              Children's Privacy
          </h1>

          <div class="text-gray-300">
              Children under the age of 18 ("Child" or "Children") are not allowed to use our Services.

              We do not knowingly collect personally identifiable information from children under the age of 18. Please inform us if you become aware that a Child has provided us with Personal Data. If we discover that we have collected Personal Data from Children without parental consent, we will take steps to remove that information from our servers. 
          </div>


         

          <h1 class="text-white text-2xl font-medium text-start mt-5 underline">
              Changes to this Privacy Policy
          </h1>

          <div class="text-gray-300">
              We reserve the right to amend our Privacy Policy at any time. Any changes will be communicated by posting the revised Privacy Policy on this page.
              <br>
              <br>
              We recommend that you review this Privacy Policy regularly for updates. Changes to this Privacy Policy are effective when they are posted on this page. 
          </div>

      </div>
    </div>

      
   



</section>

